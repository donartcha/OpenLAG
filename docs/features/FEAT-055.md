---
id: FEAT-055
type: FEATURE
status: ready
title: Preview Workflow
version: VER-050
description: "OpenLAG can generate and build a static portal for inspecting architecture graph outputs."
ownership:
  owner: donartcha
  team: openlag
relations:
  - type: REFINES
    to: CHG-050
---

# Preview Workflow

The preview workflow turns project documentation into graph data and a static portal.

For OpenLAG 0.5.0, the primary preview is generated from repository-root `docs/*`; sandbox previews remain secondary.
