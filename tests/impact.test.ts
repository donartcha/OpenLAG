import assert from 'node:assert/strict';
import test from 'node:test';
import { ImpactGraph } from '../scripts/cli/impact.ts';
import { RelationRegistry } from '../src/core/registry/RelationRegistry.ts';

test('impact graph returns explainable deterministic records', () => {
  const artifacts = [
    { id: 'a', type: 'REQUIREMENT', title: 'A', ownership: { owner: 'ana', team: 'core' } },
    { id: 'b', type: 'DESIGN', title: 'B', ownership: { owner: 'bob', team: 'arch' } },
    { id: 'c', type: 'CODE_ENTITY', title: 'C', ownership: { owner: 'carol', team: 'dev' } },
  ] as any;

  const relations = [{ from: 'a', to: 'b', type: 'IMPLEMENTS' }, { from: 'b', to: 'c', type: 'DEPENDS_ON' }] as any;
  const original = RelationRegistry.getContract;
  (RelationRegistry as any).getContract = () => ({
    impact: { propagates: true, directions: ['forward'], weight: 0.9 },
  });
  const graph = new ImpactGraph(artifacts, relations);
  const impacted = graph.getImpactRecords('a');
  (RelationRegistry as any).getContract = original;

  assert.equal(Array.isArray(impacted), true);
  assert.equal(impacted.length >= 1, true);
  assert.equal(typeof impacted[0].reason, 'string');
  assert.equal(typeof impacted[0].weight, 'number');
  assert.equal(typeof impacted[0].severity, 'string');
});
