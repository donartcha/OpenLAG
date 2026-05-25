import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

import test from 'node:test';

test('scaffold command creates template directories', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'openlag-authoring-'));
  execFileSync(process.execPath, ['--import', 'tsx', 'scripts/cli/openlag.ts', 'scaffold'], {
    cwd: path.resolve(process.cwd()),
    env: { ...process.env, OPENLAG_PROJECT_ROOT: root },
    stdio: 'pipe',
  });
  const expected = path.join(path.resolve(process.cwd()), 'templates', 'artifacts', 'artifact-contract.template.yaml');
  assert.equal(fs.existsSync(expected), true);
});
