# Changelog

All notable changes to OpenLAG are documented in this file.

## Unreleased

### Added

- Added GitHub collaboration governance with CODEOWNERS, pull request and issue templates, and mandatory CI for `main`.

### Changed

- Documented the protected `main` branch policy for contributors.

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
