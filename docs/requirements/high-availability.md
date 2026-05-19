---
id: req-nfunc-1
type: NON_FUNCTIONAL_REQUIREMENT
title: High Availability
version: v-1
ownership:
  owner: pcaro
  team: architecture
relations:
  - type: RELATES_TO
    to: arch-overview
---
El sistema debe tener un uptime garantizado del 99.9% (Tier 3). Se requiere redundancia geográfica y auto-escalado.
