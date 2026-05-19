# Security Policy

OpenLAG generates static architecture documentation from Markdown and YAML files.

The generated portal can expose every artifact, relation, incident, component name, deployment detail, and operational note present in `docs/`. Treat the generated `dist/` output as sensitive when your source documentation describes internal systems.

## Do Not Store Secrets

Do not include secrets in OpenLAG Markdown, YAML, generated JSON, or metadata files.

Avoid committing:

- passwords,
- API keys,
- access tokens,
- private URLs,
- customer data,
- credentials,
- production incident details that should not be public.

## Deployment Guidance

If your architecture documentation is internal, publish the generated portal behind appropriate access controls such as SSO, VPN, private hosting, or static hosting authentication.

## Reporting Vulnerabilities

Report security issues through the GitHub issue tracker:

https://github.com/donartcha/OpenLAG/issues

If a report contains sensitive details, avoid posting secrets or exploit material publicly. Open a minimal issue first so maintainers can coordinate a private disclosure path.
