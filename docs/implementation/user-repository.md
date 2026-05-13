---
id: impl-repo-1
type: CODE_ENTITY
subType: "Repository"
title: "UserRepository.java"
version: v-1
systemVersionId: sv-db-pg-15
relations:
  - to: impl-cls-1
    type: USES
  - to: impl-dao-user
    type: USES
---
Domain-oriented repository that manages User persistence logic. It abstracts the complexity of the DAO.
