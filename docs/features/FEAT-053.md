---
id: FEAT-053
type: FEATURE
status: ready
title: Profile Packs
version: VER-050
description: "OpenLAG 0.5.0 packages reusable architecture, governance, starter, and domain profiles."
ownership:
  owner: donartcha
  team: openlag
relations:
  - type: REFINES
    to: CHG-050
---

# Profile Packs

Profile packs make OpenLAG usable across different documentation domains without forcing every project to hand-author the same contracts.

The root project uses the core contracts as its own lifecycle vocabulary and keeps the dev sandbox as a separate validation dataset.
