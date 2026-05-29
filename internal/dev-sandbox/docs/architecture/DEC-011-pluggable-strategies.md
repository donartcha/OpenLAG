---
id: DEC-011
type: DECISION
version: VERSION-001
status: closed
layer: ARCHITECTURE
title: Use pluggable ordering strategies
description: |
  We will implement an extensible model with an Ordering Strategy Registry.
  New strategies, custom plugins, and behavior modifications should be easily pluggable without modifying the core projection pipeline.
ownership:
  owner: donartcha
  team: architecture
tags:
  - architecture
  - extensibility
relations:
  - type: JUSTIFIES
    to: REQ-020
    strength: STRONG
    category: SEMANTIC
---
