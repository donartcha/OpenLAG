---
id: impl-repo-1
type: REPOSITORY
title: UserRepository.java
version: v-1
systemVersionId: sv-db-pg-15
ownership:
  owner: pcaro
  team: backend-team
relations:
  - to: req-res-1
    type: IMPLEMENTS
  - to: impl-cls-1
    type: USES
  - to: impl-dao-user
    type: USES
---
Domain-oriented repository that manages User persistence logic. It abstracts the complexity of the DAO.
