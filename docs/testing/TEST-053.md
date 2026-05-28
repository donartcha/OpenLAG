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
    to: CHK-050
  - type: TESTS
    to: REQ-053
---

# OpenLAG 0.5.0 Governance And Rule Profile Validation

## Validation Intent

This test case ensures that governance rules are strictly enforced according to the active profile (develop vs release).

## Command-Level Coverage

This validation path covers:
- `npm.cmd run check`
- `node --import tsx scripts/cli/openlag.ts check --profile develop`
- `node --import tsx scripts/cli/openlag.ts check --profile release --strict`

## What These Checks Prove

- Governance: profile-specific rule gates behave consistently across develop and release strictness.
