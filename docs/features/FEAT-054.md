---
id: FEAT-054
type: FEATURE
status: ready
title: Starter Mode
version: VER-050
description: "OpenLAG provides starter-oriented onboarding contracts and templates for lightweight project adoption."
ownership:
  owner: donartcha
  team: openlag
relations:
  - type: REFINES
    to: CHG-050
---

# Starter Mode

## What Changed

Starter mode defines a reduced lifecycle contract for early-stage projects, with scoped artifact and relation sets plus a starter export profile. It separates minimal adoption from full governance mode.

## Where It Changed

- Starter profile contracts: `profiles/starter/**`.
- Init and setup command behavior: `scripts/cli/init.ts`.
- Validation behavior compatibility: lint/check profile resolution in `scripts/lint`.

## Why It Changed

0.4.0 lifecycle adoption assumed full contract density from day one. Starter mode solves the adoption barrier by letting teams establish traceability with fewer required entities while still remaining compatible with later promotion to core/governance profiles.

## Impact

- Workflow impact: faster initial authoring with lower contract overhead.
- Migration impact: promotes gradual evolution from starter to full lifecycle enforcement.
- Compatibility impact: starter artifacts remain valid OpenLAG entities and can be expanded without reauthoring baseline IDs.
