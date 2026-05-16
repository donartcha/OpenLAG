import { LintProfile } from './lint-types.js';

export const defaultProfiles: Record<string, LintProfile> = {
  feature: {
    duplicateId: 'error',
    invalidYaml: 'error',
    brokenRelation: 'error',
    missingRequiredFields: 'warning',
    requirementWithoutImplementation: 'info',
    requirementWithoutTest: 'info',
    codeWithoutRequirement: 'info',
    closedArtifactWithPendingRelations: 'warning',
    orphanArtifact: 'info',
    invalidRelationType: 'error',
    invalidArtifactType: 'error',
  },
  develop: {
    duplicateId: 'error',
    invalidYaml: 'error',
    brokenRelation: 'error',
    missingRequiredFields: 'error',
    requirementWithoutImplementation: 'warning',
    requirementWithoutTest: 'warning',
    codeWithoutRequirement: 'warning',
    closedArtifactWithPendingRelations: 'warning',
    orphanArtifact: 'warning',
    invalidRelationType: 'error',
    invalidArtifactType: 'error',
  },
  release: {
    duplicateId: 'error',
    invalidYaml: 'error',
    brokenRelation: 'error',
    missingRequiredFields: 'error',
    requirementWithoutImplementation: 'error',
    requirementWithoutTest: 'error',
    codeWithoutRequirement: 'error',
    closedArtifactWithPendingRelations: 'error',
    orphanArtifact: 'error',
    invalidRelationType: 'error',
    invalidArtifactType: 'error',
  }
};
