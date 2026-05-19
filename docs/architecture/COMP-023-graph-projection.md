---
id: COMP-023
type: COMPONENT
version: VERSION-001
status: draft
layer: IMPLEMENTATION
title: Graph Projection Engine
description: |
  Wraps the raw parsed graph and executes the selected strategy (from the registry) to output rendering-friendly artifacts and groupings.
ownership:
  owner: donartcha
  team: architecture
tags:
  - component
  - projection
relations:
  - type: RELATES_TO
    to: DEC-012
    strength: STRONG
    category: TRACEABILITY
---
