---
id: openlag-cli-0.5.0-lifecycle-workflows
type: CODE_ENTITY
status: ready
title: OpenLAG 0.5.0 Lifecycle CLI Workflows
version: openlag-0.5.0
description: "CLI and generation workflows implementing the 0.5.0 lifecycle features."
ownership:
  owner: donartcha
  team: openlag
relations:
  - type: IMPLEMENTS
    to: feature-freeze-export
  - type: IMPLEMENTS
    to: feature-rule-contracts
  - type: IMPLEMENTS
    to: feature-profile-packs
  - type: IMPLEMENTS
    to: feature-starter-mode
  - type: IMPLEMENTS
    to: feature-preview-workflow
---

# OpenLAG 0.5.0 Lifecycle CLI Workflows

This implementation artifact represents the CLI, contract generation, portal generation, profile loading, and freeze/export workflows that deliver the 0.5.0 lifecycle model.

The concrete implementation spans `scripts/cli`, `scripts/core`, `profiles`, `src/core/generated`, and the generated runtime payloads under `public`.
