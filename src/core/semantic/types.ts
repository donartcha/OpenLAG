export type ArtifactLayer = 'BUSINESS' | 'ARCHITECTURE' | 'IMPLEMENTATION' | 'OPERATIONS' | 'DOCUMENTATION';
export type RelationCategory = 'STRUCTURAL' | 'BEHAVIORAL' | 'OPERATIONAL' | 'TRACEABILITY';
export type RelationStrength = 'STRONG' | 'MEDIUM' | 'WEAK';

export interface Ownership {
  owner?: string;
  team?: string;
  maintainers?: string[];
  reviewers?: string[];
  steward?: string;
}
