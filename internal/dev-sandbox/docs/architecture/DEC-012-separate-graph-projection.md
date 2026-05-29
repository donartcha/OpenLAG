---
id: DEC-012
type: DECISION
version: VERSION-001
status: closed
layer: ARCHITECTURE
title: Separate graph structure from projection
description: |
  The base graph remains immutable during visualization. What changes is the graph projection, order, grouping, and navigation. We decouple graph storage from graph projection.
ownership:
  owner: donartcha
  team: architecture
tags:
  - architecture
  - graph
relations:
  - type: JUSTIFIES
    to: DESIGN-010
    strength: STRONG
    category: SEMANTIC
---
