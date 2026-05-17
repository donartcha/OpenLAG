# OpenLAG

OpenLAG is an Architecture as Code traceability graph generator.

It reads versioned architecture documentation from Markdown and YAML files, validates the relationships between artifacts, generates a static graph data file, and builds a portal for exploring the resulting traceability graph.

## Install

```bash
npm install -g @donartcha/openlag
```

You can also run it without a global install:

```bash
npx @donartcha/openlag init
```

## Usage

Initialize a project:

```bash
openlag init
```

Generate graph data:

```bash
openlag generate
```

Validate architecture documentation:

```bash
openlag lint
```

Build the static portal:

```bash
openlag build
```

Run generation and validation together:

```bash
openlag check
```

## Minimal Example

```bash
mkdir my-architecture
cd my-architecture
npx @donartcha/openlag init --name "My System"
npx @donartcha/openlag generate
npx @donartcha/openlag lint
npx @donartcha/openlag build
```

OpenLAG creates a `docs/` directory with starter architecture documents and relation definitions. `openlag generate` writes `public/graph-data.json`, and `openlag build` writes the static portal to `dist/`.

## Commands

```text
openlag init       Initialize docs and relation definitions
openlag generate   Generate public/graph-data.json
openlag lint       Validate documentation and relations
openlag build      Build the static portal
openlag check      Generate graph data and run OpenLAG lint
openlag dev        Start the portal dev server
openlag preview    Preview the production build
```

## Project Status

OpenLAG is in early development. The first public NPM release is intended to establish the CLI workflow and package layout.

## License

MPL-2.0. See [LICENSE](LICENSE).
