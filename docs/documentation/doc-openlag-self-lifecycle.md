---
id: doc-openlag-self-lifecycle
type: DOCUMENTATION
status: ready
title: OpenLAG Self Lifecycle Documentation
version: openlag-0.5.0
description: "Documents the boundary between the root self-documenting project and the internal dev sandbox."
ownership:
  owner: donartcha
  team: openlag
relations:
  - type: DOCUMENTS
    to: openlag-0.5.0
---

# OpenLAG Self Lifecycle Documentation

The OpenLAG repository root is the primary OpenLAG project for lifecycle documentation.

Root-level `docs/*` captures versions, changes, features, validation evidence, and governance notes for OpenLAG itself.

`internal/dev-sandbox/docs` remains an internal example and regression dataset. It can be generated and built after root validation, but it does not replace the root lifecycle graph.
