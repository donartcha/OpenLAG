import fs from "fs";
import path from "path";
import matter from "gray-matter";
import yaml from "js-yaml";
import { Artifact, ArtifactType, Relation, RelationType, Change, ChangeType, SystemVersion, Version } from "../../src/types";
import { inferLayer } from "../../src/core/semantic/artifact-layers.js";
import { inferRelationSemantics } from "../../src/core/semantic/relation-definitions.js";

export interface ParsedArtifact extends Artifact {
  file: string;
  status?: 'draft' | 'in_progress' | 'ready' | 'closed' | 'deprecated';
}

export interface ParsedRelation extends Relation {
  file: string;
}

export interface ParseError {
  file: string;
  message: string;
}

export interface OpenLagData {
  versions: Version[];
  systemVersions: SystemVersion[];
  changes: Change[];
  artifacts: ParsedArtifact[];
  relations: ParsedRelation[];
  errors: ParseError[];
}

export function parseOpenLagDocs(docsDir: string): OpenLagData {
  const state: OpenLagData = {
    versions: [],
    systemVersions: [],
    changes: [],
    artifacts: [],
    relations: [],
    errors: []
  };

  const manifestPath = path.join(docsDir, 'project-manifest.md');
  if (!fs.existsSync(manifestPath)) {
    state.errors.push({ file: manifestPath, message: "Manifest not found" });
    return state;
  }

  const fileContent = fs.readFileSync(manifestPath, 'utf-8');
  const { content } = matter(fileContent);

  const parseYamlBlock = (header: string) => {
    const regex = new RegExp(`## ${header}[\\s\\S]*?` + '```yaml' + `([\\s\\S]*?)` + '```');
    const match = content.match(regex);
    if (match && match[1]) {
       return yaml.load(match[1]) as any[];
    }
    return [];
  };

  try {
    state.versions = parseYamlBlock('Versions') || [];
  } catch (e) {
    state.errors.push({ file: manifestPath, message: "Invalid YAML in Versions" });
  }

  try {
    state.systemVersions = parseYamlBlock('System Versions') || [];
  } catch (e) {
    state.errors.push({ file: manifestPath, message: "Invalid YAML in System Versions" });
  }

  try {
    state.changes = parseYamlBlock('Changes') || [];
  } catch (e) {
    state.errors.push({ file: manifestPath, message: "Invalid YAML in Changes" });
  }

  const scanDocs = (dir: string) => {
    if (!fs.existsSync(dir)) return;
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

          let parsed: any;
          try {
            const yamlCandidate = sections[i].split('\n')
              .map(l => l.replace(/^##\s?/, ''))
              .join('\n');
            
            parsed = yaml.load(yamlCandidate) as any;
          } catch (e) {
            state.errors.push({ file: fullPath, message: `Invalid YAML block: ${(e as Error).message}` });
            continue;
          }

          if (parsed && typeof parsed === 'object' && (parsed.id || parsed.ID) && (parsed.type || parsed.Type)) {
            const body = (i + 1 < sections.length) ? sections[i+1].trim() : '';
            if (i + 1 < sections.length) i++;

            const id = String(parsed.id || parsed.ID || '');
            const typeValue = (parsed.type || parsed.Type) as ArtifactType;

            const artifact: ParsedArtifact = {
              id,
              type: typeValue,
              subType: parsed.subType || parsed.subtype || parsed.SubType,
              title: String(parsed.title || parsed.Title || id),
              version: String(parsed.version || parsed.Version || 'v-1'),
              description: body,
              systemVersionId: parsed.systemVersionId || parsed.systemversionid,
              status: parsed.status,
              layer: inferLayer(typeValue),
              ownership: parsed.ownership || parsed.owner ? { owner: parsed.owner, ...parsed.ownership } : undefined,
              file: fullPath
            };
            state.artifacts.push(artifact);

            const rels = parsed.relations || parsed.Relations;
            if (rels) {
              const relArray = Array.isArray(rels) ? rels : [rels];
              relArray.forEach((rel: any, idx: number) => {
                const to = typeof rel === 'string' ? rel : (rel.to || rel.id || rel.ID);
                if (to) {
                   const relType = rel.type || (artifact.type === 'TEST' ? 'TESTS' : 'IMPLEMENTS');
                   const semantics = inferRelationSemantics(relType);
                   state.relations.push({
                      id: `rel-${artifact.id}-${idx}`,
                      from: artifact.id,
                      to: String(to),
                      type: relType,
                      category: semantics?.category,
                      strength: semantics?.strength,
                      file: fullPath
                   });
                }
              });
            }
          } else if (parsed && typeof parsed === 'object') {
            if (!(parsed.id || parsed.ID)) {
                state.errors.push({ file: fullPath, message: `Missing ID in artifact` });
            } else if (!(parsed.type || parsed.Type)) {
                state.errors.push({ file: fullPath, message: `Missing Type in artifact` });
            }
          }
        }
      }
    }
  };

  scanDocs(docsDir);

  return state;
}
