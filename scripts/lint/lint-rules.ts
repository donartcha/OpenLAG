import { LintIssue, LintProfile } from './lint-types.js';
import { OpenLagData, ParsedArtifact, ParsedRelation, ParseError } from '../core/parser.js';
import { ArtifactRegistry } from '../../src/core/registry/ArtifactRegistry.js';
import { RelationRegistry } from '../../src/core/registry/RelationRegistry.js';
import { RuleRegistry } from '../../src/core/registry/RuleRegistry.js';

export function runLintRules(data: OpenLagData, profile: LintProfile): LintIssue[] {
  const issues: LintIssue[] = [];

  const getSeverity = (rule: keyof LintProfile | string, artifactStatus?: string, defaultSeverity: 'error' | 'warning' | 'info' = 'error') => {
      let severity = profile[rule as keyof LintProfile] as string | undefined || defaultSeverity;
      if (severity === 'off') return 'off';
      
      // Downgrade severities based on drafting status
      if (artifactStatus === 'draft') {
          if (rule !== 'brokenRelation' && rule !== 'invalidYaml' && rule !== 'duplicateId') {
              severity = 'info';
          }
      } else if (artifactStatus === 'in_progress') {
          if (rule !== 'brokenRelation' && rule !== 'invalidYaml' && rule !== 'duplicateId') {
              if (severity === 'error') severity = 'warning';
          }
      }
      return severity;
  };

  const addIssue = (rule: string, message: string, file?: string, artifactId?: string, artifactStatus?: string, defaultSev?: 'error' | 'warning' | 'info') => {
    const severity = getSeverity(rule, artifactStatus, defaultSev);
    if (severity && severity !== 'off') {
      issues.push({ severity: severity as 'error' | 'warning' | 'info', rule: rule as any, message, file, artifactId });
    }
  };

  // 1. Invalid YAML
  for (const error of data.errors) {
    addIssue('invalidYaml', error.message, error.file, undefined, undefined, 'error');
  }

  // Build ID map
  const artifactMap = new Map<string, ParsedArtifact[]>();
  for (const artifact of data.artifacts) {
    const list = artifactMap.get(artifact.id) || [];
    list.push(artifact);
    artifactMap.set(artifact.id, list);
  }

  // 2. Duplicate IDs
  for (const [id, artifacts] of artifactMap.entries()) {
    if (artifacts.length > 1) {
      addIssue('duplicateId', `Artifact appears in ${artifacts.length} files.`, artifacts[0].file, id, undefined, 'error');
    }
  }

  // 3. Artifact type and minimal fields
  for (const artifact of data.artifacts as any[]) {
    if (!ArtifactRegistry.isValid(artifact.type)) {
      addIssue('invalidArtifactType', `Invalid artifact type \`${artifact.type}\`.`, artifact.file, artifact.id, artifact.status, 'error');
    } else {
      // Validate contract-defined requiredFields
      const contract = ArtifactRegistry.getContract(artifact.type);
      if (contract && contract.requiredFields) {
        for (const field of contract.requiredFields) {
          if (artifact.raw?.[field] === undefined) {
             addIssue('missingRequiredFields', `Missing required field \`${field}\` (Required by \`${artifact.type}\` contract).`, artifact.file, artifact.id, artifact.status, 'error');
          }
        }
      }
      if (artifact.raw?.layer && contract && contract.layer && artifact.raw.layer !== contract.layer) {
        addIssue('invalidLayer', `Artifact specifies layer \`${artifact.raw.layer}\` but contract \`${artifact.type}\` requires \`${contract.layer}\`.\n\nChange layer to \`${contract.layer}\`.`, artifact.file, artifact.id, artifact.status, 'error');
      }
    }
    if (!artifact.type || !artifact.title) {
        addIssue('missingRequiredFields', `Artifact is missing type or title. Check YAML frontmatter.`, artifact.file, artifact.id, artifact.status, 'error');
    }
  }

  const targets = new Set(data.artifacts.map(a => a.id));

  for (const relation of data.relations) {
    const contract = RelationRegistry.getContract(relation.type);
    
    if (!contract) {
       addIssue('invalidRelationType', `Invalid relation type: \`${relation.type}\``, relation.file, relation.from, undefined, 'error');
    }
    
    // 4. Broken relations
    if (!targets.has(relation.to)) {
      addIssue('brokenRelation', `Relation target \`${relation.to}\` does not exist.`, relation.file, relation.from, undefined, 'error');
    }

    // 4.1 Validate allowedFrom and allowedTo constraints
    if (contract) {
        const sourceArtifact = artifactMap.get(relation.from)?.[0];
        const targetArtifact = artifactMap.get(relation.to)?.[0];

        if (sourceArtifact && contract.allowedFrom && contract.allowedFrom.length > 0) {
            const isAllowedSrc = contract.allowedFrom.some(allowed => ArtifactRegistry.isCompatibleType(allowed, sourceArtifact.type));
            if (!isAllowedSrc) {
                addIssue('invalidRelationType', `Relation \`${relation.type}\` starting from type \`${sourceArtifact.type}\` is NOT ALLOWED.\n\nTry using one of allowed sources: \`${contract.allowedFrom.join(', ')}\` or change relation type.`, relation.file, relation.from, sourceArtifact.status, 'error');
            }
        }

        if (targetArtifact && contract.allowedTo && contract.allowedTo.length > 0) {
            const isAllowedDest = contract.allowedTo.some(allowed => ArtifactRegistry.isCompatibleType(allowed, targetArtifact.type));
            if (!isAllowedDest) {
                addIssue('invalidRelationType', `Relation \`${relation.type}\` targeting \`${targetArtifact.type}\` is NOT ALLOWED.\n\nAllowed targets for \`${relation.type}\` are: \`${contract.allowedTo.join(', ')}\`.`, relation.file, relation.from, sourceArtifact?.status, 'error');
            }
        }
    }
  }

  // 5. Dynamic Rule Evaluation via RuleRegistry
  const dynamicRules = RuleRegistry.getAll();
  
  for (const artifact of data.artifacts) {
    const isDeprecated = artifact.status === 'deprecated';
    if (isDeprecated) continue;

    const artifactOutgoingRelations = data.relations.filter(r => r.from === artifact.id);

    for (const rule of dynamicRules) {
        // Evaluate Match Node
        if (rule.matchNode) {
            if (rule.matchNode.type) {
                const matchTypes = Array.isArray(rule.matchNode.type) ? rule.matchNode.type : [rule.matchNode.type];
                if (!matchTypes.some(mt => ArtifactRegistry.isCompatibleType(mt, artifact.type))) continue;
            }
            if (rule.matchNode.layer) {
                const matchLayers = Array.isArray(rule.matchNode.layer) ? rule.matchNode.layer : [rule.matchNode.layer];
                if (!matchLayers.includes(artifact.layer || '')) continue;
            }
        }

        // Evaluate Conditions
        if (rule.conditions) {
            if (rule.conditions.requiredRelations) {
                for (const req of rule.conditions.requiredRelations) {
                    const match = artifactOutgoingRelations.some(rel => {
                        if (rel.type !== req.type) return false;
                        if (req.toType) {
                            const target = artifactMap.get(rel.to)?.[0];
                            if (!target) return false;
                            const matchTypes = Array.isArray(req.toType) ? req.toType : [req.toType];
                            if (!matchTypes.some(mt => ArtifactRegistry.isCompatibleType(mt, target.type))) return false;
                        }
                        if (req.toLayer) {
                             const target = artifactMap.get(rel.to)?.[0];
                             if (!target) return false;
                             const matchLayers = Array.isArray(req.toLayer) ? req.toLayer : [req.toLayer];
                             if (!matchLayers.includes(target.layer || '')) return false;
                        }
                        return true;
                    });
                    
                    if (!match) {
                        addIssue(rule.id, req.message || `Violates required relation rule: ${rule.id}`, artifact.file, artifact.id, artifact.status, rule.severity as 'error' | 'warning' | 'info');
                    }
                }
            }

            if (rule.conditions.forbiddenRelations) {
                for (const fb of rule.conditions.forbiddenRelations) {
                     const match = artifactOutgoingRelations.find(rel => {
                        if (rel.type !== fb.type) return false;
                        if (fb.toType) {
                            const target = artifactMap.get(rel.to)?.[0];
                            if (!target) return false;
                            const matchTypes = Array.isArray(fb.toType) ? fb.toType : [fb.toType];
                            if (!matchTypes.some(mt => ArtifactRegistry.isCompatibleType(mt, target.type))) return false;
                        }
                        if (fb.toLayer) {
                             const target = artifactMap.get(rel.to)?.[0];
                             if (!target) return false;
                             const matchLayers = Array.isArray(fb.toLayer) ? fb.toLayer : [fb.toLayer];
                             if (!matchLayers.includes(target.layer || '')) return false;
                        }
                        return true;
                    });
                    
                    if (match) {
                        addIssue(rule.id, fb.message || `Violates forbidden relation rule: ${rule.id}`, artifact.file, artifact.id, artifact.status, rule.severity as 'error' | 'warning' | 'info');
                    }
                }
            }
            
            if (rule.conditions.allowedLayers && artifact.layer) {
                if (!rule.conditions.allowedLayers.includes(artifact.layer)) {
                    addIssue(rule.id, `Violates allowed layers: ${rule.id}`, artifact.file, artifact.id, artifact.status, rule.severity as 'error' | 'warning' | 'info');
                }
            }

            if (rule.conditions.requiredFields) {
                for (const field of rule.conditions.requiredFields) {
                    if ((artifact as any).raw?.[field] === undefined) {
                         addIssue(rule.id, `Missing required field \`${field}\` (Required by rule \`${rule.id}\`).`, artifact.file, artifact.id, artifact.status, rule.severity as 'error' | 'warning' | 'info');
                    }
                }
            }
        }
    }

    // Closed artifact rules and ownership
    if (artifact.status === 'closed') {
        const outgoing = data.relations.filter(r => r.from === artifact.id);
        for (const rel of outgoing) {
             const targetArts = artifactMap.get(rel.to);
             if (targetArts && targetArts[0]) {
                 const targetStatus = targetArts[0].status;
                 if (targetStatus === 'draft' || targetStatus === 'in_progress') {
                     // Check relation rules: RELATES_TO, DOCUMENTS, JUSTIFIES don't break closed state
                     if (rel.type !== 'RELATES_TO' && rel.type !== 'DOCUMENTS' && rel.type !== 'JUSTIFIES') {
                         addIssue('closedArtifactWithPendingRelations', `Artifact is closed but links to \`${targetStatus}\` artifact \`${rel.to}\` via \`${rel.type}\`.`, artifact.file, artifact.id, artifact.status, 'warning');
                     }
                 }
             }
        }
        
        if (!artifact.ownership || Object.keys(artifact.ownership).length === 0) {
            addIssue('missingOwnership', `Artifact is closed but has no ownership defined.`, artifact.file, artifact.id, artifact.status, 'warning');
        }
    }
    
    if (ArtifactRegistry.getBaseType(artifact.type) === 'API' && (!artifact.ownership || Object.keys(artifact.ownership).length === 0)) {
        addIssue('missingOwnership', `API should have ownership defined.`, artifact.file, artifact.id, artifact.status, 'warning');
    }
  }

  return issues;
}
