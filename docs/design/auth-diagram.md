---
id: des-cmp-1
type: DESIGN
subType: Component Diagram
title: Auth Subsystem C4
version: v-1
relations:
  - to: req-func-1
    type: DERIVES_FROM
ownership:
  owner: pcaro
  team: architecture
---
Diagrama C4 del subsistema de autenticación.

```mermaid
C4Context
  Person(user, "User")
  System(auth, "Auth System")
  Rel(user, auth, "Authenticates")
```
