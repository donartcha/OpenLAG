import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const relationsDir = path.join(process.cwd(), 'docs/contracts/relations');
const outputFile = path.join(process.cwd(), 'src/core/generated/relation-definitions.ts');

const files = fs.readdirSync(relationsDir);
const relations: any = {};

files.forEach(file => {
  if (file.endsWith('.yaml')) {
    const content = fs.readFileSync(path.join(relationsDir, file), 'utf-8');
    const parsed = yaml.load(content) as any;
    relations[parsed.relation] = {
      category: parsed.category,
      strength: parsed.validation.severity === 'error' ? 'STRONG' : (parsed.validation.severity === 'warn' ? 'MEDIUM' : 'WEAK')
    };
  }
});

const fileContent = `
import { RelationType, RelationCategory, RelationStrength } from '../../types.js';

export interface RelationSemanticDefinition {
  category: RelationCategory;
  strength: RelationStrength;
}

export const RelationInferenceRules: Record<string, RelationSemanticDefinition> = ${JSON.stringify(relations, null, 2)};

export function inferRelationSemantics(type: string): RelationSemanticDefinition | undefined {
  return RelationInferenceRules[type];
}
`;

if (!fs.existsSync(path.dirname(outputFile))) {
    fs.mkdirSync(path.dirname(outputFile), { recursive: true });
}

fs.writeFileSync(outputFile, fileContent);
console.log('Relation definitions generated.');
