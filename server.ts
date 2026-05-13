import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import matter from "gray-matter";
import yaml from "js-yaml";

// --- Domain Model ---
type ArtifactType = 'REQUIREMENT' | 'USE_CASE' | 'DESIGN' | 'COMPONENT' | 'CODE_ENTITY' | 'TEST' | 'DOCUMENTATION' | 'INCIDENT' | 'INFRASTRUCTURE' | 'DEPLOYMENT' | 'MONITORING' | 'MAINTENANCE';
type RelationType = 'DERIVES_FROM' | 'IMPLEMENTS' | 'VALIDATES' | 'JUSTIFIES' | 'TESTS' | 'BREAKS' | 'FIXES' | 'REFINES';
type ChangeType = 'ERROR' | 'FEATURE' | 'EVOLUTION' | 'REFACTOR' | 'ADAPTATION';

interface Version {
  id: string;
  timestamp: string;
  parentVersion: string | null;
  name: string;
}

interface SystemVersion {
  id: string;
  component: string;
  version: string;
  releaseDate: string;
}

interface Artifact {
  id: string;
  type: ArtifactType;
  subType?: string;
  title: string;
  description: string;
  version: string;
  systemVersionId?: string;
}

interface Relation {
  id: string;
  from: string;
  to: string;
  type: RelationType;
}

interface Change {
  id: string;
  type: ChangeType;
  title: string;
  description: string;
  affects: string[];
  versionFrom: string;
  versionTo: string;
}

interface GraphSnapshot {
  artifacts: Artifact[];
  relations: Relation[];
}

// --- In-Memory State ---
const state: {
  versions: Version[];
  systemVersions: SystemVersion[];
  graphs: Record<string, GraphSnapshot>;
  changes: Change[];
} = {
  versions: [],
  systemVersions: [],
  graphs: {},
  changes: []
};

