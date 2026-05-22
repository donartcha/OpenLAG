import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

import { RelationContract, RelationRegistry } from '../../src/core/registry/RelationRegistry.js';

export function readRelationContracts(relationsDir: string): RelationContract[] {
  if (!fs.existsSync(relationsDir)) return [];

  return fs.readdirSync(relationsDir)
    .filter(file => file.endsWith('.yaml'))
    .map(file => {
      const content = fs.readFileSync(path.join(relationsDir, file), 'utf-8');
      const parsed = yaml.load(content) as any;
      const strength = (parsed.validation?.severity === 'error' ? 'STRONG' : (parsed.validation?.severity === 'warn' ? 'MEDIUM' : 'WEAK')) as RelationContract['strength'];
      return {
        type: parsed.relation,
        description: parsed.description,
        category: parsed.category,
        allowedFrom: parsed.allowedFrom || [],
        allowedTo: parsed.allowedTo || [],
        multiplicity: parsed.multiplicity || { from: 'many', to: 'many' },
        validation: parsed.validation || { severity: 'error' },
        strength,
        impact: parsed.impact || { propagates: false, directions: ['forward'], weight: 0.5 },
      };
    })
    .filter(contract => Boolean(contract.type));
}

export function loadRelationContracts(relationsDir: string): RelationContract[] {
  const contracts = readRelationContracts(relationsDir);
  if (contracts.length > 0) {
    RelationRegistry.configure(contracts);
  }
  return contracts;
}
