
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
  impact: { propagates: boolean; directions: ('forward' | 'reverse' | 'both')[]; weight: number };
}

export const GENERATED_RELATIONS: RelationContract[] = [];
