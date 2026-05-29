#!/usr/bin/env node

// scripts/cli/openlag.ts
import { execFileSync as execFileSync4 } from "child_process";
import fs10 from "fs";
import path14 from "path";
import { fileURLToPath as fileURLToPath5 } from "url";
import chalk7 from "chalk";
import { Command } from "commander";

// scripts/cli/build.ts
import { execFileSync } from "child_process";
import path6 from "path";
import { fileURLToPath } from "url";
import chalk2 from "chalk";

// scripts/cli/generate.ts
import fs4 from "fs";
import path4 from "path";
import yaml4 from "js-yaml";

// scripts/core/parser/scanner.ts
import fs from "fs";
import path from "path";
function scanDocs(docsDir) {
  const documents = [];
  const traverse = (dir) => {
    if (!fs.existsSync(dir)) return;
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        traverse(fullPath);
      } else if (item.endsWith(".md")) {
        const content = fs.readFileSync(fullPath, "utf-8");
        documents.push({
          file: fullPath,
          content
        });
      }
    }
  };
  traverse(docsDir);
  return documents;
}

// scripts/core/parser/schemas.ts
import { z } from "zod";
var ArtifactSchema = z.object({
  id: z.string(),
  type: z.string(),
  title: z.string(),
  version: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(["draft", "in_progress", "ready", "closed", "deprecated"]).optional(),
  layer: z.string().optional(),
  ownership: z.object({
    owner: z.string().optional(),
    team: z.string().optional(),
    domain: z.string().optional(),
    maintainers: z.array(z.string()).optional(),
    reviewers: z.array(z.string()).optional(),
    steward: z.string().optional()
  }).optional(),
  file: z.string()
});

// src/core/semantic/artifact-layers.ts
var LayerInferenceRules = {
  PROJECT: "BUSINESS",
  EPIC: "BUSINESS",
  FEATURE: "BUSINESS",
  REQUIREMENT: "BUSINESS",
  BUSINESS_RULE: "BUSINESS",
  USE_CASE: "BUSINESS",
  DESIGN: "ARCHITECTURE",
  DECISION: "ARCHITECTURE",
  COMPONENT: "ARCHITECTURE",
  API: "ARCHITECTURE",
  CODE_ENTITY: "IMPLEMENTATION",
  DATABASE_ENTITY: "IMPLEMENTATION",
  TEST_CASE: "IMPLEMENTATION",
  CHANGE: "IMPLEMENTATION",
  BUG: "IMPLEMENTATION",
  RISK: "IMPLEMENTATION",
  INCIDENT: "OPERATIONS",
  INFRASTRUCTURE: "OPERATIONS",
  DEPLOYMENT: "OPERATIONS",
  MONITORING: "OPERATIONS",
  MAINTENANCE: "OPERATIONS",
  SYSTEM_VERSION: "OPERATIONS",
  GLOSSARY_TERM: "DOCUMENTATION",
  DOCUMENTATION: "DOCUMENTATION",
  VERSION: "DOCUMENTATION",
  LIBRARY: "IMPLEMENTATION",
  ENVIRONMENT: "OPERATIONS",
  CHECK: "OPERATIONS",
  PROCESS: "OPERATIONS",
  PIPELINE: "OPERATIONS"
};
function inferLayer(artifactType) {
  return LayerInferenceRules[artifactType];
}

