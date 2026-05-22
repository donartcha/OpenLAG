import { LintIssue, LintProfile } from './lint-types.js';
import { OpenLagData, ParsedArtifact, ParsedRelation, ParseError } from '../core/parser.js';
import { ArtifactRegistry } from '../../src/core/registry/ArtifactRegistry.js';
import { RelationRegistry } from '../../src/core/registry/RelationRegistry.js';

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
      addIssue('duplicateId', `Artifact appears in ${artifacts.length} files.`, artifacts[0].file, id);
    }
  }

  // 3. Artifact type and minimal fields
  for (const artifact of data.artifacts as any[]) {
    if (!ArtifactRegistry.isValid(artifact.type)) {
      addIssue('invalidArtifactType', `Invalid artifact type \`${artifact.type}\`.`, artifact.file, artifact.id, artifact.status);
    } else {
      // Validate contract-defined requiredFields
      const contract = ArtifactRegistry.getContract(artifact.type);
      if (contract && contract.requiredFields) {
        for (const field of contract.requiredFields) {
          if (artifact.raw[field] === undefined) {
             addIssue('missingRequiredFields', `Missing required field \`${field}\` (Required by \`${artifact.type}\` contract).`, artifact.file, artifact.id, artifact.status);
          }
        }
      }
      if (artifact.raw.layer && contract && contract.layer && artifact.raw.layer !== contract.layer) {
        addIssue('invalidLayer', `Artifact specifies layer \`${artifact.raw.layer}\` but contract \`${artifact.type}\` requires \`${contract.layer}\`.\n\nChange layer to \`${contract.layer}\`.`, artifact.file, artifact.id, artifact.status);
      }
    }
    if (!artifact.type || !artifact.title) {
        addIssue('missingRequiredFields', `Artifact is missing type or title. Check YAML frontmatter.`, artifact.file, artifact.id, artifact.status);
    }
  }

  // Compute relation maps
  const targets = new Set(data.artifacts.map(a => a.id));
  const implementationsByReq = new Map<string, ParsedRelation[]>();
  const testsByReq = new Map<string, ParsedRelation[]>();
  const reqsByCode = new Map<string, ParsedRelation[]>();
  const reqsByTest = new Map<string, ParsedRelation[]>();

  for (const relation of data.relations) {
    const contract = RelationRegistry.getContract(relation.type);
    
    if (!contract) {
       addIssue('invalidRelationType', `Invalid relation type: \`${relation.type}\``, relation.file, relation.from);
    }
    
    // 4. Broken relations
    if (!targets.has(relation.to)) {
      addIssue('brokenRelation', `Relation target \`${relation.to}\` does not exist.`, relation.file, relation.from);
    }

    // 4.1 Validate allowedFrom and allowedTo constraints
    if (contract) {
        const sourceArtifact = artifactMap.get(relation.from)?.[0];
        const targetArtifact = artifactMap.get(relation.to)?.[0];

        if (sourceArtifact && contract.allowedFrom && contract.allowedFrom.length > 0) {
            const isAllowedSrc = contract.allowedFrom.some(allowed => ArtifactRegistry.isCompatibleType(allowed, sourceArtifact.type));
            if (!isAllowedSrc) {
                addIssue('invalidRelationType', `Relation \`${relation.type}\` starting from type \`${sourceArtifact.type}\` is NOT ALLOWED.\n\nTry using one of allowed sources: \`${contract.allowedFrom.join(', ')}\` or change relation type.`, relation.file, relation.from, sourceArtifact.status);
            }
        }

        if (targetArtifact && contract.allowedTo && contract.allowedTo.length > 0) {
            const isAllowedDest = contract.allowedTo.some(allowed => ArtifactRegistry.isCompatibleType(allowed, targetArtifact.type));
            if (!isAllowedDest) {
                addIssue('invalidRelationType', `Relation \`${relation.type}\` targeting \`${targetArtifact.type}\` is NOT ALLOWED.\n\nAllowed targets for \`${relation.type}\` are: \`${contract.allowedTo.join(', ')}\`.`, relation.file, relation.from, sourceArtifact?.status);
            }
        }
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

    if (ArtifactRegistry.getBaseType(artifact.type) === 'REQUIREMENT') {
        const hasImplementation = implementationsByReq.has(artifact.id);
        const hasTest = testsByReq.has(artifact.id);

        if (!hasImplementation) {
             addIssue('requirementWithoutImplementation', `Requirement lacks implementation.`, artifact.file, artifact.id, artifact.status);
        }
        
        if (!hasTest) {
             addIssue('requirementWithoutTest', `Requirement has no tests linked.`, artifact.file, artifact.id, artifact.status);
        }
    }

    if (ArtifactRegistry.getBaseType(artifact.type) === 'CODE_ENTITY') {
        const hasReq = reqsByCode.has(artifact.id);
        if (!hasReq) {
            addIssue('codeWithoutRequirement', `Code entity has no requirement associated.`, artifact.file, artifact.id, artifact.status);
        }
    }

    if (ArtifactRegistry.getBaseType(artifact.type) === 'TEST_CASE') {
        const hasReq = reqsByTest.has(artifact.id);
        if (!hasReq) {
            addIssue('orphanArtifact', `Test without associated requirement.`, artifact.file, artifact.id, artifact.status);
        }
    }

    if (isClosed) {
        const outgoing = data.relations.filter(r => r.from === artifact.id);
        for (const rel of outgoing) {
             const targetArts = artifactMap.get(rel.to);
             if (targetArts && targetArts[0]) {
                 const targetStatus = targetArts[0].status;
                 if (targetStatus === 'draft' || targetStatus === 'in_progress') {
                     // Check relation rules: RELATES_TO, DOCUMENTS, JUSTIFIES don't break closed state
                     if (rel.type !== 'RELATES_TO' && rel.type !== 'DOCUMENTS' && rel.type !== 'JUSTIFIES') {
                         addIssue('closedArtifactWithPendingRelations', `Artifact is closed but links to \`${targetStatus}\` artifact \`${rel.to}\` via \`${rel.type}\`.`, artifact.file, artifact.id, artifact.status);
                     }
                 }
             }
        }
        
        if (!artifact.ownership || Object.keys(artifact.ownership).length === 0) {
            addIssue('missingOwnership', `Artifact is closed but has no ownership defined.`, artifact.file, artifact.id, artifact.status);
        }
    }
    
    if (ArtifactRegistry.getBaseType(artifact.type) === 'API' && (!artifact.ownership || Object.keys(artifact.ownership).length === 0)) {
        addIssue('missingOwnership', `API should have ownership defined.`, artifact.file, artifact.id, artifact.status);
    }
    
    // Check layer semantics
    if (artifact.layer === 'BUSINESS') {
        const outgoing = data.relations.filter(r => r.from === artifact.id);
        for (const rel of outgoing) {
            const relSemantics = rel.category;
            if (relSemantics === 'OPERATIONAL') {
                addIssue('invalidLayerRelation', `Business layer artifact should not have OPERATIONAL relations (\`${rel.type}\`).`, artifact.file, artifact.id, artifact.status);
            }
        }
    }
  }

  return issues;
}
