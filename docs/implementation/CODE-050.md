---
id: CODE-050
type: CODE_ENTITY
status: ready
title: OpenLAG 0.5.0 Lifecycle CLI Workflows
version: VER-050
description: "CLI and generation workflows implementing the 0.5.0 lifecycle features."
ownership:
  owner: donartcha
  team: openlag
relations:
  - type: IMPLEMENTS
    to: FEAT-051
  - type: IMPLEMENTS
    to: FEAT-052
  - type: IMPLEMENTS
    to: FEAT-053
  - type: IMPLEMENTS
    to: FEAT-054
  - type: IMPLEMENTS
    to: FEAT-055
---

# OpenLAG 0.5.0 Lifecycle CLI Workflows

This implementation artifact represents the CLI, contract generation, portal generation, profile loading, and freeze/export workflows that deliver the 0.5.0 lifecycle model.

The concrete implementation spans `scripts/cli`, `scripts/core`, `profiles`, `src/core/generated`, and the generated runtime payloads under `public`.
