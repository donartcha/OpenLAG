---
id: TEST-050
type: TEST_CASE
status: ready
title: OpenLAG 0.5.0 Release Validation
version: VER-050
description: "Validates the 0.5.0 lifecycle features through root generation, release checks, package dry run, and freeze outputs."
ownership:
  owner: donartcha
  team: openlag
relations:
  - type: TESTS
    to: FEAT-051
  - type: TESTS
    to: FEAT-052
  - type: TESTS
    to: FEAT-053
  - type: TESTS
    to: FEAT-054
  - type: TESTS
    to: FEAT-055
---

# OpenLAG 0.5.0 Release Validation

## Validation Intent

This test case verifies that lifecycle evolution is not only documented but executable and deterministic across branch/version transitions.

## Command-Level Coverage

This validation path covers:

- `npm.cmd run check`
- `node --import tsx scripts/cli/openlag.ts check --profile develop`
- `node --import tsx scripts/cli/openlag.ts check --profile release --strict`
- `node bin/openlag.js --version`
- `npm.cmd pack --dry-run`
- root-level generate, build, and freeze evidence

## What These Checks Prove

- Integrity: contracts, relations, and rules resolve without graph violations.
- Governance: profile-specific rule gates behave consistently across develop and release strictness.
- Runtime packaging: published artifact composition is inspectable before release.
- Lifecycle determinism: regenerated outputs remain aligned with source artifacts and validation expectations.

## Operational Assumptions

- PDF/HTML freeze validation depends on a valid project-local runtime dependency context.
- CLI entrypoints may be global, but deterministic export behavior depends on running within a correctly prepared project workspace.
