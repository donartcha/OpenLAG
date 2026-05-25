# OpenLAG

OpenLAG is an Architecture as Code traceability graph generator.

It reads versioned architecture documentation from Markdown and YAML files, validates relationships between artifacts, generates a static graph data file, and builds a portal for exploring the resulting traceability graph.

The NPM package is published as `@donartcha/openlag`. The global CLI binary installed by the package is `openlag`.

## Package Status

OpenLAG is in active early development. The current release focuses on a clean CLI workflow, static portal generation, relation contracts, lint profiles, graph exploration, and public package documentation.

The tool is designed to be static-first: documentation stays in your repository, OpenLAG generates `public/graph-data.json`, and the portal can be built as static assets.

## 0.5.x Scope Baseline

The canonical 0.5.x scope baseline is documented in [OPENLAG_0.5.x_SCOPE_BASELINE.md](./OPENLAG_0.5.x_SCOPE_BASELINE.md).

That baseline separates implemented behavior from proposed 0.5.x work. In particular, `openlag freeze` / documentation export, PDF generation, Playwright screenshots, expanded governance findings, mass authoring tooling, and evolved impact reports are roadmap items until their implementation phases land.

## Install

Install the CLI globally:

```bash
npm install -g @donartcha/openlag
```

Run without a global install:

```bash
npx @donartcha/openlag init
```

## Quick Start

```bash
mkdir my-architecture
cd my-architecture
npx @donartcha/openlag init --name "My System"
npx @donartcha/openlag generate
npx @donartcha/openlag lint
npx @donartcha/openlag build
```

OpenLAG creates a `docs/` directory with starter architecture documents, artifact contracts, and relation definitions. `openlag generate` writes `public/graph-data.json`, `public/artifact-definitions.json`, and `public/relation-definitions.json`; `openlag build` writes the static portal to `dist/`.

`--name` sets the project display name in `metadata.json`; it does not create a nested folder. Existing relation and artifact contract files are preserved during initialization.

## CLI Usage

Initialize a project:

```bash
openlag init
```

Generate graph data:

```bash
openlag generate
```

Start the development portal with live data regeneration:

```bash
openlag dev
```

Build the static portal:

```bash
openlag build
```

Validate architecture documentation:

```bash
openlag lint
```

Generate data and validate documentation together:

```bash
openlag check
```

Analyze propagated impact from an artifact, file, or Git diff:

```bash
openlag impact --artifact req-registration
openlag impact --from main --to HEAD --json
```

Generate a deterministic Markdown documentation freeze:

```bash
openlag freeze --profile architecture --format markdown
openlag freeze --profile architecture --dry-run
```

Show the installed CLI version:

```bash
openlag --version
```

## Commands

```text
openlag init       Initialize docs, metadata, artifact contracts, and relation definitions
openlag generate   Generate public/graph-data.json
openlag dev        Start the portal dev server with live data refresh
openlag build      Build the static portal
openlag lint       Validate documentation and relations
openlag check      Generate graph data and run OpenLAG lint
openlag impact     Analyze propagated impact from contracts
openlag freeze     Generate deterministic Markdown documentation snapshots
openlag preview    Preview the production build
```

## Documentation Freeze

OpenLAG can generate a Markdown-first documentation freeze from the local graph model and an export profile.

The default profile lives at `docs/export-profiles/architecture.yaml`. Generated files go to `dist/openlag/exports/<profile>/` unless `--output` is provided.

```bash
openlag freeze --profile architecture --format markdown
openlag freeze --profile architecture --output dist/openlag/exports/architecture
openlag freeze --profile architecture --dry-run
```

PDF generation is intentionally not part of the Markdown-first MVP. It is tracked as a later phase and must consume the export model or generated Markdown rather than printing the React portal.

## Lint Profiles

```bash
openlag lint --profile feature
openlag lint --profile develop
openlag lint --profile release --strict
```

- `feature`: relaxed profile for work in progress.
- `develop`: default profile for day-to-day validation.
- `release`: strict profile for release gates.

## Artifact Example

OpenLAG artifacts are Markdown files with YAML frontmatter. Relations use `to` for the destination artifact ID.

```yaml
---
id: req-registration
type: REQUIREMENT
status: ready
layer: BUSINESS
title: User registration
version: v-1
description: Users must be able to create an account with validated data.
ownership:
  owner: product
  team: identity
relations:
  - type: REFINES
    to: epic-identity
---
```

Use `to`, not `target`, in public examples and project documentation.

## Relation Contracts

Relation rules live in `docs/relations/*.yaml`. The default initialization creates the core relation contracts needed for traceability. Optional relation contracts can be added as the project model matures.

Common relations include:

- `IMPLEMENTS`: implementation satisfies a requirement, feature, bug, or API contract.
- `TESTS`: a `TEST_CASE` validates a requirement, feature, code entity, API, bug, or incident.
- `REFINES`: a more concrete artifact refines a broader artifact.
- `FIXES`: a change, component, system version, or code entity fixes a bug, incident, or risk.
- `DOCUMENTS`: documentation describes another artifact.
- `JUSTIFIES`: a decision or rule justifies another artifact.

## Generated Output

```text
public/graph-data.json           Static graph data generated from docs/
public/artifact-definitions.json Project artifact contracts for the portal
public/relation-definitions.json Project relation contracts for the portal
dist/                          Static portal build output
```

The generated portal is static. Protect it appropriately if the source Markdown contains internal architecture, system names, incidents, vulnerabilities, or operational details.

## Repository Documentation

- [Specification](./SPECIFICATION.md): conceptual model, artifact types, relation model, and project structure.
- [0.5.x Scope Baseline](./OPENLAG_0.5.x_SCOPE_BASELINE.md): canonical scope, contradiction matrix, and implemented vs proposed boundaries.
- [Changelog](./CHANGELOG.md): release history.
- [Security](./SECURITY.md): security considerations and vulnerability reporting.
- [Contributing](./CONTRIBUTING.md): local development and PR workflow.

Internal audit notes are intentionally not published as NPM documentation.

## License

MPL-2.0. See [LICENSE](LICENSE).
