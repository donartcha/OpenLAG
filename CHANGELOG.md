# Changelog

All notable changes to OpenLAG are documented in this file.

## 0.5.1 - 2026-05-28

### Added
- Added local preview and static serving guidance to official documentation (`README.md`, `CONTRIBUTING.md`, `DOCUMENTACION_OPENLAG.md`) covering:
  - static serving of an existing `dist/` output,
  - the recommended regenerate + build + preview workflow for active development.
- Added the same starter-focused preview/serving guidance to the React portal onboarding section "OpenLAG Lite Happy Path (Starter)".
- Added `rule-definitions.json` generation to the `openlag generate` output pipeline.

### Changed
- Moved the repository sample OpenLAG project from root `docs/` into `internal/dev-sandbox/docs` as an internal development sandbox dataset.
- Updated runtime behavior documentation in `SPECIFICATION.md` to explicitly distinguish static `dist/` serving vs regeneration/rebuild preview workflow.
- Updated `openlag build` contract regeneration step to include rules alongside artifact and relation contracts.
- Improved contract regeneration warnings in `openlag build` and `openlag dev` to include the underlying error reason and explicit fallback behavior.

### Fixed
- Fixed `openlag generate` contract path resolution to read from:
  - `docs/contracts/artifacts`
  - `docs/contracts/relations`
  instead of legacy non-contract paths, so project contract JSON payloads are produced correctly.
- Fixed missing runtime contract payload generation by ensuring `openlag generate` emits:
  - `public/artifact-definitions.json`
  - `public/relation-definitions.json`
  - `public/rule-definitions.json`
  - `public/graph-data.json`
- Fixed opaque fallback behavior by adding explicit warnings when a contract family is missing from `docs/contracts/**` and no local `public/*-definitions.json` fallback file exists.

## 0.5.0 - 2026-05-26

### Added
- Added `openlag init --starter` as an OpenLAG Lite onboarding path with a minimal contract scaffold for new teams: 4 artifact types (`REQUIREMENT`, `FEATURE`, `CODE_ENTITY`, `TEST_CASE`), 4 relations (`REFINES`, `IMPLEMENTS`, `TESTS`, `DEPENDS_ON`), and one starter export profile (`starter`).
- Added the official `openlag freeze` subsystem with export profiles, dry-run support, deterministic frozen document model generation, and `markdown`, `json`, `html`, and `pdf` output in the command directory or explicit `--output` path.
- Added executable rule contracts under `docs/contracts/rules/*.yaml`, generated rule registries, profile-gated runtime validation, and normalized `warn`/`warning` severity handling.
- Added bundled profile/template assets for `core`, `governance`, `mvc`, `hexagonal`, and related profile packs, including deterministic `openlag profile add` and `openlag profile validate` workflows.
- Added invalid validation fixtures under `tests/fixtures/invalid/` to prove expected governance failures without keeping the main OpenLAG dataset broken.
- Added Playwright lifecycle stabilization through an explicit test runner so portal smoke tests and documentation screenshots terminate cleanly.
- Added OpenLAG logo and favicon assets to the generated Vite portal and package metadata.
- Added professional freeze template rendering for HTML and PDF exports, including branded cover pages, executive summary text from export profiles, artifact cards, relation lists, and UTF-8-safe documentary output.
- Added in-memory offline vendor injection for Marked and Mermaid so exported HTML/PDF documentary outputs do not depend on CDN, internet access, ESM imports, or a local server while keeping the source freeze template editable.
- Added a parameterized freeze template system with technical manual, executive brief, audit dossier, and knowledge map documentary layouts that share the same rendering contract and offline export pipeline.
- Added expanded `--help` usage examples and notes for every `openlag` command and subcommand, including profile, authoring, impact, and freeze workflows.
- Added deterministic freeze test controls for generation timestamps while keeping production freeze output timestamped with the real generation time.

