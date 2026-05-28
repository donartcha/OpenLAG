---
id: feature-preview-workflow
type: FEATURE
status: ready
title: Preview Workflow
description: "OpenLAG can generate and build a static portal for inspecting architecture graph outputs."
ownership:
  owner: donartcha
  team: openlag
relations:
  - type: REFINES
    to: change-openlag-0.5.0-evolution
---

# Preview Workflow

The preview workflow turns project documentation into graph data and a static portal.

For OpenLAG 0.5.0, the primary preview is generated from repository-root `docs/*`; sandbox previews remain secondary.
