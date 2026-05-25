# Changelog

All notable changes to OpenLAG are documented in this file.

## Unreleased

### Changed
- Documented the automated npm release flow where merges to `main` trigger GitHub Actions validation, release tag creation, and Trusted Publisher publication.

## 0.4.0 - 2026-05-22

### Added
- Added project-local artifact contract loading from `docs/artifacts/*.yaml`, including generated runtime payloads in `public/artifact-definitions.json`.
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
- Added support for custom artifact contracts under `docs/artifacts/*.yaml`, including type extension, layer assignment, required fields, and default impact metadata.
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
