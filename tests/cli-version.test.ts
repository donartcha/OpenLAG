import assert from 'node:assert';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pkg = JSON.parse(readFileSync(path.join(packageRoot, 'package.json'), 'utf8')) as { version: string };

test('openlag --version matches package.json version', () => {
  const output = execFileSync(process.execPath, ['bin/openlag.js', '--version'], {
    cwd: packageRoot,
    encoding: 'utf8',
  });

  assert.strictEqual(output.trim(), pkg.version);
});
