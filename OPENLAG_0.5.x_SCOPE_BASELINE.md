# OpenLAG 0.5.x Scope Baseline

This root-level document is the canonical 0.5.x scope baseline for OpenLAG until the related implementation phases supersede it.

It separates shipped behavior from proposed 0.5.x behavior so the roadmap does not overstate the current CLI, contract model, portal, or release process.

## Current Implemented Baseline

| Area | Implemented in current repository | Notes |
| --- | --- | --- |
| CLI lifecycle | `init`, `generate`, `dev`, `build`, `lint`, `check`, `impact`, `freeze`, `preview`, `create`, `profile-add` | `freeze` supports Markdown, PDF and Typst natively. |
| Artifact contracts | Dynamic YAML artifact contracts under `docs/artifacts/*.yaml` | Project-local contracts are resolved into runtime JSON for the portal. |
| Relation contracts | YAML relation contracts under `docs/relations/*.yaml` | Existing contracts remain the source of relation semantics. |
| Static output | `public/graph-data.json`, `public/artifact-definitions.json`, `public/relation-definitions.json`, static portal build in `dist/` | OpenLAG remains static-first and has no mandatory backend. |
| Impact analysis | `openlag impact` for artifact, file, staged changes, and git ranges | P7 evolved impact reports to support Rule Contracts from `docs/contracts/rules/*.yaml`. |
| Lint profiles | `draft`, `feature`, `develop`, `release` | Existing lint semantics remain fully compatible. |
| Governance artifacts | GAP, VIOLATION, DEBT, OBSERVATION, RISK, CHECK, REVIEW, EVIDENCE, INCIDENT | Implemented in P5 as standard built-in contracts. |
| Portal validation | Playwright smoke tests and deterministic screenshot workflow | Implemented in P3 via `test:e2e` and `docs:screenshots`. |
| Documentation export | `openlag freeze` Markdown, PDF, Typst | Export profiles live under `docs/export-profiles/*.yaml`. PDF integrated via Typst. |

## 0.5.x Proposed Scope

| Phase | Status boundary | Proposed outcome |
| --- | --- | --- |
| P0 Alignment and Scope Lock | Implemented | Keep this baseline, contradiction matrix, and cross-references current. |
| P1 Freeze/Export MVP | Implemented | Deterministic Markdown documentation snapshot from the OpenLAG graph and export profiles. |
| P2 PDF Export | Implemented | Optional PDF generation sourced from Typst via the `openlag freeze` CLI. |
| P3 Playwright Portal Validation | Implemented | Portal smoke tests and deterministic screenshot workflow. |
| P4 Dashboard Public/Technical Views | Canceled | Eliminated from scope. |
| P5 Governance Model Evolution | Implemented | Clear implemented governance boundary with semantic finding models. |
| P6 Mass Authoring Tooling | Implemented | Optional CLI generators/templates supporting Profile Packs. |
| P7 Impact Engine Evolution | Implemented | Explainable, filterable impact reports for CI, governed by YAML rules. |
| P8 Public Demo | Proposed | Public-safe demo assets and runbook. |
| P9 Publication and Living Docs | Proposed | Release checklist and living documentation governance. |

## Contradiction Matrix

| Topic | Conflicting inputs | Canonical P0 baseline |
| --- | --- | --- |
| Command naming | Plans mention both `openlag freeze` and `openlag export`. | Use `openlag freeze` as the canonical command name for the documentation snapshot concept. Keep `export` available only as a future alias discussion unless the command decision changes. |
| Governance scope | Some plans treat GAP/RISK/VIOLATION/DEBT/OBSERVATION as implemented; current contracts only implement part of that family. | Treat existing contracts as implemented. Treat new governance finding families as PROPOSED until P5 defines compatibility and contract behavior. |
| Contract locations | Older proposals mention legacy contract paths; the repository uses `docs/artifacts` and `docs/relations`. | `docs/artifacts/*.yaml` and `docs/relations/*.yaml` are canonical. Do not introduce a parallel contract folder without a migration decision. |
| PDF timing | Strategic plans ask for PDF; implementation instructions recommend Markdown-first. | P1 is Markdown-first. P2 may add optional PDF only after the export model and Markdown output are stable. |
| Portal printing | Some export discussions mention browser/HTML rendering paths. | The React portal is for live navigation. Frozen documentation must come from the graph/export model, with Markdown as the source of truth for PDF. |
| Playwright timing | Some plans defer portal validation; the master plan promotes it after P1/P0. | P3 should introduce Playwright after P0 and preferably after P1, without coupling portal tests to graph semantics. |
| Backend expectations | Strategic scalability mentions optional backend/BFF possibilities. | No backend is mandatory in 0.5.x. Static-first behavior must remain the default. |
| Public demo safety | Demo plans require realistic output but public-safe assets. | P8 remains blocked until dependencies land and must avoid sensitive project data. |

## Canonical Command Policy Draft

The pending command decision is `openlag-0-5x-open-freeze-command`.

P0 adopts this draft policy for documentation consistency:

1. Use `freeze` as the concept name for a deterministic documentation snapshot.
2. List `openlag freeze` as implemented only for Markdown output after P1.
3. Treat `export` as terminology for the internal/export model or as a possible future alias, not as the primary command.
4. Keep generated freeze outputs under `dist/openlag/exports/` unless P1 discovers a stronger implementation constraint.
5. Keep PDF support out of P1 unless Markdown freeze is already stable.

## Compatibility Guardrails

- Preserve dynamic artifact contracts in `docs/artifacts/*.yaml`.
- Preserve YAML relation contracts in `docs/relations/*.yaml`.
- Keep `SPECIFICATION.md` in English.
- Keep human documentation in Markdown.
- Do not require a backend for core OpenLAG usage.
- Prefer specific relation contracts over generic `RELATES_TO`.
- Do not claim proposed features as shipped behavior in README, SPECIFICATION, or Spanish documentation.

## P5 Governance Compatibility Matrix

| Governance family | Current state | Source of truth |
| --- | --- | --- |
| RISK | IMPLEMENTED | `docs/artifacts/RISK.yaml` |
| CHECK | IMPLEMENTED | `docs/artifacts/CHECK.yaml` |
| REVIEW | IMPLEMENTED | `docs/artifacts/REVIEW.yaml` |
| EVIDENCE | IMPLEMENTED | `docs/artifacts/EVIDENCE.yaml` |
| INCIDENT | IMPLEMENTED | `docs/artifacts/INCIDENT.yaml` |
| GAP | IMPLEMENTED | `docs/artifacts/GAP.yaml` |
| VIOLATION | IMPLEMENTED | `docs/artifacts/VIOLATION.yaml` |
| DEBT | IMPLEMENTED | `docs/artifacts/DEBT.yaml` |
| OBSERVATION | IMPLEMENTED | `docs/artifacts/OBSERVATION.yaml` |
