
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
    "type": "ADAPTER",
    "extends": "CODE_ENTITY",
    "layer": "IMPLEMENTATION",
    "description": "Implements a Port to interact with external systems.",
    "requiredFields": [
      "id",
      "type",
      "title"
    ],
    "impact": {}
  },
  {
    "type": "ADR",
    "extends": "DECISION",
    "layer": "ARCHITECTURE",
    "description": "Architecture decision record.",
    "requiredFields": [
      "id",
      "type",
      "title"
    ],
    "impact": {}
  },
  {
    "type": "ALERT",
    "extends": "MONITORING",
    "layer": "OPERATIONS",
    "description": "Operational alert artifact.",
    "requiredFields": [
      "id",
      "type",
      "title"
    ],
    "impact": {}
  },
  {
    "type": "API",
    "layer": "ARCHITECTURE",
    "description": "Standard API artifact.",
    "requiredFields": [
      "id",
      "type",
      "title"
    ],
    "impact": {}
  },
  {
    "type": "API_ROUTE",
    "extends": "API",
    "layer": "ARCHITECTURE",
    "description": "HTTP API route or endpoint.",
    "requiredFields": [
      "id",
      "type",
      "title"
    ],
    "impact": {}
  },
  {
    "type": "ARCHITECTURE",
    "extends": "DESIGN",
    "layer": "ARCHITECTURE",
    "description": "Architecture-level design artifact.",
    "requiredFields": [
      "id",
      "type",
      "title"
    ],
    "impact": {}
  },
  {
    "type": "ASYNC_WORKER",
    "extends": "CODE_ENTITY",
    "layer": "IMPLEMENTATION",
    "description": "Asynchronous worker implementation.",
    "requiredFields": [
      "id",
      "type",
      "title"
    ],
    "impact": {}
  },
  {
    "type": "BUG",
    "layer": "IMPLEMENTATION",
    "description": "Standard BUG artifact.",
    "requiredFields": [
      "id",
      "type",
      "title"
    ],
    "impact": {}
  },
  {
    "type": "BUSINESS_RULE",
    "layer": "BUSINESS",
    "description": "Standard BUSINESS_RULE artifact.",
    "requiredFields": [
      "id",
      "type",
      "title"
    ],
    "impact": {}
  },
  {
    "type": "CHANGE",
    "layer": "IMPLEMENTATION",
    "description": "Standard CHANGE artifact.",
    "requiredFields": [
      "id",
      "type",
      "title"
    ],
    "impact": {}
  },
  {
    "type": "CHECK",
    "layer": "OPERATIONS",
    "description": "Standard CHECK artifact.",
    "requiredFields": [
      "id",
      "type",
      "title"
    ],
    "impact": {}
  },
  {
    "type": "CI_PIPELINE",
    "extends": "PIPELINE",
    "layer": "OPERATIONS",
    "description": "Continuous integration pipeline.",
    "requiredFields": [
      "id",
      "type",
      "title"
    ],
    "impact": {}
  },
  {
    "type": "CODE_ENTITY",
    "layer": "IMPLEMENTATION",
    "description": "Standard CODE_ENTITY artifact.",
    "requiredFields": [
      "id",
      "type",
      "title"
    ],
    "impact": {}
  },
  {
    "type": "COMPONENT",
    "layer": "ARCHITECTURE",
    "description": "Standard COMPONENT artifact.",
    "requiredFields": [
      "id",
      "type",
      "title"
    ],
    "impact": {}
  },
  {
    "type": "COMPONENT_DIAGRAM",
    "extends": "DESIGN",
    "layer": "ARCHITECTURE",
    "description": "Component diagram design artifact.",
    "requiredFields": [
      "id",
      "type",
      "title"
    ],
    "impact": {}
  },
  {
    "type": "CONSTRAINT",
    "extends": "REQUIREMENT",
    "layer": "BUSINESS",
    "description": "Constraint requirement.",
    "requiredFields": [
      "id",
      "type",
      "title"
    ],
    "impact": {}
  },
  {
    "type": "CONTROLLER",
    "extends": "CODE_ENTITY",
    "layer": "IMPLEMENTATION",
    "description": "Handles user input and coordinates the model and view.",
    "requiredFields": [
      "id",
      "type",
      "title"
    ],
    "impact": {}
  },
  {
    "type": "CUSTOM_TYPE",
    "extends": "CODE_ENTITY",
    "layer": "IMPLEMENTATION",
    "description": "A custom template for code entities.",
    "requiredFields": [
      "id",
      "type",
      "title"
    ],
    "impactSeverityDefault": "low",
    "impact": {}
  },
  {
    "type": "DAO",
    "extends": "CODE_ENTITY",
    "layer": "IMPLEMENTATION",
    "description": "Data access object implementation.",
    "requiredFields": [
      "id",
      "type",
      "title"
    ],
    "impact": {}
  },
  {
    "type": "DASHBOARDS",
    "extends": "MONITORING",
    "layer": "OPERATIONS",
    "description": "Monitoring dashboard artifact.",
    "requiredFields": [
      "id",
      "type",
      "title"
    ],
    "impact": {}
  },
  {
    "type": "DATABASE_ENTITY",
    "layer": "IMPLEMENTATION",
    "description": "Standard DATABASE_ENTITY artifact.",
    "requiredFields": [
      "id",
      "type",
      "title"
    ],
    "impact": {}
  },
  {
    "type": "DEBT",
    "extends": "GOVERNANCE_ARTIFACT",
    "layer": "GOVERNANCE",
    "description": "A conscious or unconscious technical debt item accepted by the team.",
    "requiredFields": [
      "id",
      "type",
      "title"
    ],
    "impact": {}
  },
  {
    "type": "DECISION",
    "layer": "ARCHITECTURE",
    "description": "Standard DECISION artifact.",
    "requiredFields": [
      "id",
      "type",
      "title"
    ],
    "impact": {}
  },
  {
    "type": "DEPLOYMENT",
    "layer": "OPERATIONS",
    "description": "Standard DEPLOYMENT artifact.",
    "requiredFields": [
      "id",
      "type",
      "title"
    ],
    "impact": {}
  },
  {
    "type": "DESIGN",
    "layer": "ARCHITECTURE",
    "description": "Standard DESIGN artifact.",
    "requiredFields": [
      "id",
      "type",
      "title"
    ],
    "impact": {}
  },
  {
    "type": "DOCUMENTATION",
    "layer": "DOCUMENTATION",
    "description": "Standard DOCUMENTATION artifact.",
    "requiredFields": [
      "id",
      "type",
      "title"
    ],
    "impact": {}
  },
  {
    "type": "DOCUMENTATION_FREEZE",
    "extends": "DOCUMENTATION",
    "layer": "DOCUMENTATION",
    "description": "A static snapshot of the architecture graph exported via a profile.",
    "requiredFields": [
      "id",
      "type",
      "profile",
      "format"
    ],
    "impact": {}
  },
  {
    "type": "DTO",
    "extends": "CODE_ENTITY",
    "layer": "IMPLEMENTATION",
    "description": "Data transfer object implementation.",
    "requiredFields": [
      "id",
      "type",
      "title"
    ],
    "impact": {}
  },
  {
    "type": "ENTITY",
    "extends": "CODE_ENTITY",
    "layer": "IMPLEMENTATION",
    "description": "Domain or persistence entity implementation.",
    "requiredFields": [
      "id",
      "type",
      "title"
    ],
    "impact": {}
  },
  {
    "type": "ENVIRONMENT",
    "layer": "OPERATIONS",
    "description": "Standard ENVIRONMENT artifact.",
    "requiredFields": [
      "id",
      "type",
      "title"
    ],
    "impact": {}
  },
  {
    "type": "EPIC",
    "layer": "BUSINESS",
    "description": "Standard EPIC artifact.",
    "requiredFields": [
      "id",
      "type",
      "title"
    ],
    "impact": {}
  },
  {
    "type": "EVIDENCE",
    "extends": "DOCUMENTATION",
    "layer": "DOCUMENTATION",
    "description": "Verification or audit evidence.",
    "requiredFields": [
      "id",
      "type",
      "title"
    ],
    "impact": {}
  },
  {
    "type": "FEATURE",
    "layer": "BUSINESS",
    "description": "Standard FEATURE artifact.",
    "requiredFields": [
      "id",
      "type",
      "title"
    ],
    "impact": {}
  },
  {
    "type": "FUNCTIONAL",
    "extends": "REQUIREMENT",
    "layer": "BUSINESS",
    "description": "Functional requirement.",
    "requiredFields": [
      "id",
      "type",
      "title"
    ],
    "impact": {}
  },
  {
    "type": "GAP",
    "extends": "GOVERNANCE_ARTIFACT",
    "layer": "GOVERNANCE",
    "description": "A missing semantic link or architectural anomaly detected by the system.",
    "requiredFields": [
      "id",
      "type",
      "title"
    ],
    "impact": {}
  },
  {
    "type": "GITHUB_ACTIONS",
    "extends": "DEPLOYMENT",
    "layer": "OPERATIONS",
    "description": "GitHub Actions deployment workflow.",
    "requiredFields": [
      "id",
      "type",
      "title"
    ],
    "impact": {}
  },
  {
    "type": "GLOSSARY_TERM",
    "layer": "DOCUMENTATION",
    "description": "Standard GLOSSARY_TERM artifact.",
    "requiredFields": [
      "id",
      "type",
      "title"
    ],
    "impact": {}
  },
  {
    "type": "GOVERNANCE_ARTIFACT",
    "extends": "CUSTOM_TYPE",
    "layer": "GOVERNANCE",
    "description": "A persistent finding or operational fact regarding system architecture.",
    "requiredFields": [
      "id",
      "type",
      "title"
    ],
    "impact": {}
  },
  {
    "type": "INCIDENT",
    "layer": "OPERATIONS",
    "description": "Standard INCIDENT artifact.",
    "requiredFields": [
      "id",
      "type",
      "title"
    ],
    "impact": {}
  },
  {
    "type": "INFRASTRUCTURE",
    "layer": "OPERATIONS",
    "description": "Standard INFRASTRUCTURE artifact.",
    "requiredFields": [
      "id",
      "type",
      "title"
    ],
    "impact": {}
  },
  {
    "type": "INTEGRATION",
    "extends": "TEST_CASE",
    "requiredFields": [],
    "impact": {}
  },
  {
    "type": "INTEGRATION_TEST",
    "extends": "TEST_CASE",
    "layer": "IMPLEMENTATION",
    "description": "Integration test case.",
    "requiredFields": [
      "id",
      "type",
      "title"
    ],
    "impact": {}
  },
  {
    "type": "KUBERNETES",
    "extends": "DEPLOYMENT",
    "layer": "OPERATIONS",
    "description": "Kubernetes deployment artifact.",
    "requiredFields": [
      "id",
      "type",
      "title"
    ],
    "impact": {}
  },
  {
    "type": "LIBRARY",
    "layer": "IMPLEMENTATION",
    "description": "Standard LIBRARY artifact.",
    "requiredFields": [
      "id",
      "type",
      "title"
    ],
    "impact": {}
  },
  {
    "type": "MAINTENANCE",
    "layer": "OPERATIONS",
    "description": "Standard MAINTENANCE artifact.",
    "requiredFields": [
      "id",
      "type",
      "title"
    ],
    "impact": {}
  },
  {
    "type": "MONITORING",
    "layer": "OPERATIONS",
    "description": "Standard MONITORING artifact.",
    "requiredFields": [
      "id",
      "type",
      "title"
    ],
    "impact": {}
  },
  {
    "type": "NON_FUNCTIONAL_REQUIREMENT",
    "extends": "REQUIREMENT",
    "layer": "BUSINESS",
    "description": "Non-functional requirement.",
    "requiredFields": [
      "id",
      "type",
      "title"
    ],
    "impact": {}
  },
  {
    "type": "OBSERVATION",
    "extends": "GOVERNANCE_ARTIFACT",
    "layer": "GOVERNANCE",
    "description": "A non-critical governance observation or recommendation.",
    "requiredFields": [
      "id",
      "type",
      "title"
    ],
    "impact": {}
  },
  {
    "type": "PACKAGE",
    "extends": "CHANGE",
    "layer": "IMPLEMENTATION",
    "description": "Package or distributable artifact.",
    "requiredFields": [
      "id",
      "type",
      "title"
    ],
    "impact": {}
  },
  {
    "type": "PATCH",
    "extends": "CHANGE",
    "requiredFields": [],
    "impact": {}
  },
  {
    "type": "PIPELINE",
    "layer": "OPERATIONS",
    "description": "Standard PIPELINE artifact.",
    "requiredFields": [
      "id",
      "type",
      "title"
    ],
    "impact": {}
  },
  {
    "type": "PORT",
    "extends": "CODE_ENTITY",
    "layer": "ARCHITECTURE",
    "description": "Defines an interface for communication with the outside world.",
    "requiredFields": [
      "id",
      "type",
      "title"
    ],
    "impact": {}
  },
  {
    "type": "PROCESS",
    "layer": "DOCUMENTATION",
    "description": "Standard PROCESS artifact.",
    "requiredFields": [
      "id",
      "type",
      "title"
    ],
    "impact": {}
  },
  {
    "type": "PROJECT",
    "layer": "BUSINESS",
    "description": "Standard PROJECT artifact.",
    "requiredFields": [
      "id",
      "type",
      "title"
    ],
    "impact": {}
  },
  {
    "type": "REPOSITORY",
    "extends": "CODE_ENTITY",
    "layer": "IMPLEMENTATION",
    "description": "Repository implementation artifact.",
    "requiredFields": [
      "id",
      "type",
      "title"
    ],
    "impact": {}
  },
  {
    "type": "REQUIREMENT",
    "layer": "BUSINESS",
    "description": "Standard REQUIREMENT artifact.",
    "requiredFields": [
      "id",
      "type",
      "title"
    ],
    "impact": {}
  },
  {
    "type": "RETIREMENT",
    "extends": "CHANGE",
    "requiredFields": [],
    "impact": {}
  },
  {
    "type": "REVIEW",
    "extends": "DOCUMENTATION",
    "layer": "DOCUMENTATION",
    "description": "Review documentation artifact.",
    "requiredFields": [
      "id",
      "type",
      "title"
    ],
    "impact": {}
  },
  {
    "type": "RISK",
    "layer": "DOCUMENTATION",
    "description": "Standard RISK artifact.",
    "requiredFields": [
      "id",
      "type",
      "title"
    ],
    "impact": {}
  },
  {
    "type": "RUNBOOK",
    "extends": "DOCUMENTATION",
    "layer": "DOCUMENTATION",
    "description": "Operational runbook.",
    "requiredFields": [
      "id",
      "type",
      "title"
    ],
    "impact": {}
  },
  {
    "type": "SERVICE_CONTRACT",
    "extends": "API",
    "layer": "ARCHITECTURE",
    "description": "Service API contract.",
    "requiredFields": [
      "id",
      "type",
      "title"
    ],
    "impact": {}
  },
  {
    "type": "SHARED_COMPONENT",
    "extends": "CODE_ENTITY",
    "layer": "IMPLEMENTATION",
    "description": "Shared UI or application component.",
    "requiredFields": [
      "id",
      "type",
      "title"
    ],
    "impact": {}
  },
  {
    "type": "SYSTEM_VERSION",
    "layer": "OPERATIONS",
    "description": "Standard SYSTEM_VERSION artifact.",
    "requiredFields": [
      "id",
      "type",
      "title",
      "component",
      "version",
      "releaseDate"
    ],
    "impact": {}
  },
  {
    "type": "TEST_CASE",
    "layer": "IMPLEMENTATION",
    "description": "Standard TEST_CASE artifact.",
    "requiredFields": [
      "id",
      "type",
      "title"
    ],
    "impact": {}
  },
  {
    "type": "TEST_RESULTS",
    "extends": "DOCUMENTATION",
    "layer": "DOCUMENTATION",
    "description": "Test result documentation.",
    "requiredFields": [
      "id",
      "type",
      "title"
    ],
    "impact": {}
  },
  {
    "type": "USE_CASE",
    "layer": "BUSINESS",
    "description": "Standard USE_CASE artifact.",
    "requiredFields": [
      "id",
      "type",
      "title"
    ],
    "impact": {}
  },
  {
    "type": "VERSION",
    "layer": "DOCUMENTATION",
    "description": "Standard VERSION artifact.",
    "requiredFields": [
      "id",
      "type",
      "title",
      "name",
      "timestamp",
      "parentVersion"
    ],
    "impact": {}
  },
  {
    "type": "VIOLATION",
    "extends": "GOVERNANCE_ARTIFACT",
    "layer": "GOVERNANCE",
    "description": "An explicit violation of an architectural rule contract.",
    "requiredFields": [
      "id",
      "type",
      "title"
    ],
    "impact": {}
  }
];
