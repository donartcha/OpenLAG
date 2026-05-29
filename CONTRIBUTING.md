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

## Static Dist Serving

Generated `dist/` folders are static outputs and may be served locally with a simple static server:

```bash
cd internal/dev-sandbox/dist
python3 -m http.server 8080
```

Alternative using Node:

```bash
npm install -g serve
serve /internal/dev-sandbox/dist
```

or:

```bash
cd /internal/dev-sandbox/dist
serve .
```

This serves the already generated static portal.

## Recommended Development Preview Workflow

When actively evolving an OpenLAG project, use this workflow:

```bash
cd internal/dev-sandbox
npx @donartcha/openlag generate
npx @donartcha/openlag build
npx vite preview
```

This regenerates:

- `public/graph-data.json`
- runtime payloads
- freeze/runtime artifacts
- the static portal build

Then serves a production-like preview.

Use static `dist/` serving when you only need to inspect an already generated output. Use the regenerate + build + preview flow when validating current source changes.

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

## Branch Policy

OpenLAG uses a GitFlow-style release workflow:

| Branch | Purpose |
| --- | --- |
| `main` | Published, stable versions only. This branch is protected. |
| `develop` | Integration branch for completed changes targeting the next version. |
| `feature/*` | A focused feature or improvement. |
| `fix/*` | A small non-release fix. |
| `release/x.y.z` | Release freeze, strict validation, version bump, changelog, and publication prep. |
| `hotfix/x.y.z` | Urgent patch starting from `main`. |

Contributors should branch from `develop`:

```bash
git checkout develop
git pull origin develop
git checkout -b feature/openlag-impact-report
```

During development, use the local workflow:

```bash
npm install
npm run generate
npm run dev
node --import tsx scripts/cli/openlag.ts check --profile feature
```

Before pushing a branch:

```bash
npm run check
git status
git add .
git commit -m "feat: add impact report workflow"
git push -u origin feature/openlag-impact-report
```

Contributors must:

1. Fork the repository or create a feature branch.
2. Open a Pull Request targeting `develop`.
3. Wait for CI to pass.
4. Wait for maintainer review.
5. Never push directly to protected branches.

Only maintainers may approve and merge Pull Requests.

## Pull Requests

Please keep pull requests focused and include:

- a short description of the change,
- the OpenLAG artifacts touched,
- relevant validation output,
- updates to public documentation when commands, artifact formats, relation contracts, or package behavior change.

Do not include secrets, local machine paths, private credentials, or generated artifacts unrelated to the change.

A useful Pull Request template is:

````markdown
## Summary
- What changed.
- Which OpenLAG artifacts changed.
- Which commands were validated.

## Validation
```bash
npm run check
node --import tsx scripts/cli/openlag.ts check --profile develop
```
````

## Release Workflow

When `develop` is ready for publication, maintainers create a release branch:

```bash
git checkout develop
git pull origin develop
git checkout -b release/0.4.0
```

Update the package version without creating a Git tag yet:

```bash
npm version 0.4.0 --no-git-tag-version
```

Update release-facing documentation:

- `CHANGELOG.md`
- `README.md`
- `SPECIFICATION.md`, when contracts or behavior change
- `CONTRIBUTING.md`, when the contribution or release flow changes

Run strict release validation:

```bash
npm run generate
node --import tsx scripts/cli/openlag.ts check --profile release --strict
npm run check
node bin/openlag.js --version
npm pack --dry-run
```

Required release checklist:

```text
[ ] package.json has the expected version.
[ ] openlag --version returns the expected version.
[ ] CHANGELOG.md has an entry for the new version.
[ ] README.md reflects the current commands.
[ ] SPECIFICATION.md is updated if the contract changed.
[ ] npm pack --dry-run does not include unwanted internal files.
[ ] docs/, public/, and dist/ contain no secrets.
```

Merge the release to `main`. The publish workflow validates the merged commit, creates the `v0.4.0` tag, and publishes to NPM automatically:

