---
id: invalid-forbidden-relation
type: REQUIREMENT
title: Forbidden Relation
status: ready
layer: BUSINESS
ownership:
  owner: test
  team: validation
relations:
  - type: DEPLOYS
    to: invalid-deployment
---
This fixture must fail because business artifacts cannot deploy operational artifacts.
