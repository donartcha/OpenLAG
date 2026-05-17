import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const relationsDir = path.join(process.cwd(), 'docs/relations');
const outputFile = path.join(process.cwd(), 'src/core/generated/relation-definitions.ts');

const files = fs.readdirSync(relationsDir);
const relations: any[] = [];

files.forEach(file => {
  if (file.endsWith('.yaml')) {
    const content = fs.readFileSync(path.join(relationsDir, file), 'utf-8');
    const parsed = yaml.load(content) as any;
    relations.push({
      type: parsed.relation,
      description: parsed.description,
      category: parsed.category,
      allowedFrom: parsed.allowedFrom || [],
      allowedTo: parsed.allowedTo || [],
      multiplicity: parsed.multiplicity || { from: 'many', to: 'many' },
      validation: parsed.validation || { severity: 'error' },
      strength: parsed.validation?.severity === 'error' ? 'STRONG' : (parsed.validation?.severity === 'warn' ? 'MEDIUM' : 'WEAK')
    });
  }
});

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
}

export const GENERATED_RELATIONS: RelationContract[] = ${JSON.stringify(relations, null, 2)};
`;

if (!fs.existsSync(path.dirname(outputFile))) {
    fs.mkdirSync(path.dirname(outputFile), { recursive: true });
}

fs.writeFileSync(outputFile, fileContent);
console.log('Relation definitions generated.');

