# OpenLAG 0.4.0 Release Baseline Audit

## Branch

- Branch audited: main
- Audit branch: audit/openlag-0.4.0-release-baseline
- Expected version: 0.4.0

## Validation

- npm.cmd install: passed
- npm.cmd run check: failed
- openlag check --profile release --strict: passed
- node bin/openlag.js --version: passed, returned 0.4.0
- npm.cmd pack --dry-run: passed
- npx.cmd @donartcha/openlag generate: passed
- npx.cmd @donartcha/openlag build: passed

## Scope observed

OpenLAG 0.4.0 baseline includes:

- project-local artifact contract loading from docs/contracts/artifacts/*.yaml or the then-active root documentation contract layout
- relation contract runtime payload generation
- richer lint report data
- dynamic contract metadata in the portal
- openlag init --all support

## Repository-as-project note

In 0.4.0, the OpenLAG project dataset existed directly under repository-root docs/.
This is treated as the historical baseline for the self-documenting OpenLAG repository.

## Conclusion

main can be considered a valid OpenLAG 0.4.0 release baseline for the OpenLAG-specific release profile and package generation checks. The broader 
pm.cmd run check baseline is not clean because ESLint scans generated sandbox build output under internal/dev-sandbox/dist; this is recorded as a baseline limitation rather than changed on the audit branch.
