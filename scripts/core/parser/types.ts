import { Artifact, Relation, Change, SystemVersion, Version } from "../../../src/types.js";

export interface ParsedArtifact extends Artifact {
  file: string;
  status?: 'draft' | 'in_progress' | 'ready' | 'closed' | 'deprecated';
  markdownBody?: string;
  raw?: Record<string, unknown>;
}

export interface ParsedRelation extends Relation {
  file: string;
}

export interface ParseError {
  file: string;
  message: string;
}

export interface OpenLagData {
  versions: Version[];
  systemVersions: SystemVersion[];
  changes: Change[];
  artifacts: ParsedArtifact[];
  relations: ParsedRelation[];
  errors: ParseError[];
}

export interface RawDocument {
  file: string;
  content: string;
  frontmatter?: Record<string, any>;
}
