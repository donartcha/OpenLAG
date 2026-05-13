---
id: impl-dao-user
type: CODE_ENTITY
subType: "DAO"
title: "UserJdbcDAO.java"
description: "Low-level Data Access Object that uses JDBC to execute direct SQL queries against the users table."
version: v-1
systemVersionId: sv-db-pg-15
relations:
  - to: sv-db-pg-15
    type: USES
---
Pure DAO for basic CRUD operations of the User entity in the PostgreSQL database.
