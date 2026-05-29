---
id: FEAT-055
type: FEATURE
status: ready
title: Preview Workflow
version: VER-050
description: "OpenLAG can generate and build a static portal for inspecting architecture graph outputs."
ownership:
  owner: donartcha
  team: openlag
relations:
  - type: REFINES
    to: CHG-050
  - type: REFINES
    to: REQ-050
---

# Preview Workflow

## What Changed

Preview workflow became an explicit lifecycle stage: source docs are transformed into runtime graph payloads and served as a static portal artifact for branch/version inspection.

## Where It Changed

- Generation orchestration: `scripts/cli/generate.ts`, `scripts/cli/build.ts`, `scripts/cli/dev.ts`.
- Runtime payload outputs: `public/graph-data.json`, `public/artifact-definitions.json`, `public/relation-definitions.json`, `public/rule-definitions.json`.
- Portal rendering and lifecycle navigation: `src/components/*`, especially graph/documentation/impact views.

## Why It Changed

Before 0.5.0, preview was treated mostly as UI convenience. Lifecycle reviews required mixing command output with manual branch archaeology. The new workflow elevates preview artifacts as lifecycle evidence that can be frozen and audited.

## Impact

- Behavioral: root docs are now the primary lifecycle data source for preview.
- Repository boundary: `internal/dev-sandbox` preview remains valid but explicitly secondary.
- Determinism: preview payloads are reproducible from contract+docs state, making drift visible in generated JSON diffs.
