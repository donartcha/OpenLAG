import { scanDocs } from "./parser/scanner.js";
import { ParsedArtifact, ParsedRelation, ParseError, OpenLagData, RawDocument } from "./parser/types.js";
import { ArtifactType } from "../../src/types";
import { inferRelationSemantics } from "../../src/core/semantic/relation-definitions.js";
import { ArtifactSchema } from "./parser/schemas.js";
import { normalizeArtifact } from "./parser/normalizer.js";
import { DiagnosticEngine, Severity } from "./parser/diagnostic.js";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import yaml from "js-yaml";

export function parseOpenLagDocs(docsDir: string): OpenLagData {
  const diag = new DiagnosticEngine();
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
    diag.add(manifestPath, "Manifest not found", Severity.CRITICAL);
    state.errors = diag.getErrors();
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
    diag.add(manifestPath, "Invalid YAML in Versions", Severity.CRITICAL);
  }

  const documents = scanDocs(docsDir);

  for (const doc of documents) {
    const { content, file: fullPath } = doc;
    const sections = content.split(/---+\r?\n/);
    
    let i = 0;
    if (content.trim().startsWith('---')) i = 1;

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
            throw new Error(`CRITICAL: Invalid YAML block in ${fullPath}: ${(e as Error).message}`, { cause: e });
          }

          if (parsed && typeof parsed === 'object' && (parsed.id || parsed.ID) && (parsed.type || parsed.Type)) {
            const body = (i + 1 < sections.length) ? sections[i+1].trim() : '';
            if (i+1 < sections.length) i++; // Consume body section if we took it

            const normalized = normalizeArtifact(parsed, fullPath, body);
            
            try {
              ArtifactSchema.parse(normalized);
              
              const artifact: ParsedArtifact = normalized;
              state.artifacts.push(artifact);

              const typeValue = artifact.type as ArtifactType;

              if (typeValue === 'SYSTEM_VERSION') {
                state.systemVersions.push({
                  id: artifact.id,
                  component: String(parsed.component || ''),
                  version: String(parsed.version || ''),
                  releaseDate: String(parsed.releaseDate || '')
                });
              } else if (typeValue === 'CHANGE') {
                state.changes.push({
                  id: artifact.id,
                  type: parsed.changeType || 'FEATURE',
                  title: artifact.title,
                  description: artifact.description,
                  affects: Array.isArray(parsed.affects) ? parsed.affects : [],
                  versionFrom: String(parsed.versionFrom || ''),
                  versionTo: String(parsed.versionTo || '')
                });
              }

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
            } catch (e) {
                diag.add(fullPath, `Schema validation error: ${(e as Error).message}`, Severity.INVALID);
            }

          } else if (parsed && typeof parsed === 'object') {
            if (!(parsed.id || parsed.ID)) {
                diag.add(fullPath, `Missing ID in artifact`, Severity.INVALID);
            } else if (!(parsed.type || parsed.Type)) {
                diag.add(fullPath, `Missing Type in artifact`, Severity.INVALID);
            }
          }
        }
      }
  state.errors = diag.getErrors();
  return state;
}
