---
id: ci-pipeline-1
type: CI_PIPELINE
title: 'GitHub Actions Workflow: Core Build'
version: v-2
ownership:
  owner: pcaro
  team: architecture
relations:
  - type: RELATES_TO
    to: arch-overview
---
Pipeline automatizada que se dispara en cada Pull Request.
Incluye:
- Linting
- Unit Tests
- Security Scan (Snyk)
