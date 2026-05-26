import fs from 'fs';
import path from 'path';

import { readRelationContracts } from './core/relation-contracts.js';

const relationsDir = path.join(process.cwd(), 'docs/contracts/relations');
const outputFile = path.join(process.cwd(), 'src/core/generated/relation-definitions.ts');
const publicOutputFile = path.join(process.cwd(), 'public/relation-definitions.json');

const relations = readRelationContracts(relationsDir);

if (!fs.existsSync(path.dirname(publicOutputFile))) {
    fs.mkdirSync(path.dirname(publicOutputFile), { recursive: true });
}

fs.writeFileSync(publicOutputFile, JSON.stringify(relations, null, 2));
console.log('Relation definitions JSON generated.');

const fileContent = `
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

export const GENERATED_RELATIONS: RelationContract[] = ${JSON.stringify(relations, null, 2)};
`;

const packageJsonPath = path.join(process.cwd(), 'package.json');
let isOpenLagSourcePackage = false;
if (fs.existsSync(packageJsonPath)) {
  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    isOpenLagSourcePackage = packageJson.name === '@donartcha/openlag';
  } catch {
    isOpenLagSourcePackage = false;
  }
}

const shouldWriteGeneratedTs = isOpenLagSourcePackage || fs.existsSync(outputFile);

if (shouldWriteGeneratedTs && !fs.existsSync(path.dirname(outputFile))) {
    fs.mkdirSync(path.dirname(outputFile), { recursive: true });
}

if (shouldWriteGeneratedTs) {
  fs.writeFileSync(outputFile, fileContent);
  console.log('Relation definitions TypeScript generated.');
}
