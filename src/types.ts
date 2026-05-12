export type ArtifactType = 'REQUIREMENT' | 'USE_CASE' | 'DESIGN' | 'COMPONENT' | 'CODE_ENTITY' | 'TEST' | 'DOCUMENTATION' | 'INCIDENT';
export type RelationType = 'DERIVES_FROM' | 'IMPLEMENTS' | 'VALIDATES' | 'JUSTIFIES' | 'TESTS' | 'BREAKS' | 'FIXES' | 'REFINES';
export type ChangeType = 'ERROR' | 'EVOLUTION' | 'REFACTOR' | 'ADAPTATION';

export interface Version {
  id: string;
  timestamp: string;
  parentVersion: string | null;
  name: string;
}

export interface Artifact {
  id: string;
  type: ArtifactType;
  subType?: string;
  title: string;
  description: string;
  version: string;
}

export interface Relation {
  id: string;
  from: string;
  to: string;
  type: RelationType;
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
}
