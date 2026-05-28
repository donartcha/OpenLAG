---
id: CODE-055
type: CODE_ENTITY
status: ready
title: Portal Runtime Lifecycle Consumption
version: VER-050
description: "Consumes generated lifecycle payloads in portal views for graph, documentation, impact, and sectioned layer navigation."
ownership:
  owner: donartcha
  team: openlag
relations:
  - type: IMPLEMENTS
    to: FEAT-055
  - type: DEPENDS_ON
    to: CODE-053
  - type: IMPLEMENTS
    to: REQ-050
---

# Portal Runtime Lifecycle Consumption

Represents runtime consumption in `src/components/*` and `src/core/generated/*`.

In 0.5.0, the portal is expected to expose lifecycle structure by layer (architecture, implementation, verification, documentation) from root payloads.

Impact: lifecycle reviews can follow source-to-runtime traceability through generated graph data without switching to branch-level Git analysis.
