---
id: impl-dao-user
type: CODE_ENTITY
subType: "DAO"
title: "UserJdbcDAO.java"
description: "Low-level Data Access Object that uses JDBC to execute direct SQL queries against the users table."
version: v-1
systemVersionId: sv-db-pg-15
ownership:
  team: backend-team
  owner: bob
relations:
  - to: req-func-1
    type: RELATES_TO
    strength: WEAK
    category: SEMANTIC
  - to: req-res-1
    type: IMPLEMENTS
    strength: MEDIUM
    category: BEHAVIORAL
---
Pure DAO for basic CRUD operations of the User entity in the PostgreSQL database.