### Changed
- Updated documentation and in-product guide content to include a newcomer "Happy Path" based on OpenLAG Lite starter workflows.
- Promoted the stabilized OpenLAG 0.5.0 runtime model: lightweight core, optional governance, optional impact engine, optional authoring tooling, and official freeze/export.
- Normalized canonical contract paths to `docs/contracts/artifacts`, `docs/contracts/relations`, `docs/contracts/rules`, and `docs/contracts/export-profiles`.
- Updated the main reference dataset so `openlag check --profile release --strict` passes with no lint findings.
- Updated README, specification, and project documentation to describe 0.5.0 implemented behavior instead of treating stabilized 0.5.0 capabilities as future 0.5.x roadmap work.
- Updated the portal guide to reflect the OpenLAG 0.5.0 specification, including semantic layers, contract-driven paths, profile commands, rule contracts, and freeze/export behavior.
- Extended export profiles with optional `template`, `branding`, `document`, `executiveSummary`, `footer`, and rendering controls while keeping older export profiles compatible.
- Clarified freeze/export documentation across the README, specification, Spanish technical documentation, portal guide, default export profile, and freeze template README, including `--output`, `--template`, offline HTML/PDF rendering, and the boundary between export profiles and templates.
- Updated bundled freeze templates from compact single-line sources into readable, maintainable standalone HTML templates with richer print, navigation, artifact card, relation, and responsive styling.
- Changed freeze output resolution so default exports are written as `openlag-<profile>.<format>` in the command directory, while explicit output directories preserve template-aware filenames such as `openlag-architecture-technical-manual.html`.
- Kept Markdown body content separate from artifact descriptions so freeze cards without `description` do not display the full body as a promoted summary.
- Added repository-level freeze visual audit utility (`scripts/qa/run-freeze-visual-audit.py`) with CLI parameters to run deterministic PDF QA from project root without hardcoded local paths.

### Fixed
- Corrected freeze export behavior across CLI/core flow to keep generated outputs aligned with the expected profile/template mapping.
- Updated export profile contracts (`compliance`, `developer`, `executive`, `governance`, `release`) to match the corrected export behavior.
- Updated freeze screenshot E2E coverage to validate the corrected export outputs.
- Fixed print CSS in freeze templates to remove edge-clipping risk, improve print margins/pagination, and prevent near-empty orphan pages in generated PDFs (`freeze-template`, `knowledge-map`).
- Reduced print-time visual fragmentation across freeze templates to keep semantic cards/metadata blocks together and avoid header/content splits between pages.

### Removed
- Removed Typst, jsPDF, html2canvas, and html-to-image from the 0.5.0 freeze/export public contract and dependencies.

## 0.4.0 - 2026-05-22

### Added
- Added project-local artifact contract loading from `docs/contracts/artifacts/*.yaml`, including generated runtime payloads in `public/artifact-definitions.json`.
- Added relation contract runtime payload generation in `public/relation-definitions.json` for static portal consumption.
- Added richer lint report data to generated graph output for `draft`, `develop`, `feature`, and `release` profiles.
- Added default and optional artifact contract scaffolding to `openlag init`, including a `CUSTOM_TYPE` example for user-defined contracts.
- Added support for `openlag init --all` to scaffold optional official artifact contracts alongside optional relations.

### Changed
- Updated `openlag generate`, `openlag lint`, `openlag check`, and portal initialization to resolve artifact and relation contracts from the active project.
- Updated portal artifact grouping, settings, orphan detection, documentation views, and type coloring to use dynamic contract metadata and runtime JSON payloads.
- Refined relation defaults so `DOCUMENTS` targets the base artifact universe by default and expands when optional contracts are generated.
- Updated Specification `v0.3` and Spanish project documentation with the contract runtime model, static JSON payloads, lint diagnostics, and `init` behavior.
- Removed a stray temporary `fix2.ts` file from the package workspace.

## 0.3.0 - 2026-05-19

### Breaking Changes
- Promoted OpenLAG to Specification `v0.2`; the previous `v0.1` artifact model is deprecated and no longer considered valid for new projects.
- Replaced loose `subType`-based modeling with contract-driven artifact types backed by generated artifact definitions.
- Enforced relation `allowedFrom` and `allowedTo` contracts during linting, making invalid semantic edges visible according to the selected profile.

### Added
- Added contract-driven artifact registry generation through `scripts/generate-artifacts.ts` and `src/core/generated/artifact-definitions.ts`.
- Added support for custom artifact contracts under `docs/contracts/artifacts/*.yaml`, including type extension, layer assignment, required fields, and default impact metadata.
- Added `openlag impact` for contract-driven impact analysis by artifact id, source file, or Git diff range.
- Added Markdown and JSON output modes for impact analysis, enabling local review and CI consumption.
- Added bidirectional impact propagation based on relation contract metadata: `impact.propagates`, `impact.directions`, and `impact.weight`.
- Added default metadata color override support through `metadata.json` `typeColors`.

