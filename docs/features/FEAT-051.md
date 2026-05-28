---
id: FEAT-051
type: FEATURE
status: ready
title: Freeze and Export Evidence
version: VER-050
description: "OpenLAG can freeze architecture documentation into deterministic markdown, JSON, HTML, and PDF evidence outputs."
ownership:
  owner: donartcha
  team: openlag
relations:
  - type: REFINES
    to: CHG-050
---

# Freeze and Export Evidence

## What Changed

`freeze` moved from high-level export utility to lifecycle evidence primitive. The feature now emits deterministic documentation snapshots in markdown/json/html/pdf and supports version-scoped freeze generation via `--version`.

## Where It Changed

- CLI entrypoints: `scripts/cli/freeze.ts`, `scripts/cli/openlag.ts`.
- Freeze model/render pipeline: `scripts/core/freeze.ts`.
- Export behavior contracts: `docs/contracts/export-profiles/*.yaml`.
- Generated evidence destinations: root output files and optional audit directories.

## Why It Changed

Release and audit reviews required concrete lifecycle evidence without requiring branch diff inspection. Freeze outputs now serve as reproducible documentary artifacts for governance and compliance workflows.

## Impact

- Behavioral: freeze now exposes version-aligned lifecycle slices, not only profile-sliced exports.
- Workflow: teams can produce release dossiers directly from root docs.
- Determinism: same source+profile+version yields stable documentary structure.