```bash
git checkout main
git pull origin main
git merge --no-ff release/0.4.0
git push origin main
```

Wait for `.github/workflows/publish-npm.yml` to finish. It must create the release tag and publish the package through npm Trusted Publisher before `main` is synced back to `develop`:

```bash
git fetch origin main --tags
npm view @donartcha/openlag@0.4.0 version --registry=https://registry.npmjs.org/

git checkout develop
git pull origin develop
git merge --no-ff main
git push origin develop
```

## NPM Publication

OpenLAG publishes to NPM from GitHub Actions with npm Trusted Publisher. This uses OpenID Connect (OIDC) instead of a long-lived npm token and avoids local OTP prompts during release work.

Repository maintainers must configure npm package access for `@donartcha/openlag`:

- Publisher: GitHub Actions
- Organization or user: `donartcha`
- Repository: `OpenLAG`
- Workflow filename: `publish-npm.yml`
- Allowed action: `npm publish`

The workflow does not require `NPM_TOKEN`. Keep `permissions: id-token: write` in the workflow so GitHub Actions can request the OIDC token that npm validates. The workflow also needs `contents: write` so it can create and push the release tag after the `main` merge is validated. Trusted Publisher requires npm CLI `11.5.1` or later, so the workflow runs on Node.js 24.

The publish workflow is `.github/workflows/publish-npm.yml`. Its normal release trigger is a `push` to `main`, usually produced by merging a reviewed `release/*` or `hotfix/*` branch. It can also run from an existing release tag such as `v0.4.0`, or manually from GitHub Actions with `expected_version` set to the package version.

Before publishing, the workflow verifies:

- `package.json` version matches the tag, manual `expected_version`, or `main` release version.
- The exact package version is not already present in the npm registry.
- `npm ci`, `npm run check`, `node bin/openlag.js --version`, and `npm pack --dry-run` pass.
- For `main` merges, the workflow creates and pushes `v<package.json version>` after validation and before publishing.

For local package inspection before triggering the workflow, run:

```bash
npm pack --dry-run
```

Manual publication from a developer machine is now a fallback only:

```bash
npm publish --access public
```

Confirm the published version and package metadata:

```bash
npm view @donartcha/openlag version
npm view @donartcha/openlag
```

Then test a real installation in a temporary directory:

```bash
mkdir /tmp/openlag-release-test
cd /tmp/openlag-release-test

npx @donartcha/openlag@latest init --name "Release Test"
npx @donartcha/openlag@latest generate
npx @donartcha/openlag@latest lint
npx @donartcha/openlag@latest build
```

## Hotfix Workflow

Urgent patches start from `main`:

```bash
git checkout main
git pull origin main
git checkout -b hotfix/0.4.1
```

After applying the fix:

```bash
npm version 0.4.1 --no-git-tag-version
npm run check
node --import tsx scripts/cli/openlag.ts check --profile release --strict
npm pack --dry-run

git add .
git commit -m "fix: patch critical release issue"

git checkout main
git merge --no-ff hotfix/0.4.1
git push origin main

# GitHub Actions validates main, creates v0.4.1, and publishes through npm Trusted Publisher.

git checkout develop
git fetch origin main --tags
git merge --no-ff main
git push origin develop
```

## Practical Rules

- Do not publish from `develop`; it is an integration branch, not a published version.
- Do not create release tags manually for the normal release path; the publish workflow creates the tag from `main` after validation.
- Do not publish without a `release/*` branch, except for urgent `hotfix/*` patches.
- Do not introduce feature work inside `release/*`; limit it to version bumps, changelog updates, docs, blocking fixes, and packaging adjustments.
- Do not commit `dist/` unless maintainers explicitly decide the project needs generated output in Git.
- Nothing enters `main` unless it passes `npm run check`, `openlag check --profile release --strict`, `node bin/openlag.js --version`, and `npm pack --dry-run`.
