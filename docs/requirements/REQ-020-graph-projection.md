---
id: REQ-020
type: REQUIREMENT
version: VERSION-001
status: draft
layer: BUSINESS
title: Multiple Graph Projection Strategies
description: |
  OpenLAG must support multiple ordering and visualization strategies over the same conceptual document graph.
  
  The ordering must not depend on folder structure, file names, timestamps, or physical file structure, but instead be derived from types, semantic relations, lifecycle stages, and metadata.
  
  Mandatory strategies to support:
  - Lifecycle Strategy (DEFAULT)
  - Dependency Strategy
  - Implementation Strategy
  - Validation Strategy
  - Architecture Strategy
  - Governance Strategy
  - Release Strategy
  - Domain Strategy
ownership:
  owner: donartcha
  team: architecture
tags:
  - requirements
  - visualization
relations:
  - type: REFINES
    to: EPIC-011
    strength: STRONG
    category: TRACEABILITY
---
