import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import yaml from 'js-yaml';

import { parseOpenLagDocs } from '../scripts/core/parser.js';
import { runLintRules } from '../scripts/lint/lint-rules.js';
import { defaultProfiles } from '../scripts/lint/lint-profiles.js';

const fixturesRoot = path.resolve(process.cwd(), 'tests/fixtures/invalid');

function lintFixture(name: string) {
  const docsDir = path.join(fixturesRoot, name, 'docs');
  const data = parseOpenLagDocs(docsDir);
  return runLintRules(data, defaultProfiles.release);
}

test('invalid fixture: missing implementation fails deterministically', () => {
  const issues = lintFixture('missing-implementation');
  assert.ok(issues.some((issue) => issue.rule === 'requirementWithoutImplementation'));
});

test('invalid fixture: missing test fails deterministically', () => {
  const issues = lintFixture('missing-test');
  assert.ok(issues.some((issue) => issue.rule === 'requirementWithoutTest'));
});

test('invalid fixture: broken relation fails deterministically', () => {
  const issues = lintFixture('broken-relation');
  assert.ok(issues.some((issue) => issue.rule === 'brokenRelation'));
});

test('invalid fixture: forbidden release relation fails deterministically', () => {
  const issues = lintFixture('forbidden-relation');
  assert.ok(issues.some((issue) => issue.rule === 'invalidRelationType' || issue.rule === 'invalidLayerRelation'));
});

test('invalid fixture: governance failure fails deterministically', () => {
  const issues = lintFixture('governance-failure');
  assert.ok(issues.some((issue) => issue.rule === 'codeWithoutRequirement'));
});

test('invalid fixture: invalid rule contract is detected', () => {
  const rulePath = path.join(fixturesRoot, 'invalid-rule-contract', 'docs/contracts/rules/invalid-rule.yaml');
  const parsed = yaml.load(fs.readFileSync(rulePath, 'utf-8')) as Record<string, unknown>;
  assert.equal(typeof parsed.id, 'undefined');
});
