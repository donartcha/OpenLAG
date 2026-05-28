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

This test case covers the final validation path for OpenLAG 0.5.0:

- `npm.cmd run check`
- `node --import tsx scripts/cli/openlag.ts check --profile develop`
- `node --import tsx scripts/cli/openlag.ts check --profile release --strict`
- `node bin/openlag.js --version`
- `npm.cmd pack --dry-run`
- root-level generate, build, and freeze evidence
