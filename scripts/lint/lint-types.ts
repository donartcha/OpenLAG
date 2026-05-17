export type LintSeverity = 'error' | 'warning' | 'info' | 'off';

export interface LintIssue {
  severity: LintSeverity;
  rule: string;
  artifactId?: string;
  message: string;
  file?: string;
}

export interface LintSummary {
  errors: number;
  warnings: number;
  info: number;
}

export interface LintReport {
  profile: string;
  summary: LintSummary;
  issues: LintIssue[];
}

export interface LintProfile {
  duplicateId: LintSeverity;
  invalidYaml: LintSeverity;
  brokenRelation: LintSeverity;
  missingRequiredFields: LintSeverity;
  requirementWithoutImplementation: LintSeverity;
  requirementWithoutTest: LintSeverity;
  codeWithoutRequirement: LintSeverity;
  closedArtifactWithPendingRelations: LintSeverity;
  orphanArtifact: LintSeverity;
  invalidRelationType: LintSeverity;
  invalidArtifactType: LintSeverity;
  invalidLayerRelation?: LintSeverity;
  missingOwnership?: LintSeverity;
}

export interface LintConfig {
  defaultProfile: string;
  failOnWarnings: boolean;
  profiles: Record<string, Partial<LintProfile>>;
}
