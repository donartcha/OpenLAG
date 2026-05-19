# Contributing

Thanks for helping improve OpenLAG.

## Local Setup

```bash
git clone https://github.com/donartcha/OpenLAG.git
cd OpenLAG
npm install
```

## Development

Generate graph data:

```bash
npm run generate
```

Run the development portal:

```bash
npm run dev
```

Build the package outputs:

```bash
npm run build
```

## Validation

Run the full validation suite before opening a pull request:

```bash
npm run check
node bin/openlag.js --version
npm pack --dry-run
```

For architecture documentation validation:

```bash
node --import tsx scripts/cli/openlag.ts check --profile develop
node --import tsx scripts/cli/openlag.ts check --profile release --strict
```

## Pull Requests

Please keep pull requests focused and include:

- a short description of the change,
- relevant validation output,
- updates to public documentation when commands, artifact formats, relation contracts, or package behavior change.

Do not include secrets, local machine paths, private credentials, or generated artifacts unrelated to the change.
