import assert from 'node:assert';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import { createDocumentationFreeze, loadExportProfile } from '../scripts/core/freeze.js';

function writeFile(filePath: string, content: string) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf-8');
}

function createFixture() {
  const projectRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'openlag-freeze-'));

  writeFile(path.join(projectRoot, 'docs', 'contracts', 'artifacts', 'PROJECT.yaml'), [
    'type: PROJECT',
    'layer: DOCUMENTATION',
    'description: Project artifact.',
    'requiredFields: [id, type, title, description]',
    '',
  ].join('\n'));

  writeFile(path.join(projectRoot, 'docs', 'contracts', 'artifacts', 'REQUIREMENT.yaml'), [
    'type: REQUIREMENT',
    'layer: BUSINESS',
    'description: Requirement artifact.',
    'requiredFields: [id, type, title, description]',
    '',
  ].join('\n'));

  writeFile(path.join(projectRoot, 'docs', 'contracts', 'artifacts', 'COMPONENT.yaml'), [
    'type: COMPONENT',
    'layer: ARCHITECTURE',
    'description: Component artifact.',
    'requiredFields: [id, type, title, description]',
    '',
  ].join('\n'));

  writeFile(path.join(projectRoot, 'docs', 'contracts', 'relations', 'IMPLEMENTS.yaml'), [
    'relation: IMPLEMENTS',
    'description: Implements a requirement.',
    'category: TRACEABILITY',
    'allowedFrom: [COMPONENT]',
    'allowedTo: [REQUIREMENT]',
    'validation:',
    '  severity: error',
    '',
  ].join('\n'));

  writeFile(path.join(projectRoot, 'docs', 'contracts', 'export-profiles', 'architecture.yaml'), [
    'id: architecture',
    'name: Architecture Freeze',
    'defaultFormat: markdown',
    'includeArtifactTypes: [PROJECT, REQUIREMENT, COMPONENT]',
    'includeRelations: [IMPLEMENTS]',
    'sections:',
    '  - id: overview',
    '    title: Overview',
    '    artifactTypes: [PROJECT]',
    '  - id: requirements',
    '    title: Requirements',
    '    artifactTypes: [REQUIREMENT]',
    '  - id: architecture',
    '    title: Architecture',
    '    artifactTypes: [COMPONENT]',
    'rendering:',
    '  includeTableOfContents: true',
    '  includeRelationTables: true',
    '',
  ].join('\n'));

  writeFile(path.join(projectRoot, 'docs', 'requirements', 'req-a.md'), [
    '---',
    'id: req-a',
    'type: REQUIREMENT',
    'title: Alpha Requirement',
    'description: Alpha must exist.',
    'version: v-1',
    'status: ready',
    '---',
    '',
  ].join('\n'));

  writeFile(path.join(projectRoot, 'docs', 'architecture', 'cmp-a.md'), [
    '---',
    'id: cmp-a',
    'type: COMPONENT',
    'title: Alpha Component',
    'description: Implements alpha.',
    'version: v-1',
    'status: ready',
    'relations:',
    '  - type: IMPLEMENTS',
    '    to: req-a',
    '---',
    '',
  ].join('\n'));

  writeFile(path.join(projectRoot, 'docs', 'architecture', 'project.md'), [
    '---',
    'id: project-a',
    'type: PROJECT',
    'title: Project Alpha',
    'description: Project summary.',
    'version: v-1',
    'status: ready',
    '---',
    '',
  ].join('\n'));

  return projectRoot;
}

test('loads an export profile from docs/contracts/export-profiles', () => {
  const projectRoot = createFixture();
  const profile = loadExportProfile(projectRoot, 'architecture');

  assert.strictEqual(profile.id, 'architecture');
  assert.strictEqual(profile.sections.length, 3);
  assert.deepStrictEqual(profile.includeRelations, ['IMPLEMENTS']);
});

test('dry-run creates deterministic markdown without writing output', () => {
  const projectRoot = createFixture();
  const first = createDocumentationFreeze({ projectRoot, profile: 'architecture', dryRun: true });
  const second = createDocumentationFreeze({ projectRoot, profile: 'architecture', dryRun: true });

  assert.strictEqual(first.markdown, second.markdown);
  assert.strictEqual(first.dryRun, true);
  assert.strictEqual(fs.existsSync(first.outputFile), false);
  assert.match(first.markdown, /# Architecture Freeze/);
  assert.match(first.markdown, /## Requirements/);
  assert.match(first.markdown, /`IMPLEMENTS`/);
});

test('writes markdown freeze to dist/openlag/exports by default', () => {
  const projectRoot = createFixture();
  const result = createDocumentationFreeze({ projectRoot, profile: 'architecture' });

  assert.strictEqual(
    result.outputFile,
    path.join(projectRoot, 'dist', 'openlag', 'exports', 'architecture', 'openlag-architecture.md')
  );
  assert.strictEqual(fs.existsSync(result.outputFile), true);
  assert.strictEqual(fs.readFileSync(result.outputFile, 'utf-8'), result.markdown);
});

test('renders json, html, and pdf from the same frozen document model', () => {
  const projectRoot = createFixture();
  const json = createDocumentationFreeze({ projectRoot, profile: 'architecture', format: 'json' });
  const html = createDocumentationFreeze({ projectRoot, profile: 'architecture', format: 'html' });
  const pdf = createDocumentationFreeze({ projectRoot, profile: 'architecture', format: 'pdf' });

  assert.match(json.outputFile, /openlag-architecture\.json$/);
  assert.match(html.outputFile, /openlag-architecture\.html$/);
  assert.match(pdf.outputFile, /openlag-architecture\.pdf$/);
  assert.equal(JSON.parse(String(json.content)).formatVersion, 'openlag.freeze.v1');
  assert.match(String(html.content), /<!doctype html>/);
  assert.equal(Buffer.isBuffer(pdf.content), true);
  assert.equal(fs.readFileSync(pdf.outputFile).subarray(0, 5).toString(), '%PDF-');
});
