---
id: COMP-021
type: COMPONENT
version: VERSION-001
status: in_progress
layer: ARCHITECTURE
title: Lifecycle Strategy Engine
description: |
  A default engine implementing the lifecycle sorting logic:
  VISION -> PROJECT -> VERSION -> EPIC -> REQUIREMENT -> USE_CASE -> DECISION -> DESIGN -> COMPONENT -> FEATURE -> CODE_ENTITY -> TEST_CASE -> RISK -> CHANGELOG
ownership:
  owner: donartcha
  team: architecture
tags:
  - component
  - algorithms
relations:
  - type: RELATES_TO
    to: DEC-010
    strength: STRONG
    category: TRACEABILITY
---
