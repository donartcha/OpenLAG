export const CORE_ARTIFACT_TYPES = [
  'PROJECT', 'EPIC', 'FEATURE', 'REQUIREMENT', 'BUSINESS_RULE', 'USE_CASE',
  'DESIGN', 'DECISION', 'CODE_ENTITY', 'TEST_CASE', 'CHANGE', 'BUG', 'RISK',
  'GLOSSARY_TERM', 'COMPONENT', 'API', 'DATABASE_ENTITY', 'TEST',
  'DOCUMENTATION', 'INCIDENT', 'INFRASTRUCTURE', 'DEPLOYMENT', 'MONITORING',
  'MAINTENANCE', 'SYSTEM_VERSION', 'VERSION', 'LIBRARY', 'ENVIRONMENT', 'CHECK', 'PROCESS', 'PIPELINE'
] as const;

export type ArtifactType = typeof CORE_ARTIFACT_TYPES[number];

export class ArtifactRegistry {
  static getValidTypes(): readonly string[] {
    return CORE_ARTIFACT_TYPES;
  }

  static isValid(type: string): type is ArtifactType {
    return CORE_ARTIFACT_TYPES.includes(type as ArtifactType);
  }
}
