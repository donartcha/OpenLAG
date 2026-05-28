import { ArtifactType } from './core/registry/ArtifactRegistry.js';

export type { ArtifactType };
export type RelationType = string;
export type ChangeType = 'ERROR' | 'FEATURE' | 'EVOLUTION' | 'REFACTOR' | 'ADAPTATION';

export type ArtifactLayer = 'BUSINESS' | 'ARCHITECTURE' | 'IMPLEMENTATION' | 'OPERATIONS' | 'DOCUMENTATION' | 'VERIFICATION' | 'GOVERNANCE';
export type RelationStrength = 'STRONG' | 'MEDIUM' | 'WEAK';
export type RelationCategory = 'STRUCTURAL' | 'BEHAVIORAL' | 'OPERATIONAL' | 'SEMANTIC' | 'TRACEABILITY' | 'DEPENDENCY' | 'EVOLUTIONARY';

export interface Ownership {
  owner?: string;
  team?: string;
  domain?: string;
  maintainers?: string[];
  reviewers?: string[];
  steward?: string;
}

export interface Version {
  id: string;
  timestamp: string;
  parentVersion: string | null;
  name: string;
}

export interface SystemVersion {
  id: string;
  component: string;
  version: string;
  releaseDate: string;
}

export interface Artifact {
  id: string;
  type: ArtifactType;
  title: string;
  description?: string;
  markdownBody?: string;
  version?: string;
  component?: string;
  releaseDate?: string;
  layer?: string;
  ownership?: Ownership;
  status?: string;
}

export interface Relation {
  id: string;
  from: string;
  to: string;
  type: RelationType;
  strength?: RelationStrength;
  category?: RelationCategory;
}

export interface Change {
  id: string;
  type: ChangeType;
  title: string;
  description: string;
  affects: string[];
  versionFrom: string;
  versionTo: string;
}

export interface GraphSnapshot {
  artifacts: Artifact[];
  relations: Relation[];
}

export interface AppState {
  versions: Version[];
  changes: Change[];
  graphs: Record<string, GraphSnapshot>;
  lintReports: Record<string, any>;
}