### Changed
- Updated `openlag dev`, `openlag build`, `openlag generate`, and `npm run check` to regenerate artifact and relation contracts before running.
- Updated `openlag init` scaffolding with artifact contract examples and default visual type colors.
- Migrated sample documentation away from legacy `subType` fields to real contract-backed types such as `DAO`, `DTO`, `CONTROLLER`, `API_ROUTE`, `BUSINESS_RULE`, `INTEGRATION_TEST`, `KUBERNETES`, and `CI_PIPELINE`.
- Normalized sample artifact statuses to the official lifecycle values: `draft`, `in_progress`, `ready`, `closed`, and `deprecated`.
- Updated sample relation usage to satisfy stricter `allowedFrom` and `allowedTo` validation.
- Refactored parser, normalizer, linter, UI grouping, graph colors, and visualization strategies to use dynamic artifact contracts and semantic layers.
- Extended semantic layers with `VERIFICATION` and `GOVERNANCE` to support richer lifecycle and release modeling.
- Updated `SPECIFICATION.md`, `DOCUMENTACION_OPENLAG.md`, and `README.md` to document contract-driven artifacts, relation enforcement, visualization strategies, and `openlag impact`.
- Regenerated relation definitions from the updated YAML contracts.

### Deprecated
- Deprecated OpenLAG `v0.1` specification usage and the `0.1.x` package line. Projects should upgrade to `@donartcha/openlag@0.3.0` and migrate `subType` values to contract-backed `type` values.

## 0.2.0 - 2026-05-19

### Added
- Added GitHub collaboration governance with CODEOWNERS, pull request and issue templates, and mandatory CI for `main`.

### Changed
- Translated `SPECIFICATION.md` to English and expanded architectural definitions, scalability guidelines, CI/CD integration, and timeline versioning rules.
- Refined relational contracts (`IMPLEMENTS`, `TESTS`, `REFINES`, `FIXES`, `JUSTIFIES`, `DOCUMENTS`) with stricter mappings aligned to the new specification.
- Updated `ALLOWED_TO` and `ALLOWED_FROM` constraints on core traceability relations to reduce semantic pollution and tighten graph validation.
- Documented the protected `main` branch policy for contributors.
- Made `npm run check` build the CLI before tests so validation works in clean CI checkouts.

## 0.1.8 - 2026-05-19

### Changed

- Corrected and verified `openlag --version` release behavior through the packaged CLI entrypoint.
- Improved public NPM documentation with complete install, usage, lint, and artifact examples.
- Added NPM package metadata for repository, issues, homepage, author, and package discovery.
- Added `CHANGELOG.md`, `SECURITY.md`, and `CONTRIBUTING.md` to the public package documentation set.
- Cleaned public examples to use `relations[].to` instead of `target`.
- Published `SPECIFICATION.md` as package reference documentation.
- Normalized public test artifacts and relation contracts to use `TEST_CASE` instead of the legacy `TEST` artifact type.

## 0.1.7

### Changed

- Stabilized the package layout for the scoped NPM package `@donartcha/openlag`.
- Improved CLI packaging around the `openlag` global binary.
- Refined relation contract generation and static portal build flow.

## 0.1.6

### Changed

- Improved static graph generation and package dry-run validation.
- Refined generated portal assets for NPM packaging.

## 0.1.5

### Changed

- Expanded documentation and architecture examples.
- Improved CLI workflows for generation, linting, and build preparation.

## 0.1.4

### Changed

- Added relation contract coverage and graph metadata improvements.
- Continued cleanup of package contents for public distribution.

## 0.1.3

### Changed

- Improved build artifacts and package structure.
- Refined static portal generation behavior.

## 0.1.2

### Changed

- Added incremental CLI and documentation refinements.
- Improved generated graph data workflow.

## 0.1.1

### Changed

- Added early packaging fixes after the initial package layout.
- Improved command wiring for local and global CLI usage.

## 0.1.0

### Added

- Initial OpenLAG package release.
- Added `openlag` CLI entrypoint.
- Added Markdown/YAML driven Architecture as Code graph generation.
- Added static portal build workflow.
- Added initial relation linting and traceability validation.
