---
id: impl-cls-1
type: ENTITY
title: UserEntity.java
version: v-1
ownership:
  owner: pcaro
  team: architecture
relations:
  - type: RELATES_TO
    to: arch-overview
---
Domain entity representing a User in the system.

```typescript
export class User {
  id: string;
  email: string;
  passwordHash: string;
}
```
