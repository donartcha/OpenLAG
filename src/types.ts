export type ArtifactType = 'PROJECT' | 'EPIC' | 'FEATURE' | 'REQUIREMENT' | 'BUSINESS_RULE' | 'USE_CASE' | 'DESIGN' | 'DECISION' | 'CODE_ENTITY' | 'TEST_CASE' | 'CHANGE' | 'BUG' | 'RISK' | 'GLOSSARY_TERM' | 'COMPONENT' | 'API' | 'DATABASE_ENTITY' | 'TEST' | 'DOCUMENTATION' | 'INCIDENT' | 'INFRASTRUCTURE' | 'DEPLOYMENT' | 'MONITORING' | 'MAINTENANCE';
export type RelationType = 'IMPLEMENTS' | 'TESTS' | 'DEPENDS_ON' | 'DERIVES_FROM' | 'RELATES_TO' | 'IMPACTS' | 'BLOCKS' | 'FIXES' | 'USES' | 'DEFINES' | 'VALIDATES' | 'DOCUMENTS' | 'REPLACES' | 'JUSTIFIES' | 'BREAKS' | 'REFINES' | 'DEPLOYS' | 'MONITORS';
export type ChangeType = 'ERROR' | 'FEATURE' | 'EVOLUTION' | 'REFACTOR' | 'ADAPTATION';

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
  subType?: string;
  title: string;
  description: string;
  version: string;
  systemVersionId?: string;
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
