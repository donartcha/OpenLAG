---
id: DESIGN-012
type: DESIGN
version: VERSION-001
status: draft
layer: ARCHITECTURE
title: Strategy Resolution Pipeline
description: |
  The sequence of steps executed when a user selects a visualization mode.
  1. Retrieve Strategy from Registry.
  2. Invoke Strategy.resolve(graph).
  3. Apply filters / bounding box.
  4. Return projected artifacts and groupings.
ownership:
  owner: donartcha
  team: architecture
tags:
  - design
  - pipeline
relations:
  - type: DERIVES_FROM
    to: DESIGN-010
    strength: STRONG
    category: TRACEABILITY
---
