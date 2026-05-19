
// GENERATED FILE - DO NOT EDIT MANUALLY

export interface ArtifactContract {
  type: string;
  extends?: string;
  layer?: string;
  description?: string;
  requiredFields: string[];
  impactSeverityDefault?: string;
  impact?: {
    criticality?: string;
  };
}

export const GENERATED_ARTIFACTS: ArtifactContract[] = [
  {
    "type": "ADR",
    "extends": "DECISION",
    "description": "Extended artifact for ADR",
    "requiredFields": [],
    "impact": {}
  },
  {
    "type": "ALERT",
    "extends": "MONITORING",
    "description": "Extended artifact for ALERT",
    "requiredFields": [],
    "impact": {}
  },
  {
    "type": "API",
    "layer": "IMPLEMENTATION",
    "description": "Base artifact for API",
    "requiredFields": [],
    "impact": {}
  },
  {
    "type": "API_ROUTE",
    "extends": "API",
    "description": "Extended artifact for API_ROUTE",
    "requiredFields": [],
    "impact": {}
  },
  {
    "type": "ARCHITECTURE",
    "extends": "DESIGN",
    "description": "Extended artifact for ARCHITECTURE",
    "requiredFields": [],
    "impact": {}
  },
  {
    "type": "ASYNC_WORKER",
    "extends": "CODE_ENTITY",
    "description": "Extended artifact for ASYNC_WORKER",
    "requiredFields": [],
    "impact": {}
  },
  {
    "type": "BUG",
    "layer": "GOVERNANCE",
    "description": "Base artifact for BUG",
    "requiredFields": [],
    "impact": {}
  },
  {
    "type": "BUSINESS_RULE",
    "layer": "BUSINESS",
    "description": "Base artifact for BUSINESS_RULE",
    "requiredFields": [],
    "impact": {}
  },
  {
    "type": "CHANGE",
    "layer": "GOVERNANCE",
    "description": "Base artifact for CHANGE",
    "requiredFields": [],
    "impact": {}
  },
  {
    "type": "CHECK",
    "layer": "VERIFICATION",
    "description": "Base artifact for CHECK",
    "requiredFields": [],
    "impact": {}
  },
  {
    "type": "CI_PIPELINE",
    "extends": "PIPELINE",
    "description": "Extended artifact for CI_PIPELINE",
    "requiredFields": [],
    "impact": {}
  },
  {
    "type": "CODE_ENTITY",
    "layer": "IMPLEMENTATION",
    "description": "Base artifact for CODE_ENTITY",
    "requiredFields": [],
    "impact": {}
  },
  {
    "type": "COMPONENT",
    "layer": "IMPLEMENTATION",
    "description": "Base artifact for COMPONENT",
    "requiredFields": [],
    "impact": {}
  },
  {
    "type": "COMPONENT_DIAGRAM",
    "extends": "DESIGN",
    "description": "Extended artifact for COMPONENT_DIAGRAM",
    "requiredFields": [],
    "impact": {}
  },
  {
    "type": "CONSTRAINT",
    "extends": "BUSINESS_RULE",
    "description": "Extended artifact for CONSTRAINT",
    "requiredFields": [],
    "impact": {}
  },
  {
    "type": "CONTROLLER",
    "extends": "CODE_ENTITY",
    "description": "Extended artifact for CONTROLLER",
    "requiredFields": [],
    "impact": {}
  },
  {
    "type": "DAO",
    "extends": "CODE_ENTITY",
    "description": "Extended artifact for DAO",
    "requiredFields": [],
    "impact": {}
  },
  {
    "type": "DASHBOARDS",
    "extends": "MONITORING",
    "description": "Extended artifact for DASHBOARDS",
    "requiredFields": [],
    "impact": {}
  },
  {
    "type": "DATABASE_ENTITY",
    "layer": "IMPLEMENTATION",
    "description": "Base artifact for DATABASE_ENTITY",
    "requiredFields": [],
    "impact": {}
  },
  {
    "type": "DECISION",
    "layer": "ARCHITECTURE",
    "description": "Base artifact for DECISION",
    "requiredFields": [],
    "impact": {}
  },
  {
    "type": "DEPLOYMENT",
    "layer": "OPERATIONS",
    "description": "Base artifact for DEPLOYMENT",
    "requiredFields": [],
    "impact": {}
  },
  {
    "type": "DESIGN",
    "layer": "ARCHITECTURE",
    "description": "Base artifact for DESIGN",
    "requiredFields": [],
    "impact": {}
  },
  {
    "type": "DOCUMENTATION",
    "layer": "ARCHITECTURE",
    "description": "Base artifact for DOCUMENTATION",
    "requiredFields": [],
    "impact": {}
  },
  {
    "type": "DTO",
    "extends": "CODE_ENTITY",
    "description": "Extended artifact for DTO",
    "requiredFields": [],
    "impact": {}
  },
  {
    "type": "ENTITY",
    "extends": "CODE_ENTITY",
    "description": "Extended artifact for ENTITY",
    "requiredFields": [],
    "impact": {}
  },
  {
    "type": "ENVIRONMENT",
    "layer": "OPERATIONS",
    "description": "Base artifact for ENVIRONMENT",
    "requiredFields": [],
    "impact": {}
  },
  {
    "type": "EPIC",
    "layer": "BUSINESS",
    "description": "Base artifact for EPIC",
    "requiredFields": [],
    "impact": {}
  },
  {
    "type": "EVIDENCE",
    "extends": "DOCUMENTATION",
    "description": "Extended artifact for EVIDENCE",
    "requiredFields": [],
    "impact": {}
  },
  {
    "type": "FEATURE",
    "layer": "BUSINESS",
    "description": "Base artifact for FEATURE",
    "requiredFields": [],
    "impact": {}
  },
  {
    "type": "FUNCTIONAL",
    "extends": "REQUIREMENT",
    "description": "Extended artifact for FUNCTIONAL",
    "requiredFields": [],
    "impact": {}
  },
  {
    "type": "GITHUB_ACTIONS",
    "extends": "PIPELINE",
    "description": "Extended artifact for GITHUB_ACTIONS",
    "requiredFields": [],
    "impact": {}
  },
  {
    "type": "GLOSSARY_TERM",
    "layer": "ARCHITECTURE",
    "description": "Base artifact for GLOSSARY_TERM",
    "requiredFields": [],
    "impact": {}
  },
  {
    "type": "INCIDENT",
    "layer": "GOVERNANCE",
    "description": "Base artifact for INCIDENT",
    "requiredFields": [],
    "impact": {}
  },
  {
    "type": "INFRASTRUCTURE",
    "layer": "OPERATIONS",
    "description": "Base artifact for INFRASTRUCTURE",
    "requiredFields": [],
    "impact": {}
  },
  {
    "type": "INTEGRATION",
    "extends": "TEST_CASE",
    "description": "Extended artifact for INTEGRATION",
    "requiredFields": [],
    "impact": {}
  },
  {
    "type": "INTEGRATION_TEST",
    "extends": "TEST_CASE",
    "description": "Extended artifact for INTEGRATION_TEST",
    "requiredFields": [],
    "impact": {}
  },
  {
    "type": "KUBERNETES",
    "extends": "INFRASTRUCTURE",
    "description": "Extended artifact for KUBERNETES",
    "requiredFields": [],
    "impact": {}
  },
  {
    "type": "LIBRARY",
    "layer": "IMPLEMENTATION",
    "description": "Base artifact for LIBRARY",
    "requiredFields": [],
    "impact": {}
  },
  {
    "type": "MAINTENANCE",
    "layer": "GOVERNANCE",
    "description": "Base artifact for MAINTENANCE",
    "requiredFields": [],
    "impact": {}
  },
  {
    "type": "METHOD",
    "extends": "CODE_ENTITY",
    "description": "Extended artifact for METHOD",
    "requiredFields": [],
    "impact": {}
  },
  {
    "type": "MICROSERVICE",
    "extends": "COMPONENT",
    "description": "Extended artifact for MICROSERVICE",
    "requiredFields": [],
    "impact": {}
  },
  {
    "type": "MONITORING",
    "layer": "OPERATIONS",
    "description": "Base artifact for MONITORING",
    "requiredFields": [],
    "impact": {}
  },
  {
    "type": "NON_FUNCTIONAL_REQUIREMENT",
    "extends": "REQUIREMENT",
    "description": "Extended artifact for NON_FUNCTIONAL_REQUIREMENT",
    "requiredFields": [],
    "impact": {}
  },
  {
    "type": "PACKAGE",
    "extends": "LIBRARY",
    "description": "Extended artifact for PACKAGE",
    "requiredFields": [],
    "impact": {}
  },
  {
    "type": "PATCH",
    "extends": "CHANGE",
    "description": "Extended artifact for PATCH",
    "requiredFields": [],
    "impact": {}
  },
  {
    "type": "PIPELINE",
    "layer": "OPERATIONS",
    "description": "Base artifact for PIPELINE",
    "requiredFields": [],
    "impact": {}
  },
  {
    "type": "PROCESS",
    "layer": "VERIFICATION",
    "description": "Base artifact for PROCESS",
    "requiredFields": [],
    "impact": {}
  },
  {
    "type": "PROJECT",
    "layer": "BUSINESS",
    "description": "Base artifact for PROJECT",
    "requiredFields": [],
    "impact": {}
  },
  {
    "type": "REPOSITORY",
    "extends": "CODE_ENTITY",
    "description": "Extended artifact for REPOSITORY",
    "requiredFields": [],
    "impact": {}
  },
  {
    "type": "REQUIREMENT",
    "layer": "BUSINESS",
    "description": "Base artifact for REQUIREMENT",
    "requiredFields": [],
    "impact": {}
  },
  {
    "type": "RETIREMENT",
    "extends": "MAINTENANCE",
    "description": "Extended artifact for RETIREMENT",
    "requiredFields": [],
    "impact": {}
  },
  {
    "type": "REVIEW",
    "extends": "DOCUMENTATION",
    "description": "Extended artifact for REVIEW",
    "requiredFields": [],
    "impact": {}
  },
  {
    "type": "RISK",
    "layer": "GOVERNANCE",
    "description": "Base artifact for RISK",
    "requiredFields": [],
    "impact": {}
  },
  {
    "type": "RUNBOOK",
    "extends": "DOCUMENTATION",
    "description": "Extended artifact for RUNBOOK",
    "requiredFields": [],
    "impact": {}
  },
  {
    "type": "SERVICE_CONTRACT",
    "extends": "DOCUMENTATION",
    "description": "Extended artifact for SERVICE_CONTRACT",
    "requiredFields": [],
    "impact": {}
  },
  {
    "type": "SHARED_COMPONENT",
    "extends": "COMPONENT",
    "description": "Extended artifact for SHARED_COMPONENT",
    "requiredFields": [],
    "impact": {}
  },
  {
    "type": "SYNC_WORKER",
    "extends": "CODE_ENTITY",
    "description": "Extended artifact for SYNC_WORKER",
    "requiredFields": [],
    "impact": {}
  },
  {
    "type": "SYSTEM_VERSION",
    "layer": "GOVERNANCE",
    "description": "Base artifact for SYSTEM_VERSION",
    "requiredFields": [],
    "impact": {}
  },
  {
    "type": "TEST_CASE",
    "layer": "VERIFICATION",
    "description": "Base artifact for TEST_CASE",
    "requiredFields": [],
    "impact": {}
  },
  {
    "type": "TEST_RESULTS",
    "extends": "DOCUMENTATION",
    "description": "Extended artifact for TEST_RESULTS",
    "requiredFields": [],
    "impact": {}
  },
  {
    "type": "USE_CASE",
    "layer": "BUSINESS",
    "description": "Base artifact for USE_CASE",
    "requiredFields": [],
    "impact": {}
  },
  {
    "type": "VERSION",
    "layer": "GOVERNANCE",
    "description": "Base artifact for VERSION",
    "requiredFields": [],
    "impact": {}
  }
];
