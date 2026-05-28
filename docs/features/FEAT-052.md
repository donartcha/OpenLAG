---
id: FEAT-052
type: FEATURE
status: ready
title: Rule Contracts
version: VER-050
description: "OpenLAG supports project-local rule contracts that make governance and validation behavior explicit."
ownership:
  owner: donartcha
  team: openlag
relations:
  - type: REFINES
    to: CHG-050
---

# Rule Contracts

## What Changed

Governance moved from implicit lint behavior to explicit rule contracts stored with project documentation. OpenLAG 0.5.0 now resolves rule definitions from repository lifecycle sources, not only from hardcoded checks.

## Where It Changed

- Rule sources: `docs/contracts/rules/*.yaml`.
- Rule generation: `scripts/generate-rules.ts`.
- Runtime registry consumption: `src/core/generated/rule-definitions.ts` and lint/check flows under `scripts/lint`.
- Profile-gated behavior: `docs/contracts/export-profiles/*` and check profiles.

## Why It Changed

The 0.4.0 model validated graph shape but did not expose governance policy as a first-class lifecycle object. Rule contracts make policy reviewable, versionable, and testable as architecture metadata.

## Impact

- Validation impact: release/develop checks now depend on explicit rule contract sets.
- Governance impact: policy drift is visible as source diff in rules, not only test outcomes.
- Compatibility impact: existing projects remain functional, but richer governance requires shipping rules with contracts for deterministic validation across environments.
