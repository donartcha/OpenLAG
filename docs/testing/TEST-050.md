---
id: TEST-050
type: TEST_CASE
status: ready
title: OpenLAG 0.5.0 CLI Orchestration Validation
version: VER-050
description: "Validates the CLI entrypoints and orchestration layer."
ownership:
  owner: donartcha
  team: openlag
relations:
  - type: TESTS
    to: CODE-051
  - type: TESTS
    to: FEAT-055
  - type: TESTS
    to: REQ-050
---

# OpenLAG 0.5.0 CLI Orchestration Validation

## Validation Intent

This test case verifies that the OpenLAG CLI command entrypoints (`scripts/cli/*`, `CODE-051`) correctly orchestrate lifecycle commands while enforcing the repository root boundary (`REQ-050`) and generating valid portal preview assets (`FEAT-055`).

## Command-Level Coverage

This validation path covers:
- `node bin/openlag.js --version` (CLI registration check)
- `npm.cmd run generate` (Preview payload generation)
- `npm.cmd run dev` (Interactive portal dev server workflow)
- `npm.cmd run build` (Static portal production compilation)
- `npm.cmd run check` (Complete package and workflow verification)
- `npm.cmd pack --dry-run` (Release package boundary checks)

## Validation Scenarios

### 1. CLI Lifecycle Orchestration & Workflow Behavior
Ensures that commander-based entrypoints properly compile options, execute subcommands sequentially, and return clean process exit codes. Specifically, it tests that `generate`, `check`, `dev`, and `build` commands parse inputs consistently without throwing unhandled exceptions.

### 2. Self-Documenting Lifecycle Boundary (REQ-050)
Asserts that all CLI operations evaluate the root directory as the authoritative source of record for lifecycle compliance. The tests verify that:
- Contracts are loaded strictly from `docs/contracts/` at the root.
- Document artifacts are parsed from `docs/` at the root.
- Running checks outside the workspace root or attempting to inject unregistered external scopes results in immediate, controlled command failures.

### 3. Preview Workflow & Payload Generation (FEAT-055)
Validates that the CLI successfully compiles the static portal assets and builds the runtime graph. The test verifies that:
- `public/graph-data.json`, `public/artifact-definitions.json`, `public/relation-definitions.json`, and `public/rule-definitions.json` are fully and correctly populated.
- JSON schemas are generated without formatting drift, enabling downstream consumption by the react portal components.

## What These Checks Prove

- **Runtime Packaging**: Confirms that published NPM tarballs contain only the authoritative release assets, preventing leakages of testing/sandbox directories.
- **Boundary Authenticity**: Proves that the compliance report reflects solely the root workspace's state.
- **Preview Readiness**: Ensures that the interactive graph and documentation views load cleanly in the browser from the compiled JSON payloads.
