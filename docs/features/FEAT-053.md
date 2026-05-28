---
id: FEAT-053
type: FEATURE
status: ready
title: Profile Packs
version: VER-050
description: "OpenLAG 0.5.0 packages reusable architecture, governance, starter, and domain profiles."
ownership:
  owner: donartcha
  team: openlag
relations:
  - type: REFINES
    to: CHG-050
---

# Profile Packs

## What Changed

OpenLAG 0.5.0 introduces profile packs as lifecycle-distributed contract bundles (`core`, `starter`, `governance`, `mvc`, `hexagonal`, `infra-ops`, `requirements`, `testing`, `architecture-docs`). This changes profile selection from ad hoc local authoring to reusable curated baselines.

## Where It Changed

- Pack definitions under `profiles/**`.
- Init/profile wiring under `scripts/cli/init.ts`.
- Runtime contract payload generation under `scripts/generate-artifacts.ts`, `scripts/generate-relations.ts`, `scripts/generate-rules.ts`.
- Root project adoption via `docs/contracts/**`.

## Why It Changed

Lifecycle reproducibility required a stable contract vocabulary across branches and teams. Profile packs remove repeated manual setup and reduce drift between intended and executed lifecycle constraints.

## Impact

- Operational: onboarding workflows can bootstrap complete contract sets quickly.
- Architectural: profile boundaries separate domain vocabulary from project-specific lifecycle evidence.
- Migration: teams on 0.4.0 can adopt profile packs incrementally by importing packs and then layering local `docs/contracts` overrides.
