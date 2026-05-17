
// GENERATED FILE - DO NOT EDIT MANUALLY
import { RelationCategory, RelationStrength } from '../../types.js';
import { ArtifactType } from '../registry/ArtifactRegistry.js';

export interface RelationContract {
  type: string;
  description?: string;
  category: RelationCategory;
  strength: RelationStrength;
  allowedFrom: ArtifactType[];
  allowedTo: ArtifactType[];
  multiplicity: { from: string; to: string };
  validation: { severity: string };
}

export const GENERATED_RELATIONS: RelationContract[] = [
  {
    "type": "BLOCKS",
    "description": "Descripción de impedimentos directos.",
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
    "strength": "STRONG"
  },
  {
    "type": "BREAKS",
    "description": "Averías o rupturas confirmadas.",
    "category": "OPERATIONAL",
    "allowedFrom": [
      "CHANGE",
      "CODE_ENTITY",
      "COMPONENT",
      "SYSTEM_VERSION"
    ],
    "allowedTo": [
      "TEST_CASE",
      "TEST",
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
    "strength": "STRONG"
  },
  {
    "type": "CALLS",
    "description": "Trazabilidad de invocación a nivel código.",
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
    "strength": "MEDIUM"
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
    "strength": "WEAK"
  },
  {
    "type": "DEPENDS_ON",
    "description": "Acoplamiento estático arquitectónico o de empaquetado.",
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
    "strength": "MEDIUM"
  },
  {
    "type": "DEPLOYS",
    "description": "Instanciación de componentes o release en infraestructura.",
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
    "strength": "STRONG"
  },
  {
    "type": "DERIVES_FROM",
    "description": "Evolución conceptual genérica.",
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
    "strength": "WEAK"
  },
  {
    "type": "DOCUMENTS",
    "description": "Conecta documentación con el artefacto descrito.",
    "category": "SEMANTIC",
    "allowedFrom": [
      "DOCUMENTATION",
      "GLOSSARY_TERM"
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
      "TEST",
      "DOCUMENTATION",
      "INCIDENT",
      "INFRASTRUCTURE",
      "DEPLOYMENT",
      "MONITORING",
      "MAINTENANCE",
      "SYSTEM_VERSION",
      "VERSION"
    ],
    "multiplicity": {
      "from": "many",
      "to": "many"
    },
    "validation": {
      "severity": "info"
    },
    "strength": "WEAK"
  },
  {
    "type": "FIXES",
    "description": "Conecta correcciones con bugs o incidentes.",
    "category": "TRACEABILITY",
    "allowedFrom": [
      "CHANGE",
      "CODE_ENTITY",
      "COMPONENT",
      "SYSTEM_VERSION"
    ],
    "allowedTo": [
      "BUG",
      "INCIDENT",
      "RISK"
    ],
    "multiplicity": {
      "from": "many",
      "to": "many"
    },
    "validation": {
      "severity": "error"
    },
    "strength": "STRONG"
  },
  {
    "type": "IMPACTS",
    "description": "Descripción de posibles efectos colaterales.",
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
    "strength": "MEDIUM"
  },
  {
    "type": "IMPLEMENTS",
    "description": "Conecta implementación con necesidad funcional/técnica.",
    "category": "TRACEABILITY",
    "allowedFrom": [
      "CODE_ENTITY",
      "COMPONENT",
      "API",
      "DATABASE_ENTITY",
      "SYSTEM_VERSION"
    ],
    "allowedTo": [
      "REQUIREMENT",
      "FEATURE",
      "EPIC",
      "DESIGN",
      "USE_CASE",
      "BUSINESS_RULE"
    ],
    "multiplicity": {
      "from": "many",
      "to": "many"
    },
    "validation": {
      "severity": "error"
    },
    "strength": "STRONG"
  },
  {
    "type": "IMPORTS",
    "description": "Trazabilidad de importación estática a nivel de código.",
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
    "strength": "MEDIUM"
  },
  {
    "type": "JUSTIFIES",
    "description": "Conecta decisiones con aquello que justifican.",
    "category": "SEMANTIC",
    "allowedFrom": [
      "DECISION",
      "BUSINESS_RULE",
      "DOCUMENTATION",
      "RISK"
    ],
    "allowedTo": [
      "DESIGN",
      "REQUIREMENT",
      "FEATURE",
      "EPIC",
      "PROJECT",
      "CODE_ENTITY",
      "COMPONENT",
      "INFRASTRUCTURE",
      "DEPLOYMENT",
      "MAINTENANCE"
    ],
    "multiplicity": {
      "from": "many",
      "to": "many"
    },
    "validation": {
      "severity": "warn"
    },
    "strength": "MEDIUM"
  },
  {
    "type": "MONITORS",
    "description": "Relación de observabilidad.",
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
    "strength": "WEAK"
  },
  {
    "type": "REFINES",
    "description": "Descompone artefactos en otros más concretos.",
    "category": "TRACEABILITY",
    "allowedFrom": [
      "FEATURE",
      "REQUIREMENT",
      "BUG",
      "RISK",
      "DESIGN"
    ],
    "allowedTo": [
      "EPIC",
      "FEATURE",
      "PROJECT",
      "BUSINESS_RULE",
      "REQUIREMENT",
      "DESIGN"
    ],
    "multiplicity": {
      "from": "many",
      "to": "many"
    },
    "validation": {
      "severity": "warn"
    },
    "strength": "MEDIUM"
  },
  {
    "type": "RELATES_TO",
    "description": "Uso genérico propenso a polución semántica. (DISCOURAGED)\nPara mantener un grafo limpio, solo úsala aportando rationale explícito:\n\nrelations:\n  - to: mi-otro-artefacto\n    type: RELATES_TO\n    rationale: \"No encaja con USES o DEPENDS_ON debido al contexto X.\"\n",
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
      "TEST",
      "DOCUMENTATION",
      "INCIDENT",
      "INFRASTRUCTURE",
      "DEPLOYMENT",
      "MONITORING",
      "MAINTENANCE",
      "SYSTEM_VERSION",
      "VERSION"
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
      "TEST",
      "DOCUMENTATION",
      "INCIDENT",
      "INFRASTRUCTURE",
      "DEPLOYMENT",
      "MONITORING",
      "MAINTENANCE",
      "SYSTEM_VERSION",
      "VERSION"
    ],
    "multiplicity": {
      "from": "many",
      "to": "many"
    },
    "validation": {
      "severity": "warn"
    },
    "strength": "MEDIUM"
  },
  {
    "type": "REPLACES",
    "description": "Evolución e histórico, deprecando versiones anteriores.",
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
    "strength": "WEAK"
  },
  {
    "type": "TESTS",
    "description": "Conecta tests con comportamiento validado.",
    "category": "TRACEABILITY",
    "allowedFrom": [
      "TEST_CASE",
      "TEST"
    ],
    "allowedTo": [
      "REQUIREMENT",
      "FEATURE",
      "EPIC",
      "CODE_ENTITY",
      "COMPONENT",
      "API",
      "DATABASE_ENTITY",
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
    "strength": "STRONG"
  },
  {
    "type": "USES",
    "description": "Llamada funcional, invocación o flujo en tiempo de ejecución.",
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
    "strength": "MEDIUM"
  },
  {
    "type": "VALIDATES",
    "description": "Validación empírica/humana (QA Manual).",
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
      "DEPLOYMENT"
    ],
    "multiplicity": {
      "from": "many",
      "to": "many"
    },
    "validation": {
      "severity": "info"
    },
    "strength": "WEAK"
  }
];
