import { LintIssue, LintProfile } from './lint-types.js';
import { OpenLagData, ParsedArtifact, ParsedRelation, ParseError } from '../core/parser.js';

const VALID_ARTIFACT_TYPES = ['REQUIREMENT', 'USE_CASE', 'DESIGN', 'COMPONENT', 'CODE_ENTITY', 'TEST', 'DOCUMENTATION', 'INCIDENT', 'INFRASTRUCTURE', 'DEPLOYMENT', 'MONITORING', 'MAINTENANCE'];
const VALID_RELATION_TYPES = ['DERIVES_FROM', 'IMPLEMENTS', 'VALIDATES', 'JUSTIFIES', 'TESTS', 'BREAKS', 'FIXES', 'REFINES'];

export function runLintRules(data: OpenLagData, profile: LintProfile): LintIssue[] {
  const issues: LintIssue[] = [];

  const getSeverity = (rule: keyof LintProfile, artifactStatus?: string) => {
      let severity = profile[rule];
      if (!severity || severity === 'off') return 'off';
      
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

  const addIssue = (rule: keyof LintProfile, message: string, file?: string, artifactId?: string, artifactStatus?: string) => {
    const severity = getSeverity(rule, artifactStatus);
    if (severity && severity !== 'off') {
      issues.push({ severity, rule, message, file, artifactId });
    }
  };

  // 1. Invalid YAML
  for (const error of data.errors) {
    addIssue('invalidYaml', error.message, error.file);
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
      addIssue('duplicateId', `${id} appears in ${artifacts.length} files`, artifacts[0].file, id);
    }
  }

  // 3. Artifact type and minimal fields
  for (const artifact of data.artifacts) {
    if (!VALID_ARTIFACT_TYPES.includes(artifact.type)) {
      addIssue('invalidArtifactType', `Invalid artifact type: ${artifact.type}`, artifact.file, artifact.id, artifact.status);
    }
    if (!artifact.type || !artifact.title) {
        addIssue('missingRequiredFields', `Artifact missing type or title`, artifact.file, artifact.id, artifact.status);
    }
  }

  // Compute relation maps
  const targets = new Set(data.artifacts.map(a => a.id));
  const implementationsByReq = new Map<string, ParsedRelation[]>();
  const testsByReq = new Map<string, ParsedRelation[]>();
  const reqsByCode = new Map<string, ParsedRelation[]>();
  const reqsByTest = new Map<string, ParsedRelation[]>();

  for (const relation of data.relations) {
    if (!VALID_RELATION_TYPES.includes(relation.type)) {
       addIssue('invalidRelationType', `Invalid relation type: ${relation.type}`, relation.file, relation.from);
    }
    
    // 4. Broken relations
    if (!targets.has(relation.to)) {
      addIssue('brokenRelation', `${relation.from} -> ${relation.to} target does not exist`, relation.file, relation.from);
    }

    // Populate relation graphs for rules
    if (relation.type === 'IMPLEMENTS') {
        const list = implementationsByReq.get(relation.to) || [];
        list.push(relation);
        implementationsByReq.set(relation.to, list);

        const listCode = reqsByCode.get(relation.from) || [];
        listCode.push(relation);
        reqsByCode.set(relation.from, listCode);
    }
    
    if (relation.type === 'TESTS' || relation.type === 'VALIDATES') {
        const list = testsByReq.get(relation.to) || [];
        list.push(relation);
        testsByReq.set(relation.to, list);

        const listTest = reqsByTest.get(relation.from) || [];
        listTest.push(relation);
        reqsByTest.set(relation.from, listTest);
    }
  }

  // Rule functions per artifact
  for (const artifact of data.artifacts) {
    const isDraft = artifact.status === 'draft';
    const isClosed = artifact.status === 'closed';
    const isDeprecated = artifact.status === 'deprecated';

    if (isDeprecated) continue; // Skip rules for deprecated except broken relations (already checked above)

    if (artifact.type === 'REQUIREMENT') {
        const hasImplementation = implementationsByReq.has(artifact.id);
        const hasTest = testsByReq.has(artifact.id);

        if (!hasImplementation) {
             addIssue('requirementWithoutImplementation', `${artifact.id} lacks implementation`, artifact.file, artifact.id, artifact.status);
        }
        
        if (!hasTest) {
             addIssue('requirementWithoutTest', `${artifact.id} has no tests linked`, artifact.file, artifact.id, artifact.status);
        }
    }

    if (artifact.type === 'CODE_ENTITY') {
        const hasReq = reqsByCode.has(artifact.id);
        if (!hasReq) {
            addIssue('codeWithoutRequirement', `${artifact.id} has no requirement associated`, artifact.file, artifact.id, artifact.status);
        }
    }

    if (artifact.type === 'TEST') {
        const hasReq = reqsByTest.has(artifact.id);
        if (!hasReq) {
            addIssue('orphanArtifact', `${artifact.id} is a test without associated requirement`, artifact.file, artifact.id, artifact.status);
        }
    }

    if (isClosed) {
        const outgoing = data.relations.filter(r => r.from === artifact.id);
        for (const rel of outgoing) {
             const targetArts = artifactMap.get(rel.to);
             if (targetArts && targetArts[0]) {
                 const targetStatus = targetArts[0].status;
                 if (targetStatus === 'draft' || targetStatus === 'in_progress') {
                     addIssue('closedArtifactWithPendingRelations', `${artifact.id} is closed but links to ${targetStatus} artifact ${rel.to}`, artifact.file, artifact.id, artifact.status);
                 }
             }
        }
    }
  }

  return issues;
}
