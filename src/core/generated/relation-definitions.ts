
import { RelationType, RelationCategory, RelationStrength } from '../../types.js';

export interface RelationSemanticDefinition {
  category: RelationCategory;
  strength: RelationStrength;
}

export const RelationInferenceRules: Record<string, RelationSemanticDefinition> = {
  "BLOCKS": {
    "category": "OPERATIONAL",
    "strength": "STRONG"
  },
  "BREAKS": {
    "category": "BEHAVIORAL",
    "strength": "STRONG"
  },
  "DEFINES": {
    "category": "STRUCTURAL",
    "strength": "STRONG"
  },
  "DEPENDS_ON": {
    "category": "STRUCTURAL",
    "strength": "STRONG"
  },
  "DEPLOYS": {
    "category": "OPERATIONAL",
    "strength": "STRONG"
  },
  "DERIVES_FROM": {
    "category": "TRACEABILITY",
    "strength": "MEDIUM"
  },
  "DOCUMENTS": {
    "category": "TRACEABILITY",
    "strength": "WEAK"
  },
  "FIXES": {
    "category": "TRACEABILITY",
    "strength": "STRONG"
  },
  "IMPACTS": {
    "category": "BEHAVIORAL",
    "strength": "MEDIUM"
  },
  "IMPLEMENTS": {
    "category": "TRACEABILITY",
    "strength": "STRONG"
  },
  "JUSTIFIES": {
    "category": "TRACEABILITY",
    "strength": "MEDIUM"
  },
  "MONITORS": {
    "category": "OPERATIONAL",
    "strength": "MEDIUM"
  },
  "REFINES": {
    "category": "TRACEABILITY",
    "strength": "MEDIUM"
  },
  "RELATES_TO": {
    "category": "TRACEABILITY",
    "strength": "WEAK"
  },
  "REPLACES": {
    "category": "TRACEABILITY",
    "strength": "STRONG"
  },
  "TESTS": {
    "category": "TRACEABILITY",
    "strength": "STRONG"
  },
  "USES": {
    "category": "STRUCTURAL",
    "strength": "MEDIUM"
  },
  "VALIDATES": {
    "category": "TRACEABILITY",
    "strength": "STRONG"
  }
};

export function inferRelationSemantics(type: string): RelationSemanticDefinition | undefined {
  return RelationInferenceRules[type];
}
