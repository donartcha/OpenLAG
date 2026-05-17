import { scanDocs } from "./parser/scanner.js";
import { ParsedArtifact, ParsedRelation, ParseError, OpenLagData, RawDocument } from "./parser/types.js";
export type { ParsedArtifact, ParsedRelation, ParseError, OpenLagData, RawDocument };
import { ArtifactType } from "../../src/types.js";
import { ArtifactSchema } from "./parser/schemas.js";
import { normalizeArtifact } from "./parser/normalizer.js";
import { DiagnosticEngine, Severity } from "./parser/diagnostic.js";
import { RelationRegistry } from "../../src/core/registry/RelationRegistry.js";
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
              .join('\n')
              .replace(/---$/, '')
              .trim();
            
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

              if (typeValue === 'VERSION') {
                state.versions.push({
                  id: artifact.id,
                  name: String(parsed.name || ''),
                  timestamp: String(parsed.timestamp || ''),
                  parentVersion: parsed.parentVersion || null
                });
              } else if (typeValue === 'SYSTEM_VERSION') {
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
                     const relType = rel.type;
                     if (!relType) {
                         diag.add(fullPath, `Relation targeting ${to} missing 'type' in artifact ${artifact.id}`, Severity.WARNING);
                         return; // Skip inference, strictly require type
                     }
                     const contract = RelationRegistry.getContract(relType);
                     state.relations.push({
                        id: `rel-${artifact.id}-${idx}`,
                        from: artifact.id,
                        to: String(to),
                        type: relType,
                        category: contract?.category,
                        strength: contract?.strength,
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
