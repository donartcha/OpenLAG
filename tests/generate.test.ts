import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import { generateData } from '../scripts/cli/generate.js';

test('generate writes an empty rule registry when rule contracts are omitted', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'openlag-generate-'));
  const docsDir = path.join(root, 'docs');
  const outputDir = path.join(root, 'public');

  fs.mkdirSync(path.join(docsDir, 'contracts'), { recursive: true });
  generateData(docsDir, outputDir, true);

  const ruleDefinitions = JSON.parse(
    fs.readFileSync(path.join(outputDir, 'rule-definitions.json'), 'utf-8')
  );
  assert.deepEqual(ruleDefinitions, []);
});
