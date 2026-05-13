import fs from "fs";
import path from "path";
import matter from "gray-matter";
import yaml from "js-yaml";

// --- Domain Model (Mirroring server.ts) ---
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

interface StaticState {
  versions: Version[];
  systemVersions: SystemVersion[];
  graphs: Record<string, GraphSnapshot>;
  changes: Change[];
}

const state: StaticState = {
  versions: [],
  systemVersions: [],
  graphs: {},
  changes: []
};

function isDescendant(currentVersionId: string, artifactVersionId: string, versions: Version[]): boolean {
    const artifactVersion = versions.find(v => v.id === artifactVersionId);
    const currentVersion = versions.find(v => v.id === currentVersionId);
    if (!artifactVersion || !currentVersion) return false;
    
    let temp = currentVersion;
    let depth = 0;
    while (temp.parentVersion) {
        depth++;
        if (depth > 20) return false;
        if (temp.parentVersion === artifactVersionId) return true;
        const parent = versions.find(v => v.id === temp.parentVersion);
        if (!parent) break;
        temp = parent;
    }
    return false;
}

function generate() {
  console.log("🚀 Starting ArchGraph Static Generation...");

  const manifestPath = path.join(process.cwd(), 'docs', 'project-manifest.md');
  
  if (!fs.existsSync(manifestPath)) {
    console.error("❌ Manifest not found.");
    process.exit(1);
  }

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

  const docsDir = path.join(process.cwd(), 'docs');
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
        const fileC = fs.readFileSync(fullPath, 'utf-8');
        const sections = fileC.split(/---+\r?\n/);
        
        let i = 0;
        if (fileC.trim().startsWith('---')) i = 1;

        for (; i < sections.length; i += 1) {
          const section = sections[i].trim();
          if (section.length < 5) continue;

          try {
            const yamlCandidate = sections[i].split('\n')
              .map(l => l.replace(/^##\s?/, ''))
              .join('\n');
            
            const parsed = yaml.load(yamlCandidate) as any;
            if (parsed && typeof parsed === 'object' && parsed.id && parsed.type) {
              const body = (i + 1 < sections.length) ? sections[i+1].trim() : '';
              if (i + 1 < sections.length) i++;

              const id = String(parsed.id || parsed.ID || '');
              const typeValue = (parsed.type || parsed.Type) as ArtifactType;

              const artifact: Artifact = {
                id,
                type: typeValue,
                subType: parsed.subType || parsed.subtype || parsed.SubType,
                title: String(parsed.title || parsed.Title || id),
                version: String(parsed.version || parsed.Version || 'v-1'),
                description: body,
                systemVersionId: parsed.systemVersionId || parsed.systemversionid
              };
              allArtifacts.push(artifact);

              const rels = parsed.relations || parsed.Relations;
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
          } catch (e) {
            continue;
          }
        }
      }
    }
  };

  scanDocs(docsDir);

  state.versions.forEach(v => {
    state.graphs[v.id] = {
      artifacts: allArtifacts.filter(a => a.version === v.id || isDescendant(v.id, a.version, state.versions)),
      relations: allRelations.filter(r => {
        const fromArt = allArtifacts.find(a => a.id === r.from);
        return fromArt && (fromArt.version === v.id || isDescendant(v.id, fromArt.version, state.versions));
      })
    };
  });

  const outDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  fs.writeFileSync(
    path.join(outDir, 'graph-data.json'),
    JSON.stringify(state, null, 2)
  );

  console.log("✅ Static data generated at public/graph-data.json");
}

generate();
