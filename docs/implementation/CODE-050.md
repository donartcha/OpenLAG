---
id: CODE-050
type: CODE_ENTITY
status: ready
title: OpenLAG 0.5.0 Lifecycle CLI Workflows
version: VER-050
description: "CLI and generation workflows implementing the 0.5.0 lifecycle features."
ownership:
  owner: donartcha
  team: openlag
relations:
  - type: IMPLEMENTS
    to: FEAT-051
  - type: IMPLEMENTS
    to: FEAT-052
  - type: IMPLEMENTS
    to: FEAT-053
  - type: IMPLEMENTS
    to: FEAT-054
  - type: IMPLEMENTS
    to: FEAT-055
---

# OpenLAG 0.5.0 Lifecycle CLI Workflows

## Implementation Scope

This artifact captures the concrete implementation evolution from a baseline graph toolchain to a lifecycle-oriented orchestration model.

## Affected Modules And Folders

- CLI orchestration: `scripts/cli/openlag.ts`, `scripts/cli/generate.ts`, `scripts/cli/build.ts`, `scripts/cli/dev.ts`, `scripts/cli/lint.ts`, `scripts/cli/impact.ts`, `scripts/cli/freeze.ts`, `scripts/cli/init.ts`, `scripts/cli/authoring.ts`.
- Core runtime engines: `scripts/core/parser/*`, `scripts/core/freeze.ts`, `scripts/core/render-pdf.ts`.
- Contract compilation pipeline: `scripts/generate-artifacts.ts`, `scripts/generate-relations.ts`, `scripts/generate-rules.ts`.
- Lifecycle vocabularies: `profiles/**` and root `docs/contracts/**`.
- Portal/runtime consumption: `src/core/generated/*`, `src/core/registry/*`, `src/components/*`.
- Runtime payload outputs: `public/*.json`.

## Behavioral Evolution

- Generation flow: docs/contracts are parsed and normalized into deterministic runtime payloads.
- Validation flow: lint/check now include rule-contract-driven governance gates, not only artifact/relation presence checks.
- Freeze/export flow: documentary exports are derived from a frozen model with profile and version scoping, and HTML/PDF rendering uses controlled runtime dependencies.
- Profile resolution flow: init and profile packs shift contract acquisition from manual file assembly to curated profile imports.

## Runtime And Boundary Model

- Global CLI provides command orchestration and entrypoints.
- Project-local runtime provides templates, docs/contracts, and dependency context required by generation and rich export modes.
- Root repository is authoritative lifecycle boundary; `internal/dev-sandbox` is an isolated secondary dataset for compatibility validation.

## Deterministic Generation And Tradeoffs

- Deterministic implication: given equal source docs/contracts/profiles and runtime dependencies, graph payloads and freeze outputs are reproducible.
- Tradeoff: storing generated evidence (`logs/**`, `public/*.json`) improves auditability and drift detection but increases repository noise and merge friction.
- Ownership shift: lifecycle reliability becomes shared between source artifacts and regeneration discipline, not only code behavior.
