import { RelationType, RelationCategory, RelationStrength } from '../../types.js';

export interface RelationSemanticDefinition {
  category: RelationCategory;
  strength: RelationStrength;
}

export const RelationInferenceRules: Record<RelationType, RelationSemanticDefinition> = {
  IMPLEMENTS: { category: 'TRACEABILITY', strength: 'STRONG' },
  TESTS: { category: 'TRACEABILITY', strength: 'STRONG' },
  DEPENDS_ON: { category: 'STRUCTURAL', strength: 'STRONG' },
  DERIVES_FROM: { category: 'TRACEABILITY', strength: 'MEDIUM' },
  RELATES_TO: { category: 'TRACEABILITY', strength: 'WEAK' },
  IMPACTS: { category: 'BEHAVIORAL', strength: 'MEDIUM' },
  BLOCKS: { category: 'OPERATIONAL', strength: 'STRONG' },
  FIXES: { category: 'TRACEABILITY', strength: 'STRONG' },
  USES: { category: 'STRUCTURAL', strength: 'MEDIUM' },
  DEFINES: { category: 'STRUCTURAL', strength: 'STRONG' },
  VALIDATES: { category: 'TRACEABILITY', strength: 'STRONG' },
  DOCUMENTS: { category: 'DOCUMENTATION' as any, strength: 'WEAK' }, // Force to TRACEABILITY or something else valid based on types
  REPLACES: { category: 'TRACEABILITY', strength: 'STRONG' },
  JUSTIFIES: { category: 'TRACEABILITY', strength: 'MEDIUM' },
  BREAKS: { category: 'BEHAVIORAL', strength: 'STRONG' },
  REFINES: { category: 'TRACEABILITY', strength: 'MEDIUM' },
  DEPLOYS: { category: 'OPERATIONAL', strength: 'STRONG' },
  MONITORS: { category: 'OPERATIONAL', strength: 'MEDIUM' },
};

export function inferRelationSemantics(type: RelationType): RelationSemanticDefinition | undefined {
  let definition = RelationInferenceRules[type];
  if (definition && definition.category as any === 'DOCUMENTATION') {
      definition.category = 'TRACEABILITY';
  }
  return definition;
}