// src/core/generated/artifact-definitions.ts
var GENERATED_ARTIFACTS = [
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

// src/core/registry/ArtifactRegistry.ts
var ArtifactRegistry = class {
  static {
    this.artifactsMap = new Map(
      GENERATED_ARTIFACTS.map((art) => [art.type, art])
    );
  }
  static configure(contracts) {
    this.artifactsMap = new Map(
      contracts.filter((art) => art.type).map((art) => [art.type, art])
    );
  }
  static getValidTypes() {
    return Array.from(this.artifactsMap.keys());
  }
  static getContract(type) {
    return this.artifactsMap.get(type);
  }
  static isValid(type) {
    return this.artifactsMap.has(type);
  }
  static getBaseType(type) {
    const contract = this.artifactsMap.get(type);
    if (contract && contract.extends) {
      return this.getBaseType(contract.extends);
    }
    return type;
  }
  static isCompatibleType(allowedType, actualType) {
    if (allowedType === actualType) return true;
    const contract = this.artifactsMap.get(actualType);
    if (contract && contract.extends) {
      return this.isCompatibleType(allowedType, contract.extends);
    }
    return false;
  }
  static getAllContracts() {
    return Array.from(this.artifactsMap.values());
  }
};

// scripts/core/parser/normalizer.ts
function normalizeArtifact(parsed, fullPath, body) {
  const p = { ...parsed };
  const typeValue = p.type || p.Type;
  const contract = ArtifactRegistry.getContract(typeValue);
  const derivedLayer = contract?.layer || inferLayer(typeValue);
  return {
    id: String(p.id || p.ID || ""),
    type: typeValue,
    title: String(p.title || p.Title || (p.id || p.ID || "")),
    version: p.version || p.Version,
    description: p.description,
    status: p.status,
    layer: p.layer || derivedLayer,
    ownership: p.ownership || p.owner ? { owner: p.owner, ...p.ownership } : void 0,
    file: fullPath,
    markdownBody: body,
    raw: p
  };
}

// scripts/core/parser/diagnostic.ts
var DiagnosticEngine = class {
  constructor() {
    this.diagnostics = [];
  }
  add(file, message, severity) {
    this.diagnostics.push({ file, message, severity });
  }
  getDiagnostics() {
    return this.diagnostics;
  }
  getErrors() {
    return this.diagnostics.map((d) => ({ file: d.file, message: d.message }));
  }
  hasCritical() {
    return this.diagnostics.some((d) => d.severity === "CRITICAL" /* CRITICAL */);
  }
};

// src/core/generated/relation-definitions.ts
var GENERATED_RELATIONS = [
  {
    "type": "BLOCKS",
    "description": "Descripci\xF3n de impedimentos directos.",
    "category": "DEPENDENCY",
    "allowedFrom": [
      "BUG",
      "RISK",
      "INCIDENT",
      "CHANGE",
      "DECISION",
      "REQUIREMENT",
      "FEATURE",
      "EPIC"
    ],
    "allowedTo": [
      "PROJECT",
      "EPIC",
      "FEATURE",
      "REQUIREMENT",
      "BUG",
      "CHANGE",
      "DEPLOYMENT",
      "DEPLOYMENT"
    ],
    "multiplicity": {
      "from": "many",
      "to": "many"
    },
    "validation": {
      "severity": "error"
    },
    "strength": "STRONG",
    "impact": {
      "propagates": false,
      "directions": [
        "forward"
      ],
      "weight": 1
    }
  },
  {
    "type": "BREAKS",
    "description": "Aver\xEDas o rupturas confirmadas.",
    "category": "OPERATIONAL",
    "allowedFrom": [
      "CHANGE",
      "CODE_ENTITY",
      "COMPONENT",
      "SYSTEM_VERSION"
    ],
    "allowedTo": [
      "TEST_CASE",
      "API",
      "COMPONENT",
      "REQUIREMENT",
      "FEATURE"
    ],
    "multiplicity": {
      "from": "many",
      "to": "many"
    },
    "validation": {
      "severity": "error"
    },
    "strength": "STRONG",
    "impact": {
      "propagates": false,
      "directions": [
        "forward"
      ],
      "weight": 1
    }
  },
  {
    "type": "CALLS",
    "description": "Trazabilidad de invocaci\xF3n a nivel c\xF3digo.",
    "category": "STRUCTURAL",
    "allowedFrom": [
      "CODE_ENTITY"
    ],
    "allowedTo": [
      "CODE_ENTITY",
      "API"
    ],
    "multiplicity": {
      "from": "many",
      "to": "many"
    },
    "validation": {
      "severity": "warn"
    },
    "strength": "MEDIUM",
    "impact": {
      "propagates": true,
      "directions": [
        "reverse"
      ],
      "weight": 1
    }
  },
  {
    "type": "DEFINES",
    "description": "Entidades que instauran glosarios o normas.",
    "category": "SEMANTIC",
    "allowedFrom": [
      "BUSINESS_RULE",
      "DECISION",
      "DOCUMENTATION",
      "GLOSSARY_TERM"
    ],
    "allowedTo": [
      "REQUIREMENT",
      "FEATURE",
      "DESIGN",
      "PROJECT",
      "COMPONENT",
      "API",
      "DATABASE_ENTITY"
    ],
    "multiplicity": {
      "from": "many",
      "to": "many"
    },
    "validation": {
      "severity": "info"
    },
    "strength": "WEAK",
    "impact": {
      "propagates": true,
      "directions": [
        "reverse"
      ],
      "weight": 1
    }
  },
  {
    "type": "DEPENDS_ON",
    "description": "Acoplamiento est\xE1tico arquitect\xF3nico o de empaquetado.",
    "category": "STRUCTURAL",
    "allowedFrom": [
      "CODE_ENTITY",
      "COMPONENT",
      "API",
      "DATABASE_ENTITY",
      "LIBRARY",
      "VERSION",
      "SYSTEM_VERSION"
    ],
    "allowedTo": [
      "CODE_ENTITY",
      "COMPONENT",
      "API",
      "DATABASE_ENTITY",
      "LIBRARY",
      "VERSION",
      "SYSTEM_VERSION"
    ],
    "multiplicity": {
      "from": "many",
      "to": "many"
    },
    "validation": {
      "severity": "warn"
    },
    "strength": "MEDIUM",
    "impact": {
      "propagates": true,
      "directions": [
        "reverse"
      ],
      "weight": 1
    }
  },
  {
    "type": "DEPLOYS",
    "description": "Instanciaci\xF3n de componentes o release en infraestructura.",
    "category": "OPERATIONAL",
    "allowedFrom": [
      "DEPLOYMENT",
      "PIPELINE",
      "SYSTEM_VERSION"
    ],
    "allowedTo": [
      "COMPONENT",
      "INFRASTRUCTURE",
      "ENVIRONMENT",
      "DATABASE_ENTITY"
    ],
    "multiplicity": {
      "from": "many",
      "to": "many"
    },
    "validation": {
      "severity": "error"
    },
    "strength": "STRONG",
    "impact": {
      "propagates": false,
      "directions": [
        "forward"
      ],
      "weight": 1
    }
  },
  {
    "type": "DERIVES_FROM",
    "description": "Evoluci\xF3n conceptual gen\xE9rica.",
    "category": "SEMANTIC",
    "allowedFrom": [
      "REQUIREMENT",
      "FEATURE",
      "DESIGN",
      "BUSINESS_RULE",
      "DECISION",
      "USE_CASE"
    ],
    "allowedTo": [
      "REQUIREMENT",
      "FEATURE",
      "DESIGN",
      "BUSINESS_RULE",
      "DECISION",
      "USE_CASE"
    ],
    "multiplicity": {
      "from": "many",
      "to": "many"
    },
    "validation": {
      "severity": "info"
    },
    "strength": "WEAK",
    "impact": {
      "propagates": true,
      "directions": [
        "reverse"
      ],
      "weight": 1
    }
  },
  {
    "type": "DOCUMENTS",
    "description": "Conecta documentaci\xF3n con el artefacto descrito.",
    "category": "SEMANTIC",
    "allowedFrom": [
      "DOCUMENTATION",
      "CHANGE"
    ],
    "allowedTo": [
      "PROJECT",
      "EPIC",
      "FEATURE",
      "REQUIREMENT",
      "USE_CASE",
      "DESIGN",
      "DECISION",
      "CODE_ENTITY",
      "TEST_CASE",
      "CHANGE",
      "BUG",
      "INCIDENT",
      "COMPONENT",
      "API",
      "DATABASE_ENTITY",
      "DOCUMENTATION",
      "SYSTEM_VERSION",
      "VERSION",
      "BUSINESS_RULE",
      "RISK",
      "GLOSSARY_TERM",
      "INFRASTRUCTURE",
      "DEPLOYMENT",
      "MONITORING",
      "MAINTENANCE",
      "LIBRARY",
      "ENVIRONMENT",
      "CHECK",
      "PROCESS",
      "PIPELINE"
    ],
    "multiplicity": {
      "from": "many",
      "to": "many"
    },
    "validation": {
      "severity": "info"
    },
    "strength": "WEAK",
    "impact": {
      "propagates": true,
      "directions": [
        "reverse"
      ],
      "weight": 1
    }
  },
  {
    "type": "FIXES",
    "description": "Conecta correcciones con bugs o incidentes.",
    "category": "TRACEABILITY",
    "allowedFrom": [
      "CODE_ENTITY",
      "CHANGE",
      "DECISION"
    ],
    "allowedTo": [
      "BUG",
      "INCIDENT"
    ],
    "multiplicity": {
      "from": "many",
      "to": "many"
    },
    "validation": {
      "severity": "error"
    },
    "strength": "STRONG",
    "impact": {
      "propagates": false,
      "directions": [
        "forward"
      ],
      "weight": 1
    }
  },
  {
    "type": "IMPACTS",
    "description": "Descripci\xF3n de posibles efectos colaterales.",
    "category": "SEMANTIC",
    "allowedFrom": [
      "CHANGE",
      "RISK",
      "BUG",
      "INCIDENT",
      "DECISION"
    ],
    "allowedTo": [
      "PROJECT",
      "EPIC",
      "FEATURE",
      "REQUIREMENT",
      "DESIGN",
      "CODE_ENTITY",
      "COMPONENT",
      "API",
      "DATABASE_ENTITY",
      "SYSTEM_VERSION"
    ],
    "multiplicity": {
      "from": "many",
      "to": "many"
    },
    "validation": {
      "severity": "warn"
    },
    "strength": "MEDIUM",
    "impact": {
      "propagates": true,
      "directions": [
        "forward"
      ],
      "weight": 1
    }
  },
  {
    "type": "IMPLEMENTS",
    "description": "Conecta implementaci\xF3n con necesidad funcional/t\xE9cnica.",
    "category": "TRACEABILITY",
    "allowedFrom": [
      "CODE_ENTITY"
    ],
    "allowedTo": [
      "REQUIREMENT",
      "FEATURE",
      "BUG",
      "API"
    ],
    "multiplicity": {
      "from": "many",
      "to": "many"
    },
    "validation": {
      "severity": "error"
    },
    "strength": "STRONG",
    "impact": {
      "propagates": true,
      "directions": [
        "reverse"
      ],
      "weight": 1
    }
  },
  {
    "type": "IMPORTS",
    "description": "Trazabilidad de importaci\xF3n est\xE1tica a nivel de c\xF3digo.",
    "category": "STRUCTURAL",
    "allowedFrom": [
      "CODE_ENTITY"
    ],
    "allowedTo": [
      "CODE_ENTITY",
      "LIBRARY"
    ],
    "multiplicity": {
      "from": "many",
      "to": "many"
    },
    "validation": {
      "severity": "warn"
    },
    "strength": "MEDIUM",
    "impact": {
      "propagates": true,
      "directions": [
        "reverse"
      ],
      "weight": 1
    }
  },
  {
    "type": "JUSTIFIES",
    "description": "Conecta decisiones con aquello que justifican.",
    "category": "SEMANTIC",
    "allowedFrom": [
      "DECISION"
    ],
    "allowedTo": [
      "DESIGN",
      "REQUIREMENT",
      "FEATURE",
      "CODE_ENTITY",
      "COMPONENT"
    ],
    "multiplicity": {
      "from": "many",
      "to": "many"
    },
    "validation": {
      "severity": "warn"
    },
    "strength": "MEDIUM",
    "impact": {
      "propagates": true,
      "directions": [
        "reverse"
      ],
      "weight": 1
    }
  },
  {
    "type": "MONITORS",
    "description": "Relaci\xF3n de observabilidad.",
    "category": "OPERATIONAL",
    "allowedFrom": [
      "MONITORING",
      "CHECK"
    ],
    "allowedTo": [
      "COMPONENT",
      "INFRASTRUCTURE",
      "DEPLOYMENT",
      "DATABASE_ENTITY",
      "API"
    ],
    "multiplicity": {
      "from": "many",
      "to": "many"
    },
    "validation": {
      "severity": "info"
    },
    "strength": "WEAK",
    "impact": {
      "propagates": false,
      "directions": [
        "forward"
      ],
      "weight": 1
    }
  },
  {
    "type": "REFINES",
    "description": "Descompone artefactos en otros m\xE1s concretos.",
    "category": "TRACEABILITY",
    "allowedFrom": [
      "EPIC",
      "FEATURE",
      "REQUIREMENT"
    ],
    "allowedTo": [
      "EPIC",
      "FEATURE",
      "REQUIREMENT",
      "CHANGE"
    ],
    "multiplicity": {
      "from": "many",
      "to": "many"
    },
    "validation": {
      "severity": "warn"
    },
    "strength": "MEDIUM",
    "impact": {
      "propagates": true,
      "directions": [
        "reverse"
      ],
      "weight": 1
    }
  },
  {
    "type": "RELATES_TO",
    "description": 'Uso gen\xE9rico propenso a poluci\xF3n sem\xE1ntica. (DISCOURAGED)\nPara mantener un grafo limpio, solo \xFAsala aportando rationale expl\xEDcito:\n\nrelations:\n  - to: mi-otro-artefacto\n    type: RELATES_TO\n    rationale: "No encaja con USES o DEPENDS_ON debido al contexto X."\n',
    "category": "SEMANTIC",
    "allowedFrom": [
      "PROJECT",
      "EPIC",
      "FEATURE",
      "REQUIREMENT",
      "BUSINESS_RULE",
      "USE_CASE",
      "DESIGN",
      "DECISION",
      "CODE_ENTITY",
      "TEST_CASE",
      "CHANGE",
      "BUG",
      "RISK",
      "GLOSSARY_TERM",
      "COMPONENT",
      "API",
      "DATABASE_ENTITY",
      "DOCUMENTATION",
      "INCIDENT",
      "INFRASTRUCTURE",
      "DEPLOYMENT",
      "MONITORING",
      "MAINTENANCE",
      "SYSTEM_VERSION",
      "VERSION",
      "LIBRARY",
      "ENVIRONMENT",
      "CHECK",
      "PROCESS",
      "PIPELINE"
    ],
    "allowedTo": [
      "PROJECT",
      "EPIC",
      "FEATURE",
      "REQUIREMENT",
      "BUSINESS_RULE",
      "USE_CASE",
      "DESIGN",
      "DECISION",
      "CODE_ENTITY",
      "TEST_CASE",
      "CHANGE",
      "BUG",
      "RISK",
      "GLOSSARY_TERM",
      "COMPONENT",
      "API",
      "DATABASE_ENTITY",
      "DOCUMENTATION",
      "INCIDENT",
      "INFRASTRUCTURE",
      "DEPLOYMENT",
      "MONITORING",
      "MAINTENANCE",
      "SYSTEM_VERSION",
      "VERSION",
      "LIBRARY",
      "ENVIRONMENT",
      "CHECK",
      "PROCESS",
      "PIPELINE"
    ],
    "multiplicity": {
      "from": "many",
      "to": "many"
    },
    "validation": {
      "severity": "warn"
    },
    "strength": "MEDIUM",
    "impact": {
      "propagates": true,
      "directions": [
        "both"
      ],
      "weight": 0.5
    }
  },
  {
    "type": "REPLACES",
    "description": "Evoluci\xF3n e hist\xF3rico, deprecando versiones anteriores.",
    "category": "EVOLUTIONARY",
    "allowedFrom": [
      "COMPONENT",
      "API",
      "SYSTEM_VERSION",
      "VERSION",
      "REQUIREMENT",
      "FEATURE",
      "DESIGN",
      "DECISION"
    ],
    "allowedTo": [
      "COMPONENT",
      "API",
      "SYSTEM_VERSION",
      "VERSION",
      "REQUIREMENT",
      "FEATURE",
      "DESIGN",
      "DECISION"
    ],
    "multiplicity": {
      "from": "many",
      "to": "one"
    },
    "validation": {
      "severity": "info"
    },
    "strength": "WEAK",
    "impact": {
      "propagates": true,
      "directions": [
        "forward"
      ],
      "weight": 1
    }
  },
  {
    "type": "TESTS",
    "description": "Conecta tests con comportamiento validado.",
    "category": "TRACEABILITY",
    "allowedFrom": [
      "TEST_CASE"
    ],
    "allowedTo": [
      "CODE_ENTITY",
      "REQUIREMENT",
      "FEATURE",
      "BUG",
      "USE_CASE"
    ],
    "multiplicity": {
      "from": "many",
      "to": "many"
    },
    "validation": {
      "severity": "error"
    },
    "strength": "STRONG",
    "impact": {
      "propagates": true,
      "directions": [
        "reverse"
      ],
      "weight": 1
    }
  },
  {
    "type": "USES",
    "description": "Llamada funcional, invocaci\xF3n o flujo en tiempo de ejecuci\xF3n.",
    "category": "OPERATIONAL",
    "allowedFrom": [
      "CODE_ENTITY",
      "COMPONENT",
      "API",
      "FEATURE",
      "USE_CASE"
    ],
    "allowedTo": [
      "CODE_ENTITY",
      "COMPONENT",
      "API",
      "SYSTEM_VERSION"
    ],
    "multiplicity": {
      "from": "many",
      "to": "many"
    },
    "validation": {
      "severity": "warn"
    },
    "strength": "MEDIUM",
    "impact": {
      "propagates": true,
      "directions": [
        "reverse"
      ],
      "weight": 1
    }
  },
  {
    "type": "VALIDATES",
    "description": "Validaci\xF3n emp\xEDrica/humana (QA Manual).",
    "category": "TRACEABILITY",
    "allowedFrom": [
      "PROCESS",
      "CHECK",
      "DOCUMENTATION"
    ],
    "allowedTo": [
      "REQUIREMENT",
      "FEATURE",
      "USE_CASE",
      "DEPLOYMENT",
      "VERSION"
    ],
    "multiplicity": {
      "from": "many",
      "to": "many"
    },
    "validation": {
      "severity": "info"
    },
    "strength": "WEAK",
    "impact": {
      "propagates": true,
      "directions": [
        "reverse"
      ],
      "weight": 1
    }
  }
];

// src/core/registry/RelationRegistry.ts
var RelationRegistry = class {
  static {
    this.relationsMap = new Map(
      GENERATED_RELATIONS.map((rel) => [rel.type, rel])
    );
  }
  static configure(contracts) {
    this.relationsMap = new Map(
      contracts.filter((rel) => rel.type).map((rel) => [rel.type, rel])
    );
  }
  static getValidTypes() {
    return Array.from(this.relationsMap.keys());
  }
  static getContract(type) {
    return this.relationsMap.get(type);
  }
  static isValid(type) {
    return this.relationsMap.has(type);
  }
  static getRelationsByCategory(category) {
    return Array.from(this.relationsMap.values()).filter((rel) => rel.category === category);
  }
  static getAllContracts() {
    return Array.from(this.relationsMap.values());
  }
};

// scripts/core/parser.ts
import yaml from "js-yaml";
function parseOpenLagDocs(docsDir) {
  const diag = new DiagnosticEngine();
  const state = {
    versions: [],
    systemVersions: [],
    changes: [],
    artifacts: [],
    relations: [],
    errors: []
  };
  const documents = scanDocs(docsDir);
  for (const doc of documents) {
    const { content, file: fullPath } = doc;
    const sections = content.split(/---+\r?\n/);
    let i = 0;
    if (content.trim().startsWith("---")) i = 1;
    for (; i < sections.length; i += 1) {
      const section = sections[i].trim();
      if (section.length < 5) continue;
      let parsed;
      try {
        const yamlCandidate = sections[i].split("\n").map((l) => l.replace(/^##\s?/, "")).join("\n").replace(/---$/, "").trim();
        parsed = yaml.load(yamlCandidate);
      } catch (e) {
        throw new Error(`CRITICAL: Invalid YAML block in ${fullPath}: ${e.message}`, { cause: e });
      }
      if (parsed && typeof parsed === "object" && (parsed.id || parsed.ID) && (parsed.type || parsed.Type)) {
        const body = i + 1 < sections.length ? sections[i + 1].trim() : "";
        if (i + 1 < sections.length) i++;
        const normalized = normalizeArtifact(parsed, fullPath, body);
        try {
          ArtifactSchema.parse(normalized);
          const artifact = normalized;
          state.artifacts.push(artifact);
          const typeValue = artifact.type;
          if (typeValue === "VERSION") {
            state.versions.push({
              id: artifact.id,
              name: String(parsed.name || ""),
              timestamp: String(parsed.timestamp || ""),
              parentVersion: parsed.parentVersion || null
            });
          } else if (typeValue === "SYSTEM_VERSION") {
            state.systemVersions.push({
              id: artifact.id,
              component: String(parsed.component || ""),
              version: String(parsed.version || ""),
              releaseDate: String(parsed.releaseDate || "")
            });
          } else if (typeValue === "CHANGE") {
            state.changes.push({
              id: artifact.id,
              type: parsed.changeType || "FEATURE",
              title: artifact.title,
              description: artifact.description,
              affects: Array.isArray(parsed.affects) ? parsed.affects : [],
              versionFrom: String(parsed.versionFrom || ""),
              versionTo: String(parsed.versionTo || "")
            });
          }
          const rels = parsed.relations || parsed.Relations;
          if (rels) {
            const relArray = Array.isArray(rels) ? rels : [rels];
            relArray.forEach((rel, idx) => {
              const to = typeof rel === "string" ? rel : rel.to || rel.id || rel.ID;
              if (to) {
                const relType = rel.type;
                if (!relType) {
                  diag.add(fullPath, `Relation targeting ${to} missing 'type' in artifact ${artifact.id}`, "WARNING" /* WARNING */);
                  return;
                }
                const contract = RelationRegistry.getContract(relType);
                state.relations.push({
                  id: `rel-${artifact.id}-${idx}`,
                  from: artifact.id,
                  to: String(to),
                  type: relType,
                  category: contract?.category,
                  strength: contract?.strength,
                  file: fullPath
                });
              }
            });
          }
        } catch (e) {
          let msg = e.message;
          if (e.errors && Array.isArray(e.errors)) {
            msg = e.errors.map((err) => `\`${err.path.join(".")}\`: ${err.message}`).join(", ");
          } else {
            try {
              const parsed2 = JSON.parse(e.message);
              if (Array.isArray(parsed2)) {
                msg = parsed2.map((err) => `\`${err.path.join(".")}\`: ${err.message}`).join(", ");
              }
            } catch {
              msg = e.message;
            }
          }
          diag.add(fullPath, `Schema validation failed.

${msg}`, "INVALID" /* INVALID */);
        }
      } else if (parsed && typeof parsed === "object") {
        if (!(parsed.id || parsed.ID)) {
          diag.add(fullPath, `Missing ID in artifact`, "INVALID" /* INVALID */);
        } else if (!(parsed.type || parsed.Type)) {
          diag.add(fullPath, `Missing Type in artifact`, "INVALID" /* INVALID */);
        }
      }
    }
  }
  state.errors = diag.getErrors();
  return state;
}

// scripts/core/artifact-contracts.ts
import fs2 from "fs";
import path2 from "path";
import yaml2 from "js-yaml";
function readArtifactContracts(artifactsDir) {
  if (!fs2.existsSync(artifactsDir)) return [];
  return fs2.readdirSync(artifactsDir).filter((file) => file.endsWith(".yaml")).map((file) => {
    const content = fs2.readFileSync(path2.join(artifactsDir, file), "utf-8");
    const parsed = yaml2.load(content);
    return {
      type: parsed.type,
      extends: parsed.extends,
      layer: parsed.layer,
      description: parsed.description,
      requiredFields: parsed.requiredFields || [],
      impactSeverityDefault: parsed.impactSeverityDefault,
      impact: parsed.impact || {}
    };
  }).filter((contract) => Boolean(contract.type));
}
function loadArtifactContracts(artifactsDir) {
  const contracts = readArtifactContracts(artifactsDir);
  if (contracts.length > 0) {
    ArtifactRegistry.configure(contracts);
  }
  return contracts;
}

// scripts/core/relation-contracts.ts
import fs3 from "fs";
import path3 from "path";
import yaml3 from "js-yaml";
function readRelationContracts(relationsDir) {
  if (!fs3.existsSync(relationsDir)) return [];
  return fs3.readdirSync(relationsDir).filter((file) => file.endsWith(".yaml")).map((file) => {
    const content = fs3.readFileSync(path3.join(relationsDir, file), "utf-8");
    const parsed = yaml3.load(content);
    const strength = parsed.validation?.severity === "error" ? "STRONG" : parsed.validation?.severity === "warn" ? "MEDIUM" : "WEAK";
    return {
      type: parsed.relation,
      description: parsed.description,
      category: parsed.category,
      allowedFrom: parsed.allowedFrom || [],
      allowedTo: parsed.allowedTo || [],
      multiplicity: parsed.multiplicity || { from: "many", to: "many" },
      validation: parsed.validation || { severity: "error" },
      strength,
      impact: parsed.impact || { propagates: false, directions: ["forward"], weight: 0.5 }
    };
  }).filter((contract) => Boolean(contract.type));
}
function loadRelationContracts(relationsDir) {
  const contracts = readRelationContracts(relationsDir);
  if (contracts.length > 0) {
    RelationRegistry.configure(contracts);
  }
  return contracts;
}

// scripts/cli/generate.ts
import chokidar from "chokidar";
import chalk from "chalk";

// src/core/generated/rule-definitions.ts
var generatedRules = [
  {
    "id": "codeWithoutRequirement",
    "description": "Code entity has no requirement associated.",
    "severity": "error",
    "matchNode": {
      "type": "CODE_ENTITY"
    },
    "conditions": {
      "requiredRelations": [
        {
          "type": "IMPLEMENTS",
          "toType": [
            "REQUIREMENT",
            "FEATURE",
            "BUG",
            "API"
          ],
          "message": "Code entity has no requirement associated."
        }
      ]
    }
  },
  {
    "id": "requirementWithoutImplementation",
    "description": "Requirement lacks implementation.",
    "severity": "error",
    "matchNode": {
      "type": [
        "REQUIREMENT",
        "FEATURE",
        "USE_CASE"
      ]
    },
    "conditions": {
      "requiredRelations": [
        {
          "type": "IMPLEMENTS",
          "direction": "incoming",
          "message": "Requirement lacks implementation."
        }
      ]
    }
  },
  {
    "id": "requirementWithoutTest",
    "description": "Requirement has no tests linked.",
    "severity": "error",
    "matchNode": {
      "type": [
        "REQUIREMENT",
        "FEATURE",
        "USE_CASE"
      ]
    },
    "conditions": {
      "requiredRelations": [
        {
          "type": "TESTS",
          "direction": "incoming",
          "message": "Requirement has no tests linked."
        }
      ]
    }
  }
];

// src/core/registry/RuleRegistry.ts
var RuleRegistry = class {
  static {
    this.rules = /* @__PURE__ */ new Map();
  }
  static {
    generatedRules.forEach((rule) => {
      this.rules.set(rule.id, rule);
    });
  }
  static getContract(id) {
    return this.rules.get(id);
  }
  static getAll() {
    return Array.from(this.rules.values());
  }
  static isRuleActive(id) {
    return this.rules.has(id);
  }
};

// scripts/lint/lint-rules.ts
function runLintRules(data, profile) {
  const issues = [];
  const normalizeSeverity = (severity) => {
    if (severity === "warn") return "warning";
    if (severity === "error" || severity === "warning" || severity === "info" || severity === "off") return severity;
    return void 0;
  };
  const getByPath = (value, path15) => {
    return path15.split(".").reduce((current, segment) => {
      if (current && typeof current === "object" && segment in current) {
        return current[segment];
      }
      return void 0;
    }, value);
  };
  const getSeverity = (rule, artifactStatus, defaultSeverity = "error") => {
    let severity = normalizeSeverity(profile[rule]) || defaultSeverity;
    if (severity === "off") return "off";
    if (artifactStatus === "draft") {
      if (rule !== "brokenRelation" && rule !== "invalidYaml" && rule !== "duplicateId") {
        severity = "info";
      }
    } else if (artifactStatus === "in_progress") {
      if (rule !== "brokenRelation" && rule !== "invalidYaml" && rule !== "duplicateId") {
        if (severity === "error") severity = "warning";
      }
    }
    return severity;
  };
  const addIssue = (rule, message, file, artifactId, artifactStatus, defaultSev) => {
    const severity = getSeverity(rule, artifactStatus, defaultSev);
    if (severity && severity !== "off") {
      issues.push({ severity, rule, message, file, artifactId });
    }
  };
  for (const error of data.errors) {
    addIssue("invalidYaml", error.message, error.file, void 0, void 0, "error");
  }
  const artifactMap = /* @__PURE__ */ new Map();
  for (const artifact of data.artifacts) {
    const list = artifactMap.get(artifact.id) || [];
    list.push(artifact);
    artifactMap.set(artifact.id, list);
  }
  for (const [id, artifacts] of artifactMap.entries()) {
    if (artifacts.length > 1) {
      addIssue("duplicateId", `Artifact appears in ${artifacts.length} files.`, artifacts[0].file, id, void 0, "error");
    }
  }
  for (const artifact of data.artifacts) {
    if (!ArtifactRegistry.isValid(artifact.type)) {
      addIssue("invalidArtifactType", `Invalid artifact type \`${artifact.type}\`.`, artifact.file, artifact.id, artifact.status, "error");
    } else {
      const contract = ArtifactRegistry.getContract(artifact.type);
      if (contract && contract.requiredFields) {
        for (const field of contract.requiredFields) {
          if (artifact.raw?.[field] === void 0) {
            addIssue("missingRequiredFields", `Missing required field \`${field}\` (Required by \`${artifact.type}\` contract).`, artifact.file, artifact.id, artifact.status, "error");
          }
        }
      }
      if (artifact.raw?.layer && contract && contract.layer && artifact.raw.layer !== contract.layer) {
        addIssue("invalidLayer", `Artifact specifies layer \`${artifact.raw.layer}\` but contract \`${artifact.type}\` requires \`${contract.layer}\`.

Change layer to \`${contract.layer}\`.`, artifact.file, artifact.id, artifact.status, "error");
      }
    }
    if (!artifact.type || !artifact.title) {
      addIssue("missingRequiredFields", `Artifact is missing type or title. Check YAML frontmatter.`, artifact.file, artifact.id, artifact.status, "error");
    }
  }
  const targets = new Set(data.artifacts.map((a) => a.id));
  for (const relation of data.relations) {
    const contract = RelationRegistry.getContract(relation.type);
    if (!contract) {
      addIssue("invalidRelationType", `Invalid relation type: \`${relation.type}\``, relation.file, relation.from, void 0, "error");
    }
    if (!targets.has(relation.to)) {
      addIssue("brokenRelation", `Relation target \`${relation.to}\` does not exist.`, relation.file, relation.from, void 0, "error");
    }
    if (contract) {
      const sourceArtifact = artifactMap.get(relation.from)?.[0];
      const targetArtifact = artifactMap.get(relation.to)?.[0];
      if (sourceArtifact && contract.allowedFrom && contract.allowedFrom.length > 0) {
        const isAllowedSrc = contract.allowedFrom.some((allowed) => ArtifactRegistry.isCompatibleType(allowed, sourceArtifact.type));
        if (!isAllowedSrc) {
          addIssue("invalidRelationType", `Relation \`${relation.type}\` starting from type \`${sourceArtifact.type}\` is NOT ALLOWED.

Try using one of allowed sources: \`${contract.allowedFrom.join(", ")}\` or change relation type.`, relation.file, relation.from, sourceArtifact.status, "error");
        }
      }
      if (targetArtifact && contract.allowedTo && contract.allowedTo.length > 0) {
        const isAllowedDest = contract.allowedTo.some((allowed) => ArtifactRegistry.isCompatibleType(allowed, targetArtifact.type));
        if (!isAllowedDest) {
          addIssue("invalidRelationType", `Relation \`${relation.type}\` targeting \`${targetArtifact.type}\` is NOT ALLOWED.

Allowed targets for \`${relation.type}\` are: \`${contract.allowedTo.join(", ")}\`.`, relation.file, relation.from, sourceArtifact?.status, "error");
        }
      }
    }
  }
  const dynamicRules = RuleRegistry.getAll();
  for (const artifact of data.artifacts) {
    const isDeprecated = artifact.status === "deprecated";
    if (isDeprecated) continue;
    const artifactOutgoingRelations = data.relations.filter((r) => r.from === artifact.id);
    const artifactIncomingRelations = data.relations.filter((r) => r.to === artifact.id);
    for (const rule of dynamicRules) {
      const profileSeverity = normalizeSeverity(profile[rule.id]);
      if (!profileSeverity || profileSeverity === "off") continue;
      if (rule.matchNode) {
        if (rule.matchNode.type) {
          const matchTypes = Array.isArray(rule.matchNode.type) ? rule.matchNode.type : [rule.matchNode.type];
          if (!matchTypes.some((mt) => ArtifactRegistry.isCompatibleType(mt, artifact.type))) continue;
        }
        if (rule.matchNode.layer) {
          const matchLayers = Array.isArray(rule.matchNode.layer) ? rule.matchNode.layer : [rule.matchNode.layer];
          if (!matchLayers.includes(artifact.layer || "")) continue;
        }
      }
      if (rule.conditions) {
        if (rule.conditions.requiredRelations) {
          for (const req of rule.conditions.requiredRelations) {
            const direction = req.direction || "outgoing";
            const candidateRelations = direction === "incoming" ? artifactIncomingRelations : direction === "both" ? [...artifactOutgoingRelations, ...artifactIncomingRelations] : artifactOutgoingRelations;
            const match = candidateRelations.some((rel) => {
              if (rel.type !== req.type) return false;
              if (req.toType) {
                const target = artifactMap.get(direction === "incoming" ? rel.from : rel.to)?.[0];
                if (!target) return false;
                const matchTypes = Array.isArray(req.toType) ? req.toType : [req.toType];
                if (!matchTypes.some((mt) => ArtifactRegistry.isCompatibleType(mt, target.type))) return false;
              }
              if (req.toLayer) {
                const target = artifactMap.get(direction === "incoming" ? rel.from : rel.to)?.[0];
                if (!target) return false;
                const matchLayers = Array.isArray(req.toLayer) ? req.toLayer : [req.toLayer];
                if (!matchLayers.includes(target.layer || "")) return false;
              }
              return true;
            });
            if (!match) {
              addIssue(rule.id, req.message || `Violates required relation rule: ${rule.id}`, artifact.file, artifact.id, artifact.status, profileSeverity);
            }
          }
        }
        if (rule.conditions.forbiddenRelations) {
          for (const fb of rule.conditions.forbiddenRelations) {
            const direction = fb.direction || "outgoing";
            const candidateRelations = direction === "incoming" ? artifactIncomingRelations : direction === "both" ? [...artifactOutgoingRelations, ...artifactIncomingRelations] : artifactOutgoingRelations;
            const match = candidateRelations.find((rel) => {
              if (rel.type !== fb.type) return false;
              if (fb.toType) {
                const target = artifactMap.get(direction === "incoming" ? rel.from : rel.to)?.[0];
                if (!target) return false;
                const matchTypes = Array.isArray(fb.toType) ? fb.toType : [fb.toType];
                if (!matchTypes.some((mt) => ArtifactRegistry.isCompatibleType(mt, target.type))) return false;
              }
              if (fb.toLayer) {
                const target = artifactMap.get(direction === "incoming" ? rel.from : rel.to)?.[0];
                if (!target) return false;
                const matchLayers = Array.isArray(fb.toLayer) ? fb.toLayer : [fb.toLayer];
                if (!matchLayers.includes(target.layer || "")) return false;
              }
              return true;
            });
            if (match) {
              addIssue(rule.id, fb.message || `Violates forbidden relation rule: ${rule.id}`, artifact.file, artifact.id, artifact.status, profileSeverity);
            }
          }
        }
        if (rule.conditions.allowedLayers && artifact.layer) {
          if (!rule.conditions.allowedLayers.includes(artifact.layer)) {
            addIssue(rule.id, `Violates allowed layers: ${rule.id}`, artifact.file, artifact.id, artifact.status, profileSeverity);
          }
        }
        if (rule.conditions.requiredFields) {
          for (const field of rule.conditions.requiredFields) {
            if (getByPath(artifact.raw, field) === void 0) {
              addIssue(rule.id, `Missing required field \`${field}\` (Required by rule \`${rule.id}\`).`, artifact.file, artifact.id, artifact.status, profileSeverity);
            }
          }
        }
      }
    }
    if (artifact.status === "closed") {
      const outgoing = data.relations.filter((r) => r.from === artifact.id);
      for (const rel of outgoing) {
        const targetArts = artifactMap.get(rel.to);
        if (targetArts && targetArts[0]) {
          const targetStatus = targetArts[0].status;
          if (targetStatus === "draft" || targetStatus === "in_progress") {
            if (rel.type !== "RELATES_TO" && rel.type !== "DOCUMENTS" && rel.type !== "JUSTIFIES") {
              addIssue("closedArtifactWithPendingRelations", `Artifact is closed but links to \`${targetStatus}\` artifact \`${rel.to}\` via \`${rel.type}\`.`, artifact.file, artifact.id, artifact.status, "warning");
            }
          }
        }
      }
      if (!artifact.ownership || Object.keys(artifact.ownership).length === 0) {
        addIssue("missingOwnership", `Artifact is closed but has no ownership defined.`, artifact.file, artifact.id, artifact.status, "warning");
      }
    }
    if (ArtifactRegistry.getBaseType(artifact.type) === "API" && (!artifact.ownership || Object.keys(artifact.ownership).length === 0)) {
      addIssue("missingOwnership", `API should have ownership defined.`, artifact.file, artifact.id, artifact.status, "warning");
    }
  }
  return issues;
}

// scripts/lint/lint-profiles.ts
var defaultProfiles = {
  draft: {
    duplicateId: "error",
    invalidYaml: "error",
    brokenRelation: "error",
    missingRequiredFields: "info",
    requirementWithoutImplementation: "info",
    requirementWithoutTest: "info",
    codeWithoutRequirement: "info",
    closedArtifactWithPendingRelations: "info",
    orphanArtifact: "info",
    invalidRelationType: "warning",
    invalidArtifactType: "error",
    invalidLayer: "info",
    invalidLayerRelation: "info",
    missingOwnership: "info"
  },
  feature: {
    duplicateId: "error",
    invalidYaml: "error",
    brokenRelation: "error",
    missingRequiredFields: "warning",
    requirementWithoutImplementation: "info",
    requirementWithoutTest: "info",
    codeWithoutRequirement: "info",
    closedArtifactWithPendingRelations: "warning",
    orphanArtifact: "info",
    invalidRelationType: "error",
    invalidArtifactType: "error",
    invalidLayer: "warning",
    invalidLayerRelation: "info",
    missingOwnership: "info"
  },
  develop: {
    duplicateId: "error",
    invalidYaml: "error",
    brokenRelation: "error",
    missingRequiredFields: "error",
    requirementWithoutImplementation: "warning",
    requirementWithoutTest: "warning",
    codeWithoutRequirement: "warning",
    closedArtifactWithPendingRelations: "warning",
    orphanArtifact: "warning",
    invalidRelationType: "error",
    invalidArtifactType: "error",
    invalidLayer: "warning",
    invalidLayerRelation: "warning",
    missingOwnership: "warning"
  },
  release: {
    duplicateId: "error",
    invalidYaml: "error",
    brokenRelation: "error",
    missingRequiredFields: "error",
    requirementWithoutImplementation: "error",
    requirementWithoutTest: "error",
    codeWithoutRequirement: "error",
    closedArtifactWithPendingRelations: "error",
    orphanArtifact: "error",
    invalidRelationType: "error",
    invalidArtifactType: "error",
    invalidLayer: "error",
    invalidLayerRelation: "error",
    missingOwnership: "error"
  }
};

// scripts/cli/generate.ts
function isDescendant(currentVersionId, artifactVersionId, versions) {
  const artifactVersion2 = versions.find((v) => v.id === artifactVersionId);
  if (!artifactVersion2) return false;
  let temp = versions.find((v) => v.id === currentVersionId);
  let depth = 0;
  while (temp && temp.parentVersion) {
    depth++;
    if (depth > 50) return false;
    if (temp.parentVersion === artifactVersionId) return true;
    temp = versions.find((v) => v.id === temp.parentVersion);
  }
  return false;
}
function generateData(docsDir, outputDir, silent = false) {
  if (!silent) console.log(chalk.blue("\u{1F680} Generating OpenLAG Static Data..."));
  const artifactContracts = loadArtifactContracts(path4.join(docsDir, "contracts", "artifacts"));
  const relationContracts = loadRelationContracts(path4.join(docsDir, "contracts", "relations"));
  const rulesDir = path4.join(docsDir, "contracts", "rules");
  const ruleContracts = [];
  if (fs4.existsSync(rulesDir)) {
    for (const file of fs4.readdirSync(rulesDir)) {
      if (!file.endsWith(".yaml")) continue;
      const raw = fs4.readFileSync(path4.join(rulesDir, file), "utf-8");
      const parsed = yaml4.load(raw);
      if (parsed) ruleContracts.push(parsed);
    }
  }
  const parsedData = parseOpenLagDocs(docsDir);
  let metadata = { name: "OpenLAG Project", description: "Architecture documentation." };
  const metadataPath = path4.join(docsDir, "..", "metadata.json");
  if (fs4.existsSync(metadataPath)) {
    try {
      metadata = JSON.parse(fs4.readFileSync(metadataPath, "utf-8"));
    } catch {
      if (!silent) console.warn(chalk.yellow("\u26A0\uFE0F  Could not parse metadata.json"));
    }
  }
  const lintReports = {};
  for (const profileName of ["draft", "develop", "feature", "release"]) {
    const profile = defaultProfiles[profileName];
    if (profile) {
      lintReports[profileName] = { issues: runLintRules(parsedData, profile) };
    }
  }
  const state = {
    versions: parsedData.versions,
    systemVersions: parsedData.systemVersions,
    graphs: {},
    changes: parsedData.changes,
    lintReports,
    metadata
  };
  const allArtifacts = parsedData.artifacts;
  const allRelations = parsedData.relations;
  state.versions.forEach((v) => {
    state.graphs[v.id] = {
      artifacts: allArtifacts.filter((a) => a.type === "SYSTEM_VERSION" || a.type === "VERSION" || a.version === v.id || isDescendant(v.id, a.version, state.versions)),
      relations: allRelations.filter((r) => {
        const fromArt = allArtifacts.find((a) => a.id === r.from);
        return fromArt && (fromArt.type === "SYSTEM_VERSION" || fromArt.type === "VERSION" || fromArt.version === v.id || isDescendant(v.id, fromArt.version, state.versions));
      })
    };
  });
  if (!fs4.existsSync(outputDir)) fs4.mkdirSync(outputDir, { recursive: true });
  const artifactDefinitionsPath = path4.join(outputDir, "artifact-definitions.json");
  const relationDefinitionsPath = path4.join(outputDir, "relation-definitions.json");
  const ruleDefinitionsPath = path4.join(outputDir, "rule-definitions.json");
  const logContractFallbackStatus = (kind, filePath) => {
    if (fs4.existsSync(filePath)) {
      if (!silent) {
        console.warn(
          chalk.yellow(
            `Warning: No ${kind} contracts found in docs/contracts/${kind}; keeping existing fallback file ${path4.basename(filePath)}.`
          )
        );
      }
      return;
    }
    if (!silent) {
      console.warn(
        chalk.red(
          `Warning: No ${kind} contracts found in docs/contracts/${kind} and no fallback file exists at ${filePath}.`
        )
      );
    }
  };
  if (artifactContracts.length > 0) {
    fs4.writeFileSync(
      artifactDefinitionsPath,
      JSON.stringify(artifactContracts, null, 2)
    );
  } else {
    logContractFallbackStatus("artifacts", artifactDefinitionsPath);
  }
  if (relationContracts.length > 0) {
    fs4.writeFileSync(
      relationDefinitionsPath,
      JSON.stringify(relationContracts, null, 2)
    );
  } else {
    logContractFallbackStatus("relations", relationDefinitionsPath);
  }
  if (ruleContracts.length > 0) {
    fs4.writeFileSync(
      ruleDefinitionsPath,
      JSON.stringify(ruleContracts, null, 2)
    );
  } else {
    logContractFallbackStatus("rules", ruleDefinitionsPath);
  }
  fs4.writeFileSync(
    path4.join(outputDir, "graph-data.json"),
    JSON.stringify(state, null, 2)
  );
  if (!silent) console.log(chalk.green("\u2705 Data generated at"), chalk.cyan(path4.join(outputDir, "graph-data.json")));
}
function watchData(docsDir, outputDir) {
  console.log(chalk.yellow("\u{1F440} Watching for changes in"), chalk.cyan(docsDir));
  const watcher = chokidar.watch(docsDir, {
    ignoreInitial: true,
    persistent: true
  });
  const runCleanly = () => {
    try {
      generateData(docsDir, outputDir, true);
      console.log(chalk.dim(`[${(/* @__PURE__ */ new Date()).toLocaleTimeString()}] `) + chalk.green("Regenerated graph-data.json"));
    } catch (e) {
      console.error(chalk.red("\u274C Error during regeneration:"), e);
    }
  };
  let timeout;
  const debouncedRun = () => {
    clearTimeout(timeout);
    timeout = setTimeout(runCleanly, 300);
  };
  watcher.on("all", () => {
    debouncedRun();
  });
}

// scripts/cli/vite-bin.ts
import path5 from "path";
import { createRequire } from "module";
function resolveViteBin(importMetaUrl) {
  const require2 = createRequire(importMetaUrl);
  const viteEntry = require2.resolve("vite");
  return path5.resolve(path5.dirname(viteEntry), "../../bin/vite.js");
}

// scripts/cli/build.ts
function buildPortal() {
  const packageRoot3 = path6.resolve(path6.dirname(fileURLToPath(import.meta.url)), "../..");
  const viteBin = resolveViteBin(import.meta.url);
  const viteConfig = path6.join(packageRoot3, "vite.config.ts");
  const docsDir = path6.join(process.cwd(), "docs");
  const outputDir = path6.join(process.cwd(), "public");
  console.log(chalk2.blue("Generating contracts (artifacts, relations & rules)..."));
  try {
    execFileSync("tsx", [path6.join(packageRoot3, "scripts/generate-artifacts.ts")], { stdio: "inherit", cwd: process.cwd() });
    execFileSync("tsx", [path6.join(packageRoot3, "scripts/generate-relations.ts")], { stdio: "inherit", cwd: process.cwd() });
    execFileSync("tsx", [path6.join(packageRoot3, "scripts/generate-rules.ts")], { stdio: "inherit", cwd: process.cwd() });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(chalk2.yellow(`Warning: Could not regenerate contracts. Reason: ${message}`));
    console.error(chalk2.yellow("OpenLAG will continue using project public/*.json contract files when present, or bundled generated defaults as fallback."));
  }
  generateData(docsDir, outputDir);
  console.log(chalk2.blue("Building OpenLAG portal..."));
  try {
    execFileSync(process.execPath, [viteBin, "build", "--config", viteConfig], {
      cwd: packageRoot3,
      env: {
        ...process.env,
        OPENLAG_PROJECT_ROOT: process.cwd()
      },
      stdio: "inherit"
    });
    console.log(chalk2.green("Portal build complete."));
  } catch {
    console.error(chalk2.red("Build failed."));
    process.exit(1);
  }
}

// scripts/cli/dev.ts
import { spawn, execFileSync as execFileSync2 } from "child_process";
import path7 from "path";
import { fileURLToPath as fileURLToPath2 } from "url";
import chalk3 from "chalk";
function runDevServer() {
  const packageRoot3 = path7.resolve(path7.dirname(fileURLToPath2(import.meta.url)), "../..");
  const viteBin = resolveViteBin(import.meta.url);
  const viteConfig = path7.join(packageRoot3, "vite.config.ts");
  const projectRoot = process.cwd();
  const docsDir = path7.join(projectRoot, "docs");
  const outputDir = path7.join(projectRoot, "public");
  console.log(chalk3.blue("Generating contracts (artifacts & relations)..."));
  try {
    execFileSync2("tsx", [path7.join(packageRoot3, "scripts/generate-artifacts.ts")], { stdio: "inherit", cwd: projectRoot });
    execFileSync2("tsx", [path7.join(packageRoot3, "scripts/generate-relations.ts")], { stdio: "inherit", cwd: projectRoot });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(chalk3.yellow(`Warning: Could not regenerate contracts. Reason: ${message}`));
    console.error(chalk3.yellow("OpenLAG will continue using project public/*.json contract files when present, or bundled generated defaults as fallback."));
  }
  generateData(docsDir, outputDir);
  watchData(docsDir, outputDir);
  console.log(chalk3.blue("Starting OpenLAG portal dev server..."));
  const vite = spawn(process.execPath, [viteBin, "--config", viteConfig], {
    cwd: packageRoot3,
    env: {
      ...process.env,
      OPENLAG_PROJECT_ROOT: projectRoot
    },
    stdio: "inherit"
  });
  vite.on("close", (code) => {
    process.exit(code || 0);
  });
}

// scripts/cli/init.ts
import fs6 from "fs";
import path9 from "path";
import { fileURLToPath as fileURLToPath4 } from "url";
import chalk4 from "chalk";

// scripts/cli/authoring.ts
import fs5 from "fs";
import path8 from "path";
import { fileURLToPath as fileURLToPath3 } from "url";
import yaml5 from "js-yaml";
function ensureDir(dir) {
  if (!fs5.existsSync(dir)) fs5.mkdirSync(dir, { recursive: true });
}
function writeIfMissing(filePath, content) {
  if (fs5.existsSync(filePath)) return false;
  fs5.writeFileSync(filePath, content, "utf-8");
  return true;
}
function packageRoot() {
  return path8.resolve(path8.dirname(fileURLToPath3(import.meta.url)), "../..");
}
function copyYamlFiles(srcDir, destDir) {
  if (!fs5.existsSync(srcDir)) return 0;
  ensureDir(destDir);
  let copied = 0;
  for (const file of fs5.readdirSync(srcDir).filter((name) => name.endsWith(".yaml")).sort()) {
    fs5.copyFileSync(path8.join(srcDir, file), path8.join(destDir, file));
    copied += 1;
  }
  return copied;
}
function applyProfilePack(profile, projectRoot = process.cwd()) {
  const profileDir = path8.join(packageRoot(), "profiles", profile);
  if (!fs5.existsSync(profileDir)) {
    throw new Error(`Profile pack '${profile}' not found in ${profileDir}.`);
  }
  const contractsDir = path8.join(projectRoot, "docs", "contracts");
  let copied = 0;
  copied += copyYamlFiles(path8.join(profileDir, "artifacts"), path8.join(contractsDir, "artifacts"));
  copied += copyYamlFiles(path8.join(profileDir, "relations"), path8.join(contractsDir, "relations"));
  copied += copyYamlFiles(path8.join(profileDir, "rules"), path8.join(contractsDir, "rules"));
  copied += copyYamlFiles(path8.join(profileDir, "contracts", "rules"), path8.join(contractsDir, "rules"));
  copied += copyYamlFiles(path8.join(profileDir, "export-profiles"), path8.join(contractsDir, "export-profiles"));
  copied += copyYamlFiles(path8.join(profileDir, "templates"), path8.join(projectRoot, "templates"));
  return { copied, profileDir };
}
function validateProfilePack(profileDir) {
  const errors = [];
  const manifestPath = path8.join(profileDir, "profile.yaml");
  if (fs5.existsSync(manifestPath)) {
    const manifest = yaml5.load(fs5.readFileSync(manifestPath, "utf-8"));
    if (!manifest || typeof manifest !== "object") errors.push("profile.yaml must be a YAML object.");
    if (manifest && !manifest.id && !manifest.name) errors.push("profile.yaml should define id or name.");
  }
  const knownDirs = ["artifacts", "relations", "rules", "contracts", "export-profiles", "templates"];
  for (const entry of fs5.readdirSync(profileDir, { withFileTypes: true })) {
    if (entry.isDirectory() && !knownDirs.includes(entry.name)) {
      errors.push(`Unknown profile directory: ${entry.name}`);
    }
  }
  return errors;
}
function registerAuthoringCommands(program2) {
  program2.command("profiles").description("List bundled OpenLAG profile packs").addHelpText("after", `

Example:
  $ openlag profiles

Notes:
  Profile packs can be applied with openlag profile add <profile>.
`).action(() => {
    const dir = path8.join(packageRoot(), "profiles");
    if (!fs5.existsSync(dir)) {
      console.log("No bundled profiles directory found.");
      return;
    }
    const profiles = fs5.readdirSync(dir, { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort((a, b) => a.localeCompare(b));
    for (const profile2 of profiles) console.log(profile2);
  });
  const profile = program2.command("profile").description("Manage OpenLAG profile packs").addHelpText("after", `

Examples:
  $ openlag profile add governance
  $ openlag profile validate --profile governance
  $ openlag profile validate --file profiles/governance/profile.yaml
`);
  profile.command("add").description("Add a bundled profile pack to the current project").argument("<profile>", "Name of the profile (e.g. core, governance, mvc, hexagonal, testing)").addHelpText("after", `

Examples:
  $ openlag profile add core
  $ openlag profile add governance
  $ openlag profile add mvc

Notes:
  Copies YAML contracts and templates from the bundled profile into the current project.
`).action((profileName) => {
    try {
      const result = applyProfilePack(profileName);
      console.log(`Applied profile '${profileName}' from ${result.profileDir}.`);
      console.log(`Copied ${result.copied} contract/template files.`);
    } catch (error) {
      console.error(error.message);
      process.exit(1);
    }
  });
  profile.command("validate").description("Validate a bundled profile pack or a profile YAML file").option("--profile <profile>", "Bundled profile name").option("--file <path>", "Path to profile yaml").addHelpText("after", `

Examples:
  $ openlag profile validate
  $ openlag profile validate --profile governance
  $ openlag profile validate --file profiles/governance/profile.yaml

Notes:
  Defaults to --profile core when neither --profile nor --file is provided.
`).action((options) => {
    try {
      if (options.file) {
        const profilePath = path8.resolve(process.cwd(), options.file);
        const parsed = yaml5.load(fs5.readFileSync(profilePath, "utf-8"));
        if (!parsed?.id && !parsed?.name) throw new Error("Profile must contain id or name fields.");
        console.log(`Valid profile file: ${parsed.id || parsed.name}`);
        return;
      }
      const profileName = options.profile || "core";
      const profileDir = path8.join(packageRoot(), "profiles", profileName);
      if (!fs5.existsSync(profileDir)) throw new Error(`Profile pack '${profileName}' not found.`);
      const errors = validateProfilePack(profileDir);
      if (errors.length > 0) throw new Error(errors.join("\n"));
      console.log(`Valid profile pack: ${profileName}`);
    } catch (error) {
      console.error(error.message);
      process.exit(1);
    }
  });
  program2.command("profile-add").description("Deprecated alias for `openlag profile add`").argument("<profile>", "Name of the profile").addHelpText("after", `

Example:
  $ openlag profile-add governance

Notes:
  Deprecated. Prefer openlag profile add <profile>.
`).action((profileName) => {
    try {
      const result = applyProfilePack(profileName);
      console.log(`Applied profile '${profileName}' from ${result.profileDir}.`);
      console.log("Command `profile-add` is deprecated; use `profile add`.");
      console.log(`Copied ${result.copied} contract/template files.`);
    } catch (error) {
      console.error(error.message);
      process.exit(1);
    }
  });
  program2.command("scaffold").description("Scaffold mass authoring templates and samples").addHelpText("after", `

Example:
  $ openlag scaffold

Output:
  templates/artifacts/artifact-contract.template.yaml
  templates/relations/relation-contract.template.yaml
  templates/rules/rule-contract.template.yaml
  templates/markdown/artifact.template.md
`).action(() => {
    const templatesDir = path8.join(process.cwd(), "templates");
    ensureDir(path8.join(templatesDir, "artifacts"));
    ensureDir(path8.join(templatesDir, "relations"));
    ensureDir(path8.join(templatesDir, "rules"));
    ensureDir(path8.join(templatesDir, "markdown"));
    writeIfMissing(path8.join(templatesDir, "artifacts", "artifact-contract.template.yaml"), `type: CUSTOM_TYPE
extends: CODE_ENTITY
layer: IMPLEMENTATION
requiredFields:
  - id
  - type
  - title
`);
    writeIfMissing(path8.join(templatesDir, "relations", "relation-contract.template.yaml"), `relation: CUSTOM_REL
description: "Auto-generated relation"
category: SEMANTIC
allowedFrom: [PROJECT]
allowedTo: [PROJECT]
multiplicity:
  from: many
  to: many
validation:
  severity: warn
impact:
  propagates: false
  directions: [forward]
  weight: 1
`);
    writeIfMissing(path8.join(templatesDir, "rules", "rule-contract.template.yaml"), `id: custom-rule
description: "Auto-generated rule"
matchNode:
  type: [CODE_ENTITY]
conditions:
  requiredFields:
    - "ownership.owner"
severity: warning
`);
    writeIfMissing(path8.join(templatesDir, "markdown", "artifact.template.md"), `---
id: sample-id
type: REQUIREMENT
title: Sample Artifact
ownership:
  owner: team-member
  team: core
relations: []
---

# Sample
`);
    console.log("Scaffolded templates/ for mass authoring.");
  });
  program2.command("create").description("Create an artifact contract, relation contract, rule contract, or artifact").argument("<type>", "Type of entity to create (artifact-contract, relation, rule, artifact)").argument("<name>", "Name or ID of the entity").addHelpText("after", `

Examples:
  $ openlag create artifact-contract API_ROUTE
  $ openlag create relation TRACKS
  $ openlag create rule requirement-owner-required
  $ openlag create artifact REQ-AUTH-001

Output:
  artifact-contract -> docs/contracts/artifacts/<name>.yaml
  relation          -> docs/contracts/relations/<name>.yaml
  rule              -> docs/contracts/rules/<name>.yaml
  artifact          -> docs/<name>.md
`).action((type, name) => {
    const contractsDir = path8.join(process.cwd(), "docs", "contracts");
    const templatesDir = path8.join(process.cwd(), "templates");
    const templatePath = path8.join(templatesDir, type === "artifact-contract" ? "artifacts/artifact-contract.template.yaml" : type === "relation" ? "relations/relation-contract.template.yaml" : type === "rule" ? "rules/rule-contract.template.yaml" : "markdown/artifact.template.md");
    let content = "";
    if (fs5.existsSync(templatePath)) {
      content = fs5.readFileSync(templatePath, "utf-8").replace(/sample-id/g, name).replace(/Sample Artifact/g, name);
    } else if (type === "artifact-contract") {
      content = `type: ${name.toUpperCase()}
extends: CODE_ENTITY
layer: IMPLEMENTATION
requiredFields:
  - id
  - type
  - title
`;
    } else if (type === "relation") {
      content = `relation: ${name.toUpperCase()}
description: "Auto-generated relation"
category: SEMANTIC
allowedFrom: [PROJECT]
allowedTo: [PROJECT]
multiplicity:
  from: many
  to: many
validation:
  severity: warn
impact:
  propagates: false
  directions: [forward]
  weight: 1
`;
    } else if (type === "rule") {
      content = `id: ${name}
description: "Auto-generated rule"
matchNode:
  type: [CODE_ENTITY]
conditions:
  requiredFields:
    - "ownership.owner"
severity: warning
`;
    } else if (type === "artifact") {
      content = `---
id: ${name}
type: REQUIREMENT
title: ${name}
ownership:
  owner: team
  team: core
relations: []
---

# ${name}
`;
    }
    let targetPath = "";
    if (type === "artifact-contract") targetPath = path8.join(contractsDir, "artifacts", `${name}.yaml`);
    else if (type === "relation") targetPath = path8.join(contractsDir, "relations", `${name}.yaml`);
    else if (type === "rule") targetPath = path8.join(contractsDir, "rules", `${name}.yaml`);
    else if (type === "artifact") targetPath = path8.join(process.cwd(), "docs", `${name}.md`);
    else {
      console.error(`Unknown type: ${type}. Use artifact-contract, relation, rule, or artifact.`);
      process.exit(1);
    }
    ensureDir(path8.dirname(targetPath));
    if (writeIfMissing(targetPath, content)) {
      console.log(`Created ${targetPath}`);
    } else {
      console.error(`File already exists: ${targetPath}`);
    }
  });
}

// scripts/cli/init.ts
async function initProject(projectName, projectDesc, includeAllRelations, profile, starter) {
  const name = projectName || process.env.PROJECT_NAME || "My OpenLAG Project";
  const desc = projectDesc || process.env.PROJECT_DESCRIPTION || "Living Architecture documentation for my system.";
  let ROOT_DIR = process.cwd();
  if (projectName) {
    ROOT_DIR = path9.join(process.cwd(), projectName);
    if (!fs6.existsSync(ROOT_DIR)) {
      fs6.mkdirSync(ROOT_DIR, { recursive: true });
      console.log(chalk4.green(`Created project directory: ${projectName}`));
    }
  }
  console.log(chalk4.blue("Initializing OpenLAG for: ") + chalk4.bold(name));
  const metadataPath = path9.join(ROOT_DIR, "metadata.json");
  if (fs6.existsSync(metadataPath)) {
    const metadata = JSON.parse(fs6.readFileSync(metadataPath, "utf-8"));
    metadata.name = name;
    metadata.description = desc;
    if (!metadata.typeColors) metadata.typeColors = {};
    fs6.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
    console.log(chalk4.green("Updated metadata.json"));
  } else {
    const metadata = {
      name,
      description: desc,
      typeColors: {
        DAO: "text-emerald-400 border-emerald-500",
        DTO: "text-emerald-400 border-emerald-500"
      }
    };
    fs6.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
    console.log(chalk4.green("Created metadata.json"));
  }
  const htmlPath = path9.join(ROOT_DIR, "index.html");
  if (fs6.existsSync(htmlPath)) {
    let html = fs6.readFileSync(htmlPath, "utf-8");
    html = html.replace(/<title>.*?<\/title>/, `<title>${name} | OpenLAG</title>`);
    const descMetaRegex = /<meta name="description" content=".*?"\s*\/?>/;
    if (descMetaRegex.test(html)) {
      html = html.replace(descMetaRegex, `<meta name="description" content="${desc}" />`);
    } else {
      html = html.replace(/<\/title>/, `</title>
    <meta name="description" content="${desc}" />`);
    }
    fs6.writeFileSync(htmlPath, html);
    console.log(chalk4.green("Updated index.html title and description"));
  }
  const docsContractsDir = path9.join(ROOT_DIR, "docs", "contracts");
  if (!fs6.existsSync(docsContractsDir)) {
    fs6.mkdirSync(docsContractsDir, { recursive: true });
    console.log(chalk4.green("Created /docs/contracts directory"));
  }
  const packageRoot3 = path9.resolve(path9.dirname(fileURLToPath4(import.meta.url)), "../..");
  const baseProfile = starter ? "starter" : "core";
  const baseProfileDir = path9.join(packageRoot3, "profiles", baseProfile);
  if (fs6.existsSync(baseProfileDir)) {
    const profileLabel = baseProfile === "starter" ? "Starter" : "Core";
    console.log(chalk4.blue(`Applying ${profileLabel} Profile...`));
    applyProfilePack(baseProfile, ROOT_DIR);
    console.log(chalk4.green(`${profileLabel} contracts initialized`));
  } else {
    console.warn(chalk4.yellow(`${baseProfile} profile not found at ${baseProfileDir}`));
  }
  if (profile) {
    const profileDir = path9.join(packageRoot3, "profiles", profile);
    if (!fs6.existsSync(profileDir)) {
      console.warn(chalk4.yellow(`Profile pack '${profile}' not found in ${profileDir}. Skipping profile application.`));
    } else {
      console.log(chalk4.blue(`Applying extra profile pack: ${profile}...`));
      applyProfilePack(profile, ROOT_DIR);
      console.log(chalk4.green(`Successfully added profile: ${profile}`));
    }
  }
  const pkgPath = path9.join(ROOT_DIR, "package.json");
  if (fs6.existsSync(pkgPath)) {
    const pkg = JSON.parse(fs6.readFileSync(pkgPath, "utf-8"));
    let updated = false;
    if (!pkg.scripts) pkg.scripts = {};
    if (!pkg.scripts["lag:freeze"]) {
      pkg.scripts["lag:freeze"] = "npx openlag freeze";
      updated = true;
    }
    if (!pkg.scripts["lag:lint"]) {
      pkg.scripts["lag:lint"] = "npx openlag lint";
      updated = true;
    }
    if (!pkg.scripts["lag:impact"]) {
      pkg.scripts["lag:impact"] = "npx openlag impact";
      updated = true;
    }
    if (updated) {
      fs6.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
      console.log(chalk4.green("Added openlag scripts to package.json"));
    }
  }
  console.log(chalk4.green(`
OpenLAG initialized for ${name}!`));
  console.log("\nNext steps:");
  console.log("  1. Define artifacts in ./docs/contracts/artifacts");
  console.log("  2. Add relations in ./docs/contracts/relations");
  console.log("  3. Start the viewer: npm run dev");
  console.log("  4. Freeze documentation: npm run lag:freeze");
}

// scripts/cli/lint.ts
import path11 from "path";

// scripts/lint/lint-engine.ts
import fs7 from "fs";
import path10 from "path";
import yaml6 from "js-yaml";
import chalk5 from "chalk";
function loadConfig(configPath) {
  const defaultConfig = {
    defaultProfile: "develop",
    failOnWarnings: false,
    profiles: {}
  };
  if (fs7.existsSync(configPath)) {
    try {
      const fileContent = fs7.readFileSync(configPath, "utf8");
      const parsed = yaml6.load(fileContent);
      if (parsed && parsed.lint) {
        return {
          ...defaultConfig,
          ...parsed.lint
        };
      }
    } catch {
      console.warn("\u26A0\uFE0F  Could not parse openlag.config.yml, using defaults.");
    }
  }
  return defaultConfig;
}
function runLint(docsDir, configPath, profileName) {
  const config = loadConfig(configPath);
  const selectedProfileName = profileName || config.defaultProfile;
  const baseProfile = defaultProfiles[selectedProfileName] || defaultProfiles["develop"];
  const customProfileOverrides = config.profiles[selectedProfileName] || {};
  const activeProfile = { ...baseProfile, ...customProfileOverrides };
  const parsedData = parseOpenLagDocs(docsDir);
  const issues = runLintRules(parsedData, activeProfile);
  const summary = {
    errors: 0,
    warnings: 0,
    info: 0
  };
  for (const issue of issues) {
    if (issue.severity === "error") summary.errors++;
    if (issue.severity === "warning") summary.warnings++;
    if (issue.severity === "info") summary.info++;
  }
  return {
    profile: selectedProfileName,
    summary,
    issues
  };
}
function printHumanReport(report) {
  console.log(`
` + chalk5.bold(`OpenLAG Lint Report`));
  console.log(chalk5.dim(`Profile: ${report.profile}
`));
  if (report.issues.length === 0) {
    console.log(chalk5.green(`\u2705 No issues found!
`));
  } else {
    for (const issue of report.issues) {
      const sevColor = issue.severity === "error" ? chalk5.red : issue.severity === "warning" ? chalk5.yellow : chalk5.cyan;
      const severityLabel = issue.severity.toUpperCase().padEnd(7);
      const ruleLabel = issue.rule.padEnd(30);
      const context = issue.artifactId ? chalk5.magenta(`[${issue.artifactId}] `) : issue.file ? chalk5.magenta(`[${path10.basename(issue.file)}] `) : "";
      console.log(`${sevColor(severityLabel)} ${chalk5.dim(ruleLabel)} ${context}${issue.message}`);
    }
  }
  console.log(`
` + chalk5.bold(`Summary:`));
  console.log(chalk5.red(`Errors:   ${report.summary.errors}`));
  console.log(chalk5.yellow(`Warnings: ${report.summary.warnings}`));
  console.log(chalk5.cyan(`Info:     ${report.summary.info}
`));
}

// scripts/cli/lint.ts
function lintDocs(profile, jsonOutput = false, strictWarnings = false) {
  const docsDir = path11.join(process.cwd(), "docs");
  const configPath = path11.join(process.cwd(), "openlag.config.yml");
  const config = loadConfig(configPath);
  loadArtifactContracts(path11.join(docsDir, "contracts", "artifacts"));
  loadRelationContracts(path11.join(docsDir, "contracts", "relations"));
  const report = runLint(docsDir, configPath, profile);
  if (jsonOutput) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    printHumanReport(report);
  }
  const failOnWarnings = strictWarnings || config.failOnWarnings;
  let hasErrors = report.summary.errors > 0;
  if (failOnWarnings && report.summary.warnings > 0) {
    hasErrors = true;
  }
  if (hasErrors) {
    process.exit(1);
  }
}

// scripts/cli/impact.ts
import path12 from "path";
import { execSync } from "child_process";
import fs8 from "fs";
import yaml7 from "js-yaml";
var ImpactGraph = class _ImpactGraph {
  constructor(artifacts, relations) {
    this.adj = /* @__PURE__ */ new Map();
    this.artifacts = /* @__PURE__ */ new Map();
    for (const art of artifacts) {
      this.artifacts.set(art.id, art);
      this.adj.set(art.id, []);
    }
    for (const rel of relations) {
      const contract = RelationRegistry.getContract(rel.type);
      if (!contract) continue;
      const impactDef = contract.impact;
      if (!impactDef || !impactDef.propagates) continue;
      const directions = impactDef.directions || ["forward"];
      const weight = impactDef.weight || 1;
      if (directions.includes("forward") || directions.includes("both")) {
        this.addEdge(rel.from, rel.to, rel.type, "forward", weight);
      }
      if (directions.includes("reverse") || directions.includes("both")) {
        this.addEdge(rel.to, rel.from, rel.type, "reverse", weight);
      }
    }
  }
  static severityFromWeight(weight) {
    if (weight >= 0.8) return "high";
    if (weight >= 0.5) return "medium";
    return "low";
  }
  addEdge(from, to, relType, direction, weight) {
    if (!this.adj.has(from)) return;
    this.adj.get(from).push({
      from,
      to,
      relation: relType,
      direction,
      weight,
      severity: _ImpactGraph.severityFromWeight(weight)
    });
  }
  getImpactRecords(startId) {
    const visited = /* @__PURE__ */ new Set();
    const queue = [startId];
    const best = /* @__PURE__ */ new Map();
    visited.add(startId);
    while (queue.length > 0) {
      const curr = queue.shift();
      const edges = this.adj.get(curr) || [];
      for (const edge of edges) {
        if (!visited.has(edge.to)) {
          visited.add(edge.to);
          queue.push(edge.to);
        }
        const art = this.artifacts.get(edge.to);
        const current = best.get(edge.to);
        if (!current || edge.weight > current.weight) {
          best.set(edge.to, {
            id: edge.to,
            type: art?.type,
            title: art?.title,
            reason: edge.relation,
            direction: edge.direction,
            weight: edge.weight,
            severity: edge.severity,
            owner: art?.ownership?.owner || null,
            team: art?.ownership?.team || null
          });
        }
      }
    }
    best.delete(startId);
    return Array.from(best.values()).sort((a, b) => {
      if (b.weight !== a.weight) return b.weight - a.weight;
      return a.id.localeCompare(b.id);
    });
  }
};
function registerImpactCommand(program2) {
  program2.command("impact").description("Analyze impact based on Contract-Driven relations").option("--artifact <id>", "Analyze impact for a specific artifact ID").option("--file <path>", "Analyze impact for a file based on source path").option("--from <ref>", "Git base ref").option("--to <ref>", "Git target ref (default HEAD)").option("--json", "Output results in JSON format").option("--fail-on-impact", "Exit with code 2 when impacted artifacts are detected (CI mode)").addHelpText("after", `

Examples:
  $ openlag impact --artifact REQ-AUTH-001
  $ openlag impact --file docs/requirements/REQ-AUTH-001.md
  $ openlag impact --from main --to HEAD --json
  $ openlag impact --from origin/main --fail-on-impact

Notes:
  Impact traversal follows relation impact rules from docs/contracts/relations/*.yaml.
  Provide one target source: --artifact, --file, or --from.
`).action((options) => {
    const data = parseOpenLagDocs(path12.join(process.cwd(), "docs"));
    const graph = new ImpactGraph(data.artifacts, data.relations);
    const rulesDir = path12.join(process.cwd(), "docs", "contracts", "rules");
    const rules = [];
    if (fs8.existsSync(rulesDir)) {
      const files = fs8.readdirSync(rulesDir).filter((f) => f.endsWith(".yaml"));
      for (const f of files) {
        try {
          const raw = fs8.readFileSync(path12.join(rulesDir, f), "utf-8");
          const parsed = yaml7.load(raw);
          if (parsed) rules.push(parsed);
        } catch (err) {
          console.warn(`Failed to parse rule ${f}:`, err);
        }
      }
    }
    let targetIds = [];
    if (options.artifact) {
      targetIds.push(options.artifact);
    } else if (options.file) {
      const artifact = data.artifacts.find((a) => options.file.includes(a.file));
      if (artifact) targetIds.push(artifact.id);
    } else if (options.from) {
      const from = options.from;
      const to = options.to || "HEAD";
      try {
        const diffOut = execSync(`git diff --name-only ${from} ${to}`, { encoding: "utf-8" });
        const files = diffOut.split("\n").map((f) => f.trim()).filter((f) => f.length > 0 && f.endsWith(".md"));
        for (const file of files) {
          const artifact = data.artifacts.find((a) => file.includes(a.file) || a.file.includes(file));
          if (artifact && !targetIds.includes(artifact.id)) {
            targetIds.push(artifact.id);
          }
        }
      } catch (err) {
        console.error("Failed to run git diff:", err);
        process.exit(1);
      }
    }
    if (targetIds.length === 0) {
      console.error("Please specify a valid --artifact, --file, or --from to evaluate impact.");
      process.exit(1);
    }
    const impactById = /* @__PURE__ */ new Map();
    for (const tId of targetIds) {
      if (!graph.artifacts.has(tId)) {
        console.error(`Warning: Artifact ${tId} not found in the parsed docs.`);
        continue;
      }
      const impacted = graph.getImpactRecords(tId);
      for (const item of impacted) {
        const art = graph.artifacts.get(item.id);
        if (art) {
          for (const rule of rules) {
            if (rule.appliesTo && rule.appliesTo.includes(art.type)) {
              if (rule.rule?.forbiddenDependency) {
                const edges = data.relations.filter((r) => r.from === art.id);
                for (const edge of edges) {
                  const targetArt = graph.artifacts.get(edge.to);
                  if (targetArt && rule.rule.forbiddenDependency.includes(targetArt.type)) {
                    item.reason += ` [VIOLATION: ${rule.id} -> ${targetArt.type}]`;
                    if (rule.severity === "high") item.severity = "high";
                    item.weight = Math.max(item.weight, 1);
                  }
                }
              }
            }
          }
        }
        const prev = impactById.get(item.id);
        if (!prev || item.weight > prev.weight || item.reason.includes("VIOLATION")) {
          impactById.set(item.id, item);
        }
      }
    }
    const impactedArr = Array.from(impactById.values()).sort((a, b) => {
      if (b.weight !== a.weight) return b.weight - a.weight;
      return a.id.localeCompare(b.id);
    });
    if (options.json) {
      console.log(JSON.stringify({
        targets: targetIds,
        impactedArtifacts: impactedArr
      }, null, 2));
    } else {
      console.log(`# Impact Analysis for ${targetIds.join(", ")}`);
      console.log(`
Based on the contract-driven relation propagation rules, ${impactedArr.length} artifacts are potentially impacted.`);
      if (impactedArr.length > 0) {
        console.log("\n## Impacted Artifacts");
        impactedArr.forEach((item) => {
          console.log(`- **${item.id}** (${item.type}): ${item.title}`);
          console.log(`  reason=${item.reason} direction=${item.direction} weight=${item.weight.toFixed(2)} severity=${item.severity} owner=${item.owner || "-"} team=${item.team || "-"}`);
        });
      } else {
        console.log("\nNo propagated impact detected.");
      }
    }
    if (options.failOnImpact && impactedArr.length > 0) {
      process.exit(2);
    }
  });
}

// scripts/cli/freeze.ts
import chalk6 from "chalk";

// scripts/core/freeze.ts
import fs9 from "fs";
import os from "os";
import path13 from "path";
import { execFileSync as execFileSync3 } from "child_process";
import yaml8 from "js-yaml";
var REQUIRED_TEMPLATE_PLACEHOLDERS = [
  "branding.productName",
  "branding.subtitle",
  "cover.eyebrow",
  "cover.title",
  "cover.description",
  "summary.artifactCount",
  "summary.relationCount",
  "summary.sectionCount",
  "profile.id",
  "profile.name",
  "profile.description",
  "document.language",
  "document.title",
  "document.generatedAt",
  "document.formatVersion",
  "executiveSummary.title",
  "executiveSummary.purposeTitle",
  "executiveSummary.purpose",
  "executiveSummary.scopeTitle",
  "executiveSummary.scope",
  "executiveSummary.audienceTitle",
  "executiveSummary.audience",
  "footer.left",
  "footer.right"
];
var REQUIRED_TEMPLATE_ASSET_PLACEHOLDERS = ["branding.logo"];
var REQUIRED_TEMPLATE_SLOTS = [
  "openlag.tableOfContents",
  "openlag.sidebarNavigation",
  "openlag.sections",
  "openlag.artifacts",
  "openlag.relations",
  "openlag.technicalMetadata"
];
function ensureArray(value) {
  return Array.isArray(value) ? value.map(String) : [];
}
function slug(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
function escapeHtml(value) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function escapeAttribute(value) {
  return escapeHtml(value).replace(/'/g, "&#39;");
}
function normalizeFormat(value, fallback) {
  const format = (value || fallback).toLowerCase();
  if (format === "markdown" || format === "json" || format === "html" || format === "pdf") return format;
  throw new Error(`Unsupported freeze format "${value}". Supported formats are: markdown, json, html, pdf.`);
}
function loadExportProfile(projectRoot, profileId = "architecture") {
  const profilePath = path13.join(projectRoot, "docs", "contracts", "export-profiles", `${profileId}.yaml`);
  if (!fs9.existsSync(profilePath)) {
    throw new Error(`Export profile not found: ${profilePath}`);
  }
  const parsed = yaml8.load(fs9.readFileSync(profilePath, "utf-8"));
  if (!parsed || typeof parsed !== "object") {
    throw new Error(`Export profile ${profileId} is empty or invalid.`);
  }
  const id = String(parsed.id || profileId);
  const name = String(parsed.name || id);
  const sections = Array.isArray(parsed.sections) ? parsed.sections.map((section, index) => ({
    id: String(section.id || `section-${index + 1}`),
    title: String(section.title || section.id || `Section ${index + 1}`),
    artifactTypes: ensureArray(section.artifactTypes)
  })) : [];
  if (sections.length === 0) {
    throw new Error(`Export profile ${profileId} must define at least one section.`);
  }
  return {
    id,
    name,
    description: parsed.description ? String(parsed.description).trim() : void 0,
    defaultFormat: normalizeFormat(parsed.defaultFormat, "markdown"),
    includeArtifactTypes: ensureArray(parsed.includeArtifactTypes),
    excludeArtifactTypes: ensureArray(parsed.excludeArtifactTypes),
    includeRelations: ensureArray(parsed.includeRelations),
    sections,
    ordering: parsed.ordering,
    template: parsed.template,
    branding: parsed.branding,
    document: parsed.document,
    executiveSummary: parsed.executiveSummary,
    footer: parsed.footer,
    rendering: parsed.rendering
  };
}
function resolveOutputFile(projectRoot, profile, format, output) {
  const extensionByFormat = {
    markdown: ".md",
    json: ".json",
    html: ".html",
    pdf: ".pdf"
  };
  const ext = extensionByFormat[format];
  const templateId = profile.template?.id;
  const suffix = templateId && templateId !== "professional-document-v1" ? `-${slug(templateId)}` : "";
  const defaultFileName = `openlag-${profile.id}${suffix}${ext}`;
  if (!output) {
    return path13.join(projectRoot, defaultFileName);
  }
  const resolved = path13.isAbsolute(output) ? output : path13.join(projectRoot, output);
  return path13.extname(resolved) ? resolved : path13.join(resolved, defaultFileName);
}
function resolveTemplateOverride(template) {
  const pathLike = template.endsWith(".html") || template.includes("/") || template.includes("\\");
  const templatePath = pathLike ? template : `templates/freeze/${template}.html`;
  return {
    id: slug(path13.basename(template, ".html")),
    path: templatePath
  };
}
function applyTemplateOverride(profile, template) {
  if (!template) return profile;
  return {
    ...profile,
    template: resolveTemplateOverride(template)
  };
}
function displayFile(filePath) {
  return path13.relative(process.cwd(), filePath).replace(/\\/g, "/");
}
function lifecycleRank(status) {
  const ranks = {
    draft: 10,
    in_progress: 20,
    ready: 30,
    closed: 40,
    deprecated: 50
  };
  return ranks[status || ""] || 99;
}
function artifactSortKey(profile, artifact) {
  const strategy = profile.ordering?.strategy || "lifecycle";
  const fallback = profile.ordering?.fallback || "title";
  const fallbackValue = fallback === "id" ? artifact.id : artifact.title || artifact.id;
  const strategyValue = strategy === "lifecycle" ? String(lifecycleRank(artifact.status)).padStart(3, "0") : strategy === "architecture" ? artifact.layer || "" : artifact.type || "";
  return [strategyValue, artifact.type || "", fallbackValue || "", artifact.id || "", artifact.file || ""].join("\0").toLowerCase();
}
function sortArtifacts(profile, artifacts) {
  return [...artifacts].sort((a, b) => artifactSortKey(profile, a).localeCompare(artifactSortKey(profile, b)));
}
function relationSortKey(relation) {
  return [relation.type || "", relation.from || "", relation.to || "", relation.id || ""].join("\0").toLowerCase();
}
function sortRelations(relations) {
  return [...relations].sort((a, b) => relationSortKey(a).localeCompare(relationSortKey(b)));
}
function isDescendantVersion(currentVersionId, artifactVersionId, versions) {
  let current = versions.find((version) => version.id === currentVersionId);
  let depth = 0;
  while (current && current.parentVersion && current.parentVersion !== "none") {
    depth += 1;
    if (depth > 50) return false;
    if (current.parentVersion === artifactVersionId) return true;
    current = versions.find((version) => version.id === current.parentVersion);
  }
  return false;
}
function artifactVersion(artifact) {
  return String(artifact.version || artifact.raw?.version || "");
}
function filterArtifactsByVersion(artifacts, relations, versions, versionId) {
  if (!versionId) return { artifacts, relations };
  if (versions.length > 0 && !versions.some((version) => version.id === versionId)) {
    throw new Error(`Version not found for freeze: ${versionId}`);
  }
  const selectedArtifacts = artifacts.filter((artifact) => {
    if (artifact.type === "VERSION" || artifact.type === "SYSTEM_VERSION") return true;
    const version = artifactVersion(artifact);
    return version === versionId || Boolean(version && isDescendantVersion(versionId, version, versions));
  });
  const selectedIds = new Set(selectedArtifacts.map((artifact) => artifact.id));
  const selectedRelations = relations.filter((relation) => selectedIds.has(relation.from) && selectedIds.has(relation.to));
  return { artifacts: selectedArtifacts, relations: selectedRelations };
}
function selectArtifacts(profile, artifacts) {
  const included = new Set(profile.includeArtifactTypes || []);
  const excluded = new Set(profile.excludeArtifactTypes || []);
  return artifacts.filter((artifact) => {
    if (excluded.has(String(artifact.type))) return false;
    if (included.size === 0) return true;
    return included.has(String(artifact.type));
  });
}
function selectRelations(profile, relations, artifacts) {
  const artifactIds = new Set(artifacts.map((artifact) => artifact.id));
  const includedRelations = new Set(profile.includeRelations || []);
  return relations.filter((relation) => {
    if (!artifactIds.has(relation.from) || !artifactIds.has(relation.to)) return false;
    if (includedRelations.size === 0) return true;
    return includedRelations.has(String(relation.type));
  });
}
function freezeRelation(relation) {
  return {
    id: relation.id,
    type: relation.type,
    from: relation.from,
    to: relation.to,
    category: relation.category,
    strength: relation.strength
  };
}
function freezeArtifact(artifact, relations, includeSourceMetadata) {
  const outgoing = sortRelations(relations.filter((relation) => relation.from === artifact.id)).map(freezeRelation);
  const incoming = sortRelations(relations.filter((relation) => relation.to === artifact.id)).map(freezeRelation);
  const metadata = { ...artifact.raw || {} };
  delete metadata.relations;
  return {
    id: artifact.id,
    type: artifact.type,
    title: artifact.title || artifact.id,
    status: artifact.status,
    layer: artifact.layer,
    ownership: artifact.ownership,
    description: artifact.description,
    markdownBody: artifact.markdownBody,
    metadata,
    source: includeSourceMetadata ? displayFile(artifact.file) : void 0,
    relations: { outgoing, incoming }
  };
}
function createFrozenDocument(profile, artifacts, relations, generatedAt = (/* @__PURE__ */ new Date()).toISOString(), version) {
  const selectedArtifacts = sortArtifacts(profile, selectArtifacts(profile, artifacts));
  const selectedRelations = sortRelations(selectRelations(profile, relations, selectedArtifacts));
  const includeSourceMetadata = profile.rendering?.includeSourceMetadata === true;
  const usedArtifactIds = /* @__PURE__ */ new Set();
  const sections = profile.sections.map((section) => {
    const types = new Set(section.artifactTypes || []);
    const sectionArtifacts = selectedArtifacts.filter((artifact) => !usedArtifactIds.has(artifact.id)).filter((artifact) => types.size === 0 || types.has(String(artifact.type)));
    for (const artifact of sectionArtifacts) usedArtifactIds.add(artifact.id);
    return {
      id: section.id,
      title: section.title,
      artifactTypes: section.artifactTypes || [],
      artifacts: sectionArtifacts.map((artifact) => freezeArtifact(artifact, selectedRelations, includeSourceMetadata))
    };
  });
  const includedArtifactCount = sections.reduce((total, section) => total + section.artifacts.length, 0);
  return {
    id: `FREEZE-${profile.id.toUpperCase()}`,
    profile: {
      id: profile.id,
      name: profile.name,
      description: profile.description,
      ordering: profile.ordering,
      rendering: profile.rendering,
      template: profile.template,
      branding: profile.branding,
      document: profile.document,
      executiveSummary: profile.executiveSummary,
      footer: profile.footer
    },
    generatedAt,
    formatVersion: "openlag.freeze.v1",
    version,
    summary: {
      artifactCount: includedArtifactCount,
      relationCount: selectedRelations.length,
      sectionCount: sections.length
    },
    sections
  };
}
function renderRelationTables(artifact) {
  const lines = [];
  if (artifact.relations.outgoing.length > 0) {
    lines.push("| Direction | Relation | Artifact |", "| --- | --- | --- |");
    for (const relation of artifact.relations.outgoing) {
      lines.push(`| outgoing | \`${relation.type}\` | \`${relation.to}\` |`);
    }
  }
  if (artifact.relations.incoming.length > 0) {
    if (lines.length === 0) lines.push("| Direction | Relation | Artifact |", "| --- | --- | --- |");
    for (const relation of artifact.relations.incoming) {
      lines.push(`| incoming | \`${relation.type}\` | \`${relation.from}\` |`);
    }
  }
  if (lines.length > 0) lines.push("");
  return lines;
}
function renderMarkdownFreeze(document) {
  const includeToc = document.profile.rendering?.includeTableOfContents !== false;
  const includeRelationTables = document.profile.rendering?.includeRelationTables !== false;
  const lines = [
    "---",
    `id: ${document.id}`,
    "type: DOCUMENTATION_FREEZE",
    `profile: ${document.profile.id}`,
    ...document.version ? [`version: ${document.version}`] : [],
    "format: markdown",
    "status: GENERATED",
    "---",
    "",
    `# ${document.profile.name}`,
    ""
  ];
  if (document.profile.description) lines.push(document.profile.description, "");
  lines.push("> Generated by `openlag freeze` from the local OpenLAG frozen document model.", "");
  lines.push(`Artifacts: ${document.summary.artifactCount} | Relations: ${document.summary.relationCount}`, "");
  if (includeToc) {
    lines.push("## Table of Contents", "");
    for (const section of document.sections) lines.push(`- [${section.title}](#${slug(section.title)})`);
    lines.push("");
  }
  for (const section of document.sections) {
    lines.push(`## ${section.title}`, "");
    if (section.artifacts.length === 0) {
      lines.push("_No artifacts matched this section._", "");
      continue;
    }
    for (const artifact of section.artifacts) {
      lines.push(`### ${artifact.title}`, "");
      lines.push(`- ID: \`${artifact.id}\``);
      lines.push(`- Type: \`${artifact.type}\``);
      if (artifact.status) lines.push(`- Status: \`${artifact.status}\``);
      if (artifact.layer) lines.push(`- Layer: \`${artifact.layer}\``);
      if (artifact.ownership?.owner) lines.push(`- Owner: \`${artifact.ownership.owner}\``);
      if (artifact.ownership?.team) lines.push(`- Team: \`${artifact.ownership.team}\``);
      if (artifact.source) lines.push(`- Source: \`${artifact.source}\``);
      lines.push("", artifact.description || "_No description._", "");
      if (artifact.markdownBody && artifact.markdownBody !== artifact.description) {
        lines.push("#### Body", "", artifact.markdownBody, "");
      }
      if (includeRelationTables) lines.push(...renderRelationTables(artifact));
    }
  }
  return `${lines.join("\n").replace(/\n{3,}/g, "\n\n").trim()}
`;
}
function renderJsonFreeze(document) {
  return `${JSON.stringify(document, null, 2)}
`;
}
function normalizeTemplatePath(projectRoot, template) {
  const defaultTemplate = path13.join(projectRoot, "templates", "freeze", "freeze-template.html");
  const templatePath = template?.path || (template?.id ? `templates/freeze/${template.id}.html` : void 0);
  if (!templatePath) return defaultTemplate;
  return path13.isAbsolute(templatePath) ? templatePath : path13.join(projectRoot, templatePath);
}
function loadDocumentaryTemplate(projectRoot, profile) {
  const templatePath = normalizeTemplatePath(projectRoot, profile.template);
  if (fs9.existsSync(templatePath)) return fs9.readFileSync(templatePath, "utf-8");
  if (profile.template?.path) {
    throw new Error(`Freeze template not found: ${templatePath}`);
  }
  return [
    "<!doctype html>",
    '<html lang="en">',
    "<head>",
    '<meta charset="utf-8" />',
    '<meta name="viewport" content="width=device-width, initial-scale=1" />',
    "<title>OpenLAG Freeze</title>",
    "<style>body{margin:0;background:#eef3f8;color:#182230;font-family:Arial,sans-serif}.app-shell{max-width:1180px;margin:0 auto;padding:28px}.document{background:#fff;border-radius:20px;overflow:hidden}.cover{padding:48px;background:#0f172a;color:white}.content{padding:38px}.artifact-card{border:1px solid #d9e2ec;border-radius:16px;margin:18px 0;overflow:hidden}.artifact-head,.artifact-body{padding:18px}.metadata-grid,.relations{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.badge{display:inline-block;border-radius:999px;padding:4px 8px;background:#eef2f7;margin-right:6px}.footer{padding:20px 38px;background:#f8fafc}</style>",
    "</head>",
    '<body><div class="app-shell"><main class="document"><div class="content"></div></main></div></body>',
    "</html>"
  ].join("\n");
}
function resolveNodeModuleVendor(projectRoot, segments) {
  const candidates = [
    path13.join(projectRoot, "node_modules", ...segments),
    path13.join(process.cwd(), "node_modules", ...segments)
  ];
  return candidates.find((candidate) => fs9.existsSync(candidate));
}
function readClassicVendorBundle(projectRoot, label, segments) {
  const vendorPath = resolveNodeModuleVendor(projectRoot, segments);
  if (!vendorPath) {
    throw new Error(`Missing ${label} browser bundle. Run npm install before exporting offline freeze HTML/PDF.`);
  }
  const bundle = fs9.readFileSync(vendorPath, "utf-8").trim();
  if (/^\s*(import|export)\s/m.test(bundle)) {
    throw new Error(`${label} bundle must be a classic browser script, not ESM: ${vendorPath}`);
  }
  return [
    `/* OpenLAG inline vendor: ${label}`,
    ` * Source: ${path13.relative(projectRoot, vendorPath).replace(/\\/g, "/")}`,
    " * Injected in memory during freeze export.",
    " */",
    bundle.replace(/<\/script/gi, "<\\/script")
  ].join("\n");
}
function inlineOfflineTemplateVendors(template, projectRoot) {
  if (!template.includes("__OPENLAG_INLINE_MARKED_BUNDLE__") && !template.includes("__OPENLAG_INLINE_MERMAID_BUNDLE__")) {
    return template;
  }
  return template.replace(
    "/* __OPENLAG_INLINE_MARKED_BUNDLE__ */",
    () => readClassicVendorBundle(projectRoot, "marked", ["marked", "lib", "marked.umd.js"])
  ).replace(
    "/* __OPENLAG_INLINE_MERMAID_BUNDLE__ */",
    () => readClassicVendorBundle(projectRoot, "mermaid", ["mermaid", "dist", "mermaid.min.js"])
  );
}
function resolveLogoDataUri(projectRoot, logoPath) {
  const logo = logoPath || "OpenLAG-logo-t.png";
  const resolved = path13.isAbsolute(logo) ? logo : path13.join(projectRoot, logo);
  if (!fs9.existsSync(resolved)) return void 0;
  const ext = path13.extname(resolved).toLowerCase();
  const mime = ext === ".svg" ? "image/svg+xml" : ext === ".jpg" || ext === ".jpeg" ? "image/jpeg" : "image/png";
  return `data:${mime};base64,${fs9.readFileSync(resolved).toString("base64")}`;
}
function markdownToHtml(markdown) {
  if (!markdown?.trim()) return "<p><em>No body content.</em></p>";
  const lines = markdown.trim().split(/\r?\n/);
  const html = [];
  let inList = false;
  let inCode = false;
  const codeLines = [];
  const closeList = () => {
    if (inList) {
      html.push("</ul>");
      inList = false;
    }
  };
  for (const line of lines) {
    if (line.trim().startsWith("```")) {
      if (inCode) {
        html.push(`<pre><code>${escapeHtml(codeLines.join("\n"))}</code></pre>`);
        codeLines.length = 0;
        inCode = false;
      } else {
        closeList();
        inCode = true;
      }
      continue;
    }
    if (inCode) {
      codeLines.push(line);
      continue;
    }
    const trimmed = line.trim();
    if (!trimmed) {
      closeList();
      continue;
    }
    if (trimmed.startsWith("### ")) {
      closeList();
      html.push(`<h3>${escapeHtml(trimmed.slice(4))}</h3>`);
      continue;
    }
    if (trimmed.startsWith("## ")) {
      closeList();
      html.push(`<h2>${escapeHtml(trimmed.slice(3))}</h2>`);
      continue;
    }
    if (trimmed.startsWith("# ")) {
      closeList();
      html.push(`<h1>${escapeHtml(trimmed.slice(2))}</h1>`);
      continue;
    }
    if (trimmed.startsWith("- ")) {
      if (!inList) {
        html.push("<ul>");
        inList = true;
      }
      html.push(`<li>${escapeHtml(trimmed.slice(2))}</li>`);
      continue;
    }
    closeList();
    html.push(`<p>${escapeHtml(trimmed)}</p>`);
  }
  closeList();
  if (inCode) html.push(`<pre><code>${escapeHtml(codeLines.join("\n"))}</code></pre>`);
  return html.join("\n");
}
function relationTargetLabel(relation, direction) {
  return direction === "outgoing" ? relation.to : relation.from;
}
function relationArrow(direction) {
  return direction === "outgoing" ? "\u2192" : "\u2190";
}
function renderRelationList(relations, direction, anchors) {
  if (relations.length === 0) return "<li><span>No relations</span></li>";
  return relations.map((relation) => {
    const target = relationTargetLabel(relation, direction);
    const targetHtml = anchors.has(target) ? `<a href="#artifact-${escapeAttribute(slug(target))}">${escapeHtml(target)}</a>` : escapeHtml(target);
    return `<li><span><strong>${escapeHtml(relation.type)}</strong> ${relationArrow(direction)} ${targetHtml}</span></li>`;
  }).join("\n");
}
function renderArtifactCard(artifact, anchors, document) {
  const includeTechnicalMetadata = document.profile.rendering?.includeTechnicalMetadata === true;
  const includeRelations = document.profile.rendering?.includeRelationTables !== false;
  const owner = artifact.ownership?.owner || "Unassigned";
  const team = artifact.ownership?.team || "Unassigned";
  const statusClass = artifact.status ? slug(artifact.status) : "";
  return [
    `<article class="artifact-card" id="artifact-${escapeAttribute(slug(artifact.id))}">`,
    '<div class="artifact-head">',
    '<h3 class="artifact-title">',
    `<span>${escapeHtml(artifact.title)}</span>`,
    `<span class="artifact-id">${escapeHtml(artifact.id)}</span>`,
    "</h3>",
    '<div class="badges">',
    `<span class="badge type">${escapeHtml(artifact.type)}</span>`,
    artifact.status ? `<span class="badge status ${escapeAttribute(statusClass)}">${escapeHtml(artifact.status)}</span>` : "",
    artifact.layer ? `<span class="badge layer">${escapeHtml(artifact.layer)}</span>` : "",
    "</div>",
    "</div>",
    '<div class="artifact-body">',
    '<div class="metadata-grid">',
    `<div class="metadata-item"><span>Owner</span><strong>${escapeHtml(owner)}</strong></div>`,
    `<div class="metadata-item"><span>Team</span><strong>${escapeHtml(team)}</strong></div>`,
    artifact.source ? `<div class="metadata-item"><span>Source</span><strong>${escapeHtml(artifact.source)}</strong></div>` : "",
    "</div>",
    artifact.description ? `<p>${escapeHtml(artifact.description)}</p>` : "",
    `<div class="markdown" data-openlag-markdown-body>${escapeHtml(artifact.markdownBody?.trim() || "No body content.")}</div>`,
    `<noscript><div class="markdown">${markdownToHtml(artifact.markdownBody)}</div></noscript>`,
    includeRelations ? [
      '<div class="relations">',
      '<div class="relation-box">',
      "<h4>Outgoing relations</h4>",
      `<ul class="relation-list">${renderRelationList(artifact.relations.outgoing, "outgoing", anchors)}</ul>`,
      "</div>",
      '<div class="relation-box">',
      "<h4>Incoming relations</h4>",
      `<ul class="relation-list">${renderRelationList(artifact.relations.incoming, "incoming", anchors)}</ul>`,
      "</div>",
      "</div>"
    ].join("\n") : "",
    includeTechnicalMetadata ? [
      "<details>",
      "<summary>Technical metadata</summary>",
      `<pre class="json-block">${escapeHtml(JSON.stringify(artifact.metadata, null, 2))}</pre>`,
      "</details>"
    ].join("\n") : "",
    "</div>",
    "</article>"
  ].filter(Boolean).join("\n");
}
function renderSection(section, index, anchors, document) {
  const artifacts = section.artifacts.length > 0 ? section.artifacts.map((artifact) => renderArtifactCard(artifact, anchors, document)).join("\n") : '<div class="panel"><p>No artifacts matched this section.</p></div>';
  return [
    `<section id="section-${escapeAttribute(slug(section.id))}" class="section">`,
    '<div class="section-header">',
    "<div>",
    `<p class="section-kicker">${String(index + 3).padStart(2, "0")} \xB7 Section</p>`,
    `<h2>${escapeHtml(section.title)}</h2>`,
    "</div>",
    `<span class="section-count">${section.artifacts.length} artifacts</span>`,
    "</div>",
    artifacts,
    "</section>"
  ].join("\n");
}
function validateFreezeTemplateSource(template) {
  const issues = [];
  for (const placeholder of REQUIRED_TEMPLATE_PLACEHOLDERS) {
    if (!template.includes(`data-template="${placeholder}"`)) issues.push(`Missing placeholder: ${placeholder}`);
  }
  for (const placeholder of REQUIRED_TEMPLATE_ASSET_PLACEHOLDERS) {
    if (!template.includes(`data-template-src="${placeholder}"`)) issues.push(`Missing asset placeholder: ${placeholder}`);
  }
  for (const slot of REQUIRED_TEMPLATE_SLOTS) {
    if (!template.includes(`data-slot="${slot}"`)) issues.push(`Missing slot: ${slot}`);
  }
  if (!/<!doctype html>/i.test(template) || !/<html\b/i.test(template) || !/<head\b/i.test(template) || !/<body\b/i.test(template)) {
    issues.push("Template must contain doctype, html, head, and body structure.");
  }
  if (!/<meta[^>]+charset=["']?utf-8/i.test(template)) issues.push("Template must declare UTF-8 charset.");
  if (/https?:\/\//i.test(template) || /\b(cdn|unpkg|jsdelivr)\b/i.test(template)) issues.push("Template must not contain internet/CDN dependencies.");
  if (/OpenLAG inline vendor|marked v\d|__esbuild_esm_mermaid|mermaid\.version/i.test(template)) issues.push("Source template must not contain embedded vendor bundles.");
  if (!/@media\s+print/i.test(template)) issues.push("Template must define print CSS.");
  if (!/break-inside\s*:\s*avoid/i.test(template)) issues.push("Template must avoid card breaks in print.");
  if (!/page-break-inside\s*:\s*avoid/i.test(template)) issues.push("Template must avoid legacy page breaks in print.");
  if (/fake artifact|demo artifact|template title|template purpose/i.test(template)) issues.push("Template must not contain fake demo artifacts.");
  return { valid: issues.length === 0, issues };
}
function getContextValue(context, pathExpression) {
  const value = pathExpression.split(".").reduce((current, key) => current && typeof current === "object" ? current[key] : void 0, context);
  return value === void 0 || value === null ? "" : String(value);
}
function buildFreezeTemplateContext(document, projectRoot) {
  const branding = document.profile.branding || {};
  const doc = document.profile.document || {};
  const executiveSummary = document.profile.executiveSummary || {};
  const footer = document.profile.footer || {};
  return {
    branding: {
      logo: resolveLogoDataUri(projectRoot, branding.logo),
      productName: branding.productName || "OpenLAG",
      subtitle: branding.subtitle || "Documentation Freeze"
    },
    document: {
      language: doc.language || "en",
      title: doc.title || document.profile.name,
      generatedAt: document.generatedAt,
      formatVersion: document.formatVersion
    },
    cover: {
      eyebrow: doc.eyebrow || "Generated Architecture Snapshot",
      title: doc.title || document.profile.name,
      description: doc.description || document.profile.description || "Deterministic architecture documentation generated from the current OpenLAG graph."
    },
    profile: {
      id: document.profile.id,
      name: document.profile.name,
      description: document.profile.description || ""
    },
    summary: document.summary,
    executiveSummary: {
      title: executiveSummary.title || "Executive Summary",
      purposeTitle: executiveSummary.purposeTitle || "Document purpose",
      purpose: executiveSummary.purpose || document.profile.description || "This document provides a stable, reviewable snapshot of the architecture knowledge captured by OpenLAG.",
      scopeTitle: executiveSummary.scopeTitle || "Scope",
      scope: executiveSummary.scope || "The content is selected by the active export profile.",
      audienceTitle: executiveSummary.audienceTitle || "Intended audience",
      audience: executiveSummary.audience || "Architecture, governance and engineering teams."
    },
    rendering: document.profile.rendering || {},
    sections: document.sections,
    footer: {
      left: footer.left || "Generated by OpenLAG freeze",
      right: footer.right || `Document template ${document.profile.template?.id || "professional-document-v1"}`
    }
  };
}
function renderSidebarNavigation(context) {
  return [
    '<p class="nav-title">Document</p>',
    context.rendering.includeCover === false ? "" : '<a class="nav-link" href="#cover">Cover</a>',
    context.rendering.includeExecutiveSummary === false ? "" : '<a class="nav-link" href="#executive-summary">Executive Summary</a>',
    context.rendering.includeTableOfContents === false ? "" : '<a class="nav-link" href="#toc">Table of Contents</a>',
    '<p class="nav-title">Sections</p>',
    ...context.sections.map((section) => `<a class="nav-link" href="#section-${escapeAttribute(slug(section.id))}">${escapeHtml(section.title)}</a>`)
  ].filter(Boolean).join("\n");
}
function renderTableOfContents(context) {
  if (context.rendering.includeTableOfContents === false) return "";
  return [
    '<ul class="toc">',
    ...context.sections.map((section, index) => `<li><a href="#section-${escapeAttribute(slug(section.id))}"><span class="toc-number">${String(index + 1).padStart(2, "0")}</span> ${escapeHtml(section.title)}</a></li>`),
    "</ul>"
  ].join("\n");
}
function renderRelations(context) {
  if (context.rendering.includeRelationTables === false) return "";
  const relations = context.sections.flatMap((section) => section.artifacts.flatMap((artifact) => artifact.relations.outgoing));
  if (relations.length === 0) return '<p class="empty-state">No relations matched this export profile.</p>';
  return [
    '<table class="relation-matrix">',
    "<thead><tr><th>From</th><th>Relation</th><th>To</th></tr></thead>",
    "<tbody>",
    ...relations.map((relation) => `<tr><td>${escapeHtml(relation.from)}</td><td>${escapeHtml(relation.type)}</td><td>${escapeHtml(relation.to)}</td></tr>`),
    "</tbody>",
    "</table>"
  ].join("\n");
}
function renderTechnicalMetadata(context) {
  if (context.rendering.includeTechnicalMetadata !== true) return "";
  return `<pre class="json-block">${escapeHtml(JSON.stringify({
    profile: context.profile,
    summary: context.summary,
    generatedAt: context.document.generatedAt,
    formatVersion: context.document.formatVersion
  }, null, 2))}</pre>`;
}
function documentFromContext(context) {
  return {
    id: "TEMPLATE-CONTEXT",
    generatedAt: context.document.generatedAt,
    formatVersion: "openlag.freeze.v1",
    profile: {
      id: context.profile.id,
      name: context.profile.name,
      description: context.profile.description,
      rendering: context.rendering
    },
    summary: context.summary,
    sections: context.sections
  };
}
function renderArtifactCards(context) {
  const anchors = new Set(context.sections.flatMap((section) => section.artifacts.map((artifact) => artifact.id)));
  const doc = documentFromContext(context);
  return context.sections.flatMap((section) => section.artifacts).map((artifact) => renderArtifactCard(artifact, anchors, doc)).join("\n");
}
function renderSections(context) {
  const anchors = new Set(context.sections.flatMap((section) => section.artifacts.map((artifact) => artifact.id)));
  const doc = documentFromContext(context);
  return context.sections.map((section, index) => renderSection(section, index, anchors, doc)).join("\n");
}
function renderExecutiveSummary(context) {
  if (context.rendering.includeExecutiveSummary === false) return "";
  return [
    '<div class="summary-grid">',
    '<div class="panel">',
    `<h3>${escapeHtml(context.executiveSummary.purposeTitle)}</h3>`,
    `<p>${escapeHtml(context.executiveSummary.purpose)}</p>`,
    `<h3>${escapeHtml(context.executiveSummary.scopeTitle)}</h3>`,
    `<p>${escapeHtml(context.executiveSummary.scope)}</p>`,
    "</div>",
    '<div class="panel">',
    `<h3>${escapeHtml(context.executiveSummary.audienceTitle)}</h3>`,
    `<p>${escapeHtml(context.executiveSummary.audience)}</p>`,
    "</div>",
    "</div>"
  ].join("\n");
}
function replaceElementContent(html, attribute, values) {
  let rendered = html;
  for (const [name, value] of Object.entries(values)) {
    const pattern = new RegExp(`(<([a-zA-Z][\\w:-]*)\\b[^>]*\\s${attribute}="${name}"[^>]*>)([\\s\\S]*?)(<\\/\\2>)`, "g");
    rendered = rendered.replace(pattern, (_match, openTag, _tag, _content, closeTag) => `${openTag.replace(new RegExp(`\\s${attribute}="${name}"`), "")}${value}${closeTag}`);
  }
  return rendered;
}
function replaceAssetPlaceholders(html, context) {
  return html.replace(/<([a-zA-Z][\w:-]*)\b([^>]*?)\sdata-template-src="([^"]+)"([^>]*)>/g, (_match, tag, before, pathExpression, after) => {
    const value = getContextValue(context, pathExpression);
    const attributes = `${before}${after}`.replace(/\ssrc="[^"]*"/, "");
    return `<${tag}${attributes} src="${escapeAttribute(value)}">`;
  });
}
function applyTemplateContext(template, context) {
  const placeholders = Object.fromEntries(REQUIRED_TEMPLATE_PLACEHOLDERS.map((name) => [name, escapeHtml(getContextValue(context, name))]));
  const slots = {
    "openlag.tableOfContents": renderTableOfContents(context),
    "openlag.sidebarNavigation": renderSidebarNavigation(context),
    "openlag.sections": renderSections(context),
    "openlag.artifacts": renderArtifactCards(context),
    "openlag.relations": renderRelations(context),
    "openlag.technicalMetadata": renderTechnicalMetadata(context)
  };
  let html = template.replace(/<html\b([^>]*)>/i, (_match, attributes) => `<html${attributes.replace(/\slang="[^"]*"/i, "")} lang="${escapeAttribute(context.document.language)}">`);
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(context.document.title)}</title>`);
  html = replaceAssetPlaceholders(html, context);
  html = replaceElementContent(html, "data-template", placeholders);
  html = replaceElementContent(html, "data-slot", slots);
  html = replaceElementContent(html, "data-openlag-executive-summary", { summary: renderExecutiveSummary(context) });
  if (context.rendering.includeCover === false) html = html.replace(/<header\b[^>]*id="cover"[\s\S]*?<\/header>/i, "");
  if (context.rendering.includeExecutiveSummary === false) html = html.replace(/<section\b[^>]*id="executive-summary"[\s\S]*?<\/section>/i, "");
  if (context.rendering.includeFooter === false) html = html.replace(/<footer\b[\s\S]*?<\/footer>/i, "");
  return html;
}
function renderTemplateDocumentaryHtml(document, projectRoot) {
  const sourceTemplate = loadDocumentaryTemplate(projectRoot, document.profile);
  const validation = validateFreezeTemplateSource(sourceTemplate);
  if (!validation.valid) {
    throw new Error(`Invalid freeze template ${document.profile.template?.path || document.profile.template?.id || "freeze-template"}:
- ${validation.issues.join("\n- ")}`);
  }
  const context = buildFreezeTemplateContext(document, projectRoot);
  return `${inlineOfflineTemplateVendors(applyTemplateContext(sourceTemplate, context), projectRoot)}
`;
}
function renderHtmlFreeze(document, projectRoot = process.cwd()) {
  return renderTemplateDocumentaryHtml(document, projectRoot);
}
function pdfEscape(value) {
  return value.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}
function renderPlainPdfFreeze(document) {
  const textLines = renderMarkdownFreeze(document).split("\n").filter((line) => !line.startsWith("---")).map((line) => line.replace(/`/g, ""));
  const pages = [];
  const linesPerPage = 46;
  for (let index = 0; index < textLines.length; index += linesPerPage) {
    const chunk = textLines.slice(index, index + linesPerPage);
    const commands = ["BT", "/F1 10 Tf", "50 790 Td"];
    chunk.forEach((line, lineIndex) => {
      if (lineIndex > 0) commands.push("0 -16 Td");
      commands.push(`(${pdfEscape(line.slice(0, 110))}) Tj`);
    });
    commands.push("ET");
    pages.push(commands.join("\n"));
  }
  const objects = [];
  objects.push("<< /Type /Catalog /Pages 2 0 R >>");
  const pageObjectNumbers = pages.map((_, index) => 4 + index * 2);
  objects.push(`<< /Type /Pages /Kids [${pageObjectNumbers.map((num) => `${num} 0 R`).join(" ")}] /Count ${pages.length} >>`);
  objects.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
  pages.forEach((content, index) => {
    const pageNum = pageObjectNumbers[index];
    const contentNum = pageNum + 1;
    objects.push(`<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 3 0 R >> >> /MediaBox [0 0 595 842] /Contents ${contentNum} 0 R >>`);
    objects.push(`<< /Length ${Buffer.byteLength(content, "utf-8")} >>
stream
${content}
endstream`);
  });
  const chunks = ["%PDF-1.4\n"];
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets.push(Buffer.byteLength(chunks.join(""), "utf-8"));
    chunks.push(`${index + 1} 0 obj
${object}
endobj
`);
  });
  const xrefOffset = Buffer.byteLength(chunks.join(""), "utf-8");
  chunks.push(`xref
0 ${objects.length + 1}
0000000000 65535 f 
`);
  for (let i = 1; i < offsets.length; i += 1) {
    chunks.push(`${String(offsets[i]).padStart(10, "0")} 00000 n 
`);
  }
  chunks.push(`trailer
<< /Size ${objects.length + 1} /Root 1 0 R >>
startxref
${xrefOffset}
%%EOF
`);
  return Buffer.from(chunks.join(""), "utf-8");
}
function renderPdfFreeze(document, projectRoot = process.cwd()) {
  const html = renderTemplateDocumentaryHtml(document, projectRoot);
  const tempDir = fs9.mkdtempSync(path13.join(os.tmpdir(), "openlag-freeze-pdf-"));
  const htmlPath = path13.join(tempDir, "freeze.html");
  const pdfPath = path13.join(tempDir, "freeze.pdf");
  fs9.writeFileSync(htmlPath, html, "utf-8");
  try {
    execFileSync3(process.execPath, [
      "--import",
      "tsx",
      path13.join(projectRoot, "scripts", "core", "render-pdf.ts"),
      htmlPath,
      pdfPath
    ], {
      cwd: projectRoot,
      stdio: "pipe"
    });
    return fs9.readFileSync(pdfPath);
  } catch {
    return renderPlainPdfFreeze(document);
  } finally {
    fs9.rmSync(tempDir, { recursive: true, force: true });
  }
}
function renderFreeze(document, format, projectRoot) {
  if (format === "json") return renderJsonFreeze(document);
  if (format === "html") return renderHtmlFreeze(document, projectRoot);
  if (format === "pdf") return renderPdfFreeze(document, projectRoot);
  return renderMarkdownFreeze(document);
}
function createDocumentationFreeze(options) {
  const projectRoot = path13.resolve(options.projectRoot);
  const profile = applyTemplateOverride(loadExportProfile(projectRoot, options.profile || "architecture"), options.template);
  const format = normalizeFormat(options.format, profile.defaultFormat || "markdown");
  const docsDir = path13.join(projectRoot, "docs");
  loadArtifactContracts(path13.join(docsDir, "contracts", "artifacts"));
  loadRelationContracts(path13.join(docsDir, "contracts", "relations"));
  const parsed = parseOpenLagDocs(docsDir);
  const versionedData = filterArtifactsByVersion(parsed.artifacts, parsed.relations, parsed.versions, options.version);
  const document = createFrozenDocument(profile, versionedData.artifacts, versionedData.relations, options.generatedAt, options.version);
  const content = renderFreeze(document, format, projectRoot);
  const markdown = renderMarkdownFreeze(document);
  const outputFile = resolveOutputFile(projectRoot, profile, format, options.output);
  if (!options.dryRun) {
    fs9.mkdirSync(path13.dirname(outputFile), { recursive: true });
    fs9.writeFileSync(outputFile, content);
  }
  return {
    profile,
    outputFile,
    content,
    markdown,
    document,
    artifactCount: document.summary.artifactCount,
    relationCount: document.summary.relationCount,
    dryRun: Boolean(options.dryRun),
    format
  };
}

// scripts/cli/freeze.ts
function registerFreezeCommand(program2) {
  program2.command("freeze").description("Generate a deterministic documentation freeze from the OpenLAG graph").option("-p, --profile <profile>", "Export profile from docs/contracts/export-profiles", "architecture").option("--format <format>", "Output format (markdown, json, html, pdf)", "markdown").option("--template <template>", "Freeze HTML/PDF template id or path override").option("--version <versionId>", "Limit the freeze to artifacts in a specific VERSION snapshot").option("-o, --output <path>", "Output directory or target file").option("--dry-run", "Preview what would be exported without writing files").addHelpText("after", `

Examples:
  $ openlag freeze --profile architecture --format markdown
  $ openlag freeze --profile architecture --version VER-050
  $ openlag freeze --profile architecture --format html --template audit-dossier
  $ openlag freeze --profile architecture --format pdf --output exports/audit.pdf
  $ openlag freeze --profile architecture --dry-run

Notes:
  Export profiles live in docs/contracts/export-profiles/*.yaml.
  --version filters artifacts by their frontmatter version and keeps VERSION/SYSTEM_VERSION context.
  Without --output, the file is written in the current command directory.
  If --output has an extension it is used as the target file.
  If --output has no extension it is used as the output directory.
`).action((options) => {
    try {
      const result = createDocumentationFreeze({
        projectRoot: process.cwd(),
        profile: options.profile,
        format: options.format,
        template: options.template,
        version: options.version,
        output: options.output,
        dryRun: options.dryRun
      });
      console.log(chalk6.blue(`Profile: ${result.profile.id}`));
      console.log(chalk6.blue(`Artifacts: ${result.artifactCount}`));
      console.log(chalk6.blue(`Relations: ${result.relationCount}`));
      console.log(chalk6.blue(`Format: ${result.format}`));
      if (result.document.version) {
        console.log(chalk6.blue(`Version: ${result.document.version}`));
      }
      console.log(chalk6.blue(`Output: ${result.outputFile}`));
      if (result.dryRun) {
        console.log(chalk6.yellow("Dry run only. No files were written."));
      } else {
        console.log(chalk6.green("Documentation freeze generated."));
      }
    } catch (error) {
      console.error(chalk6.red(error.message));
      process.exit(1);
    }
  });
}

// scripts/cli/openlag.ts
var program = new Command();
var packageRoot2 = path14.resolve(path14.dirname(fileURLToPath5(import.meta.url)), "../..");
var packageJson = JSON.parse(fs10.readFileSync(path14.join(packageRoot2, "package.json"), "utf-8"));
if (process.argv.length === 3 && (process.argv[2] === "--version" || process.argv[2] === "-V")) {
  console.log(packageJson.version);
  process.exit(0);
}
function runVitePreview() {
  const viteBin = resolveViteBin(import.meta.url);
  execFileSync4(process.execPath, [viteBin, "preview", "--outDir", path14.join(process.cwd(), "dist")], {
    cwd: packageRoot2,
    env: {
      ...process.env,
      OPENLAG_PROJECT_ROOT: process.cwd()
    },
    stdio: "inherit"
  });
}
program.name("openlag").description("Architecture as Code traceability graph generator").addHelpText("after", `

Common workflows:
  $ openlag --version
  $ openlag init --name "My System"
  $ openlag generate
  $ openlag lint --profile develop
  $ openlag check --profile release --strict
  $ openlag freeze --profile architecture --format html
  $ openlag freeze --profile architecture --version VER-050
`);
program.command("init").description("Initialize a new OpenLAG project").option("-n, --name <name>", "Project name").option("-d, --desc <description>", "Project description").option("--starter", "Initialize with OpenLAG Lite starter contracts (4 artifact types, 4 relations, 1 export profile)").option("--all", "Include optional synthetic relations").option("-p, --profile <profile>", "Apply a profile pack (e.g. mvc, hexagonal)").addHelpText("after", `

Examples:
  $ openlag init --name "My System"
  $ openlag init --name "My System" --desc "Architecture knowledge base"
  $ openlag init --starter
  $ openlag init --profile governance
  $ openlag init --all

Notes:
  Existing contract files are preserved.
  --starter applies the lightweight starter profile for new teams.
  --profile copies bundled contracts/templates into docs/contracts/.
`).action((options) => {
  initProject(options.name, options.desc, options.all, options.profile, options.starter);
});
program.command("generate").description("Generate static graph data from markdown docs").option("-w, --watch", "Watch mode").addHelpText("after", `

Examples:
  $ openlag generate
  $ openlag generate --watch

Output:
  public/graph-data.json
  public/artifact-definitions.json
  public/relation-definitions.json
`).action((options) => {
  const docsDir = path14.join(process.cwd(), "docs");
  const outputDir = path14.join(process.cwd(), "public");
  if (options.watch) {
    watchData(docsDir, outputDir);
  } else {
    generateData(docsDir, outputDir);
  }
});
program.command("dev").description("Start development server with live data refresh").addHelpText("after", `

Example:
  $ openlag dev

Notes:
  Regenerates graph data and starts the Vite development portal.
`).action(() => {
  runDevServer();
});
program.command("build").description("Build the OpenLAG portal for production").addHelpText("after", `

Example:
  $ openlag build

Output:
  dist/
`).action(() => {
  buildPortal();
});
program.command("lint").description("Validate architecture documentation").option("-p, --profile <profile>", "Lint profile (draft, develop, feature, release)", "develop").option("--json", "Output report in JSON format").option("--strict", "Fail on warnings").addHelpText("after", `

Examples:
  $ openlag lint
  $ openlag lint --profile feature
  $ openlag lint --profile release --strict
  $ openlag lint --json
`).action((options) => {
  lintDocs(options.profile, options.json, options.strict);
});
program.command("preview").description("Preview the production build").addHelpText("after", `

Example:
  $ openlag preview

Notes:
  Serves the production build from dist/.
`).action(() => {
  runVitePreview();
});
program.command("check").description("Generate graph data and validate architecture documentation").option("-p, --profile <profile>", "Lint profile (draft, develop, feature, release)", "develop").option("--strict", "Fail on warnings").addHelpText("after", `

Examples:
  $ openlag check
  $ openlag check --profile release --strict

Notes:
  Runs generate first, then lint with the selected profile.
`).action((options) => {
  console.log(chalk7.blue("Running OpenLAG checks..."));
  const docsDir = path14.join(process.cwd(), "docs");
  const outputDir = path14.join(process.cwd(), "public");
  try {
    generateData(docsDir, outputDir);
    lintDocs(options.profile, false, options.strict);
    console.log(chalk7.green("\nOpenLAG checks passed."));
  } catch {
    console.error(chalk7.red("\nOpenLAG checks failed."));
    process.exit(1);
  }
});
registerImpactCommand(program);
registerFreezeCommand(program);
registerAuthoringCommands(program);
program.parse();
