---
id: TEST-053
type: TEST_CASE
status: ready
title: OpenLAG 0.5.0 Governance And Rule Profile Validation
version: VER-050
description: "Validates the lint and profile-specific governance gates."
ownership:
  owner: donartcha
  team: openlag
relations:
  - type: TESTS
    to: REQ-053
  - type: TESTS
    to: FEAT-053
  - type: TESTS
    to: FEAT-054
---

# OpenLAG 0.5.0 Governance And Rule Profile Validation

## Validation Intent

This test case ensures that governance rules and metadata checks are enforced according to the active profile configuration, validating the progressive adoption pathway (`REQ-053`) from lightweight onboarding (`FEAT-054`) to modular, strict release compliance (`FEAT-053`).

## Command-Level Coverage

This validation path covers:
- `node scripts/cli/openlag.js init --profile starter` (Starter onboarding check)
- `node scripts/cli/openlag.js check --profile develop` (Development validation flow)
- `node scripts/cli/openlag.js check --profile release --strict` (Strict release-gate compliance check)

## Validation Scenarios

### 1. Starter Mode Behavior (FEAT-054)
Verifies that projects bootstrapping with the starter profile can document core modules with a relaxed validation footprint:
- Scopes required frontmatter down to minimal identifiers (ID, type, title).
- Tolerates missing cross-layer relations (e.g., features lacking direct test cases), allowing teams to model architecture without immediate lint failures.

### 2. Profile Pack Resolution & Modular Loading (FEAT-053)
Asserts that the CLI and parser correctly resolve imported profile packages (`profiles/core/**`, `profiles/starter/**`, etc.). The test verifies that:
- Core vocabulary, relation limits, and rules are parsed and merged into a single runtime definition.
- Mismatched or conflicting profile files are caught and handled gracefully during the merge step.

### 3. Progressive Governance & Validation Transitions (REQ-053)
Validates the gradual promotion flow of a project:
- **Develop Profile**: Enforces intermediate relation checks (e.g., warning on undocumented semantic links).
- **Release Profile (Strict)**: Imposes hard release gates, mandating that all features have both direct implementations (`CODE_ENTITY`) and test cases (`TEST_CASE`).
- The test proves that a project can step up from starter mode to strict validation without requiring changes to baseline node IDs.

## What These Checks Prove

- **Adoption Safety**: Demonstrates that early-stage workspaces can compile successfully under starter rules.
- **Rule Coherence**: Confirms that profile boundaries prevent metadata contamination and that strict validation rules are only enforced when explicitly configured.
- **Continuous Compliance**: Proves that profile transitions are deterministic, allowing teams to scale governance incrementally.
