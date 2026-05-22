import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

import { ArtifactContract, ArtifactRegistry } from '../../src/core/registry/ArtifactRegistry.js';

export function readArtifactContracts(artifactsDir: string): ArtifactContract[] {
  if (!fs.existsSync(artifactsDir)) return [];

  return fs.readdirSync(artifactsDir)
    .filter(file => file.endsWith('.yaml'))
    .map(file => {
      const content = fs.readFileSync(path.join(artifactsDir, file), 'utf-8');
      const parsed = yaml.load(content) as any;
      return {
        type: parsed.type,
        extends: parsed.extends,
        layer: parsed.layer,
        description: parsed.description,
        requiredFields: parsed.requiredFields || [],
        impactSeverityDefault: parsed.impactSeverityDefault,
        impact: parsed.impact || {},
      };
    })
    .filter(contract => Boolean(contract.type));
}

export function loadArtifactContracts(artifactsDir: string): ArtifactContract[] {
  const contracts = readArtifactContracts(artifactsDir);
  if (contracts.length > 0) {
    ArtifactRegistry.configure(contracts);
  }
  return contracts;
}
