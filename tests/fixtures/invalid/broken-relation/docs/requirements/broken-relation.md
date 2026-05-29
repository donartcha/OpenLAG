---
id: invalid-broken-relation
type: REQUIREMENT
title: Broken Relation
status: ready
ownership:
  owner: test
  team: validation
relations:
  - type: RELATES_TO
    to: missing-target
---
This fixture must fail because the relation target does not exist.
