import assert from 'node:assert';
import test from 'node:test';
import { runLintRules } from '../scripts/lint/lint-rules.js';
import { defaultProfiles } from '../scripts/lint/lint-profiles.js';
import { OpenLagData, ParsedArtifact, ParsedRelation } from '../scripts/core/parser.js';
import { RuleRegistry } from '../src/core/registry/RuleRegistry.js';

function createMockData(): OpenLagData {
  return {
    versions: [],
    systemVersions: [],
    changes: [],
    artifacts: [],
    relations: [],
    errors: []
  };
}

function createMockArtifact(id: string, type: any, status: any = undefined): ParsedArtifact {
    return {
        id,
        type,
        title: `Title ${id}`,
        description: '...',
        version: 'v-1',
        status,
        file: `docs/${id}.md`
    };
}

function createMockRelation(from: string, to: string, type: any = 'IMPLEMENTS'): ParsedRelation {
    return {
        id: `rel-${from}-${to}`,
        from,
        to,
        type,
        file: `docs/${from}.md`
    };
}

test('duplicate ID is detected', () => {
    const data = createMockData();
    data.artifacts.push(createMockArtifact('REQ-1', 'REQUIREMENT'));
    data.artifacts.push(createMockArtifact('REQ-1', 'REQUIREMENT'));
    
    const issues = runLintRules(data, defaultProfiles['develop']);
    const duplicateIdIssue = issues.find(i => i.rule === 'duplicateId');
    assert.ok(duplicateIdIssue);
    assert.strictEqual(duplicateIdIssue.severity, 'error');
});

test('broken relation is detected', () => {
    const data = createMockData();
    data.artifacts.push(createMockArtifact('REQ-1', 'REQUIREMENT'));
    data.relations.push(createMockRelation('REQ-1', 'CODE-1')); // CODE-1 doesn't exist
    
    const issues = runLintRules(data, defaultProfiles['develop']);
    const brokenRelation = issues.find(i => i.rule === 'brokenRelation');
    assert.ok(brokenRelation);
    assert.strictEqual(brokenRelation.severity, 'error');
});

test('requirement without test behavior in feature/develop/release', () => {
    const data = createMockData();
    data.artifacts.push(createMockArtifact('REQ-1', 'REQUIREMENT', 'ready'));
    data.artifacts.push(createMockArtifact('CODE-1', 'CODE_ENTITY'));
    data.relations.push(createMockRelation('CODE-1', 'REQ-1', 'IMPLEMENTS'));
    // No test relation

    // feature should be info
    let issues = runLintRules(data, defaultProfiles['feature']);
    let reqNoTest = issues.find(i => i.rule === 'requirementWithoutTest');
    assert.ok(reqNoTest);
    assert.strictEqual(reqNoTest.severity, 'info');

    // develop should be warning
    issues = runLintRules(data, defaultProfiles['develop']);
    reqNoTest = issues.find(i => i.rule === 'requirementWithoutTest');
    assert.ok(reqNoTest);
    assert.strictEqual(reqNoTest.severity, 'warning');

    // release should be error
    issues = runLintRules(data, defaultProfiles['release']);
    reqNoTest = issues.find(i => i.rule === 'requirementWithoutTest');
    assert.ok(reqNoTest);
    assert.strictEqual(reqNoTest.severity, 'error');
});

test('draft requirement does not block with requirementWithoutImplementation for errors', () => {
    const data = createMockData();
    data.artifacts.push(createMockArtifact('REQ-1', 'REQUIREMENT', 'draft'));

    const issues = runLintRules(data, defaultProfiles['release']);
    const reqNoImpl = issues.find(i => i.rule === 'requirementWithoutImplementation');
    
    assert.ok(reqNoImpl);
    assert.strictEqual(reqNoImpl.severity, 'info'); // Release asks for ERROR, but rule downgrades drafts to info
});

test('closed requirement blocks when linking to draft', () => {
    const data = createMockData();
    data.artifacts.push(createMockArtifact('REQ-1', 'REQUIREMENT', 'closed'));
    data.artifacts.push(createMockArtifact('CODE-1', 'CODE_ENTITY', 'draft'));
    data.relations.push(createMockRelation('REQ-1', 'CODE-1', 'IMPLEMENTS'));

    const issues = runLintRules(data, defaultProfiles['develop']);
    const pendingRel = issues.find(i => i.rule === 'closedArtifactWithPendingRelations');
    
    assert.ok(pendingRel);
    assert.strictEqual(pendingRel.severity, 'warning'); // Develop profile warns on this
});

test('dynamic rules are profile-gated and normalize warn severity', () => {
    const data = createMockData();
    data.artifacts.push(createMockArtifact('CODE-1', 'CODE_ENTITY', 'ready'));

    const originalGetAll = RuleRegistry.getAll;
    (RuleRegistry as any).getAll = () => [{
        id: 'customOwnershipRule',
        description: 'Requires ownership owner',
        severity: 'warn',
        matchNode: { type: 'CODE_ENTITY' },
        conditions: { requiredFields: ['ownership.owner'] }
    }];

    try {
        let issues = runLintRules(data, defaultProfiles['release']);
        assert.equal(issues.some(i => i.rule === 'customOwnershipRule'), false);

        issues = runLintRules(data, { ...defaultProfiles['release'], customOwnershipRule: 'warn' });
        const issue = issues.find(i => i.rule === 'customOwnershipRule');
        assert.ok(issue);
        assert.equal(issue.severity, 'warning');
    } finally {
        (RuleRegistry as any).getAll = originalGetAll;
    }
});
