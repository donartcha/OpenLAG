import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { execFileSync } from 'node:child_process';

import test from 'node:test';

const tsxLoader = pathToFileURL(path.resolve(process.cwd(), 'node_modules/tsx/dist/loader.mjs')).href;

test('scaffold command creates template directories', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'openlag-authoring-'));
  const cli = path.resolve(process.cwd(), 'scripts/cli/openlag.ts');
  execFileSync(process.execPath, ['--import', tsxLoader, cli, 'scaffold'], {
    cwd: root,
    env: { ...process.env },
    stdio: 'pipe',
  });
  const expected = path.join(root, 'templates', 'artifacts', 'artifact-contract.template.yaml');
  assert.equal(fs.existsSync(expected), true);
});

test('profile add copies only canonical contract directories', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'openlag-profile-'));
  const cli = path.resolve(process.cwd(), 'scripts/cli/openlag.ts');
  execFileSync(process.execPath, ['--import', tsxLoader, cli, 'profile', 'add', 'mvc'], {
    cwd: root,
    env: { ...process.env },
    stdio: 'pipe',
  });

  assert.equal(fs.existsSync(path.join(root, 'docs/contracts/artifacts/CONTROLLER.yaml')), true);
  assert.equal(fs.existsSync(path.join(root, 'docs/contracts/rules/controller-db-rule.yaml')), true);
  assert.equal(fs.existsSync(path.join(root, 'docs/contracts/profile.yaml')), false);
  assert.equal(fs.existsSync(path.join(root, 'docs/contracts/contracts/rules/controller-db-rule.yaml')), false);
});

test('profile validate accepts bundled governance profile', () => {
  const cli = path.resolve(process.cwd(), 'scripts/cli/openlag.ts');
  const output = execFileSync(process.execPath, ['--import', tsxLoader, cli, 'profile', 'validate', '--profile', 'governance'], {
    cwd: path.resolve(process.cwd()),
    env: { ...process.env },
    encoding: 'utf-8',
  });

  assert.match(output, /Valid profile pack: governance/);
});