function loadFromFiles() {
  const manifestPath = path.join(process.cwd(), 'docs', 'project-manifest.md');
  
  if (!fs.existsSync(manifestPath)) {
    console.error("Project manifest NOT found at /docs/project-manifest.md. Falling back to old JSON if exists...");
    const oldConfigPath = path.join(process.cwd(), 'archgraph.config.json');
    if (fs.existsSync(oldConfigPath)) {
      const config = JSON.parse(fs.readFileSync(oldConfigPath, 'utf-8'));
      state.versions = config.versions;
      state.systemVersions = config.systemVersions || [];
      state.changes = config.changes || [];
    } else {
      console.error("Critical: No configuration found.");
      return;
    }
  } else {
    try {
      const fileContent = fs.readFileSync(manifestPath, 'utf-8');
      const { data, content } = matter(fileContent);
      
      const parseYamlBlock = (header: string) => {
        const regex = new RegExp(`## ${header}[\\s\\S]*?` + '```yaml' + `([\\s\\S]*?)` + '```');
        const match = content.match(regex);
        if (match && match[1]) {
           return yaml.load(match[1]) as any[];
        }
        return [];
      };

      state.versions = parseYamlBlock('Versions');
      state.systemVersions = parseYamlBlock('System Versions');
      state.changes = parseYamlBlock('Changes');
      
      console.log(`Loaded ${state.versions.length} versions from manifest.`);
    } catch (e) {
      console.error("Error parsing manifest.md:", e);
    }
  }

  const docsDir = path.join(process.cwd(), 'docs');
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir);
  }

  const allArtifacts: Artifact[] = [];
  const allRelations: Relation[] = [];

  const scanDocs = (dir: string) => {
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        scanDocs(fullPath);
      } else if (item.endsWith('.md') && item !== 'project-manifest.md') {
        try {
          const fileContent = fs.readFileSync(fullPath, 'utf-8');
          const sections = fileContent.split(/---+\r?\n/);
          
          // If the file starts with ---, the first section is empty
          // We want to pair metadata blocks with their following content blocks
          // Or if it's just meta + body (standard frontmatter)
          
          let i = 0;
          if (fileContent.trim().startsWith('---')) i = 1;

          for (; i < sections.length; i += 1) {
            const section = sections[i].trim();
            if (section.length < 5) continue;

            // Try to parse the section as YAML
            let data: any = null;
            let body = '';

            try {
              // Try to see if this section IS the metadata
              // We'll strip ## prefixes but KEEP indentation
              const yamlCandidate = sections[i].split('\n')
                .map(l => l.replace(/^##\s?/, ''))
                .join('\n');
              
              const parsed = yaml.load(yamlCandidate) as any;
              if (parsed && typeof parsed === 'object' && parsed.id && parsed.type) {
                data = parsed;
                // The next section is the body
                if (i + 1 < sections.length) {
                  body = sections[i+1].trim();
                  i++; // skip body section in next iteration
                }
              } else {
                // Not a meta block, maybe it's just body
                continue;
              }
            } catch (e) {
              // Not YAML or missing required fields
              continue;
            }

            const id = String(data.id || data.ID || '');
            const typeValue = (data.type || data.Type) as ArtifactType;
            if (!id || !typeValue) continue;

            const artifact: Artifact = {
              id,
              type: typeValue,
              subType: data.subType || data.subtype || data.SubType,
              title: String(data.title || data.Title || id),
              version: String(data.version || data.Version || 'v-1'),
              description: body,
              systemVersionId: data.systemVersionId || data.systemversionid
            };
            allArtifacts.push(artifact);

            const rels = data.relations || data.Relations;
            if (rels) {
              const relArray = Array.isArray(rels) ? rels : [rels];
              relArray.forEach((rel: any, idx: number) => {
                const to = typeof rel === 'string' ? rel : (rel.to || rel.id || rel.ID);
                if (to) {
                   allRelations.push({
                      id: `rel-${artifact.id}-${idx}`,
                      from: artifact.id,
                      to: String(to),
                      type: rel.type || (artifact.type === 'TEST' ? 'TESTS' : 'IMPLEMENTS')
                   });
                }
              });
            }
          }
        } catch (err) {
          console.error(`Error processing ${fullPath}:`, err);
        }
      }
    }
  };
  
  console.log("Scanning /docs for artifacts...");
  scanDocs(docsDir);
  console.log(`Discovered ${allArtifacts.length} artifacts and ${allRelations.length} relations.`);

  // Reconstruct graphs for each version
  // For this demo, version snapshots are cumulative
  state.versions.forEach(v => {
    state.graphs[v.id] = {
      artifacts: allArtifacts.filter(a => a.version === v.id || isDescendant(v.id, a.version)),
      relations: allRelations.filter(r => {
        const fromArt = allArtifacts.find(a => a.id === r.from);
        return fromArt && (fromArt.version === v.id || isDescendant(v.id, fromArt.version));
      })
    };
  });
}

function isDescendant(currentVersionId: string, artifactVersionId: string): boolean {
    const artifactVersion = state.versions.find(v => v.id === artifactVersionId);
    const currentVersion = state.versions.find(v => v.id === currentVersionId);
    if (!artifactVersion || !currentVersion) return false;
    
    let temp = currentVersion;
    let depth = 0;
    while (temp.parentVersion) {
        depth++;
        if (depth > 20) {
            console.error("Circular dependency detected in versions!", currentVersionId);
            return false;
        }
        if (temp.parentVersion === artifactVersionId) return true;
        const parent = state.versions.find(v => v.id === temp.parentVersion);
        if (!parent) break;
        temp = parent;
    }
    return false;
}

try {
  loadFromFiles();
  console.log("Initial state loaded successfully");
} catch (error) {
  console.error("Failed to load initial state:", error);
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- API Routes ---

  app.get('/api/state', (req, res) => {
    res.json(state);
  });

  app.get('/api/versions', (req, res) => {
    res.json(state.versions);
  });

  app.get('/api/versions/:id/graph', (req, res) => {
    const { id } = req.params;
    const graph = state.graphs[id];
    if (!graph) return res.status(404).json({ error: 'Version not found' });
    res.json(graph);
  });

  app.get('/api/changes', (req, res) => {
    res.json(state.changes);
  });

  app.get('/api/system-versions', (req, res) => {
    res.json(state.systemVersions);
  });

  // Basic health
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`>>> SERVER READY: Listening on port ${PORT} <<<`);
  });
}

startServer();
