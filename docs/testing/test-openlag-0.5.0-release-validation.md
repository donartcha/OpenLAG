---
id: test-openlag-0.5.0-release-validation
type: TEST_CASE
status: ready
title: OpenLAG 0.5.0 Release Validation
version: openlag-0.5.0
description: "Validates the 0.5.0 lifecycle features through root generation, release checks, package dry run, and freeze outputs."
ownership:
  owner: donartcha
  team: openlag
relations:
  - type: TESTS
    to: feature-freeze-export
  - type: TESTS
    to: feature-rule-contracts
  - type: TESTS
    to: feature-profile-packs
  - type: TESTS
    to: feature-starter-mode
  - type: TESTS
    to: feature-preview-workflow
---

# OpenLAG 0.5.0 Release Validation

This test case covers the final validation path for OpenLAG 0.5.0:

- `npm.cmd run check`
- `node --import tsx scripts/cli/openlag.ts check --profile develop`
- `node --import tsx scripts/cli/openlag.ts check --profile release --strict`
- `node bin/openlag.js --version`
- `npm.cmd pack --dry-run`
- root-level generate, build, and freeze evidence
