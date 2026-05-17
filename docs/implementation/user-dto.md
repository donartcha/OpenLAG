---
id: impl-dto-user
type: CODE_ENTITY
subType: DTO
title: UserRegistrationDTO.java
description: Data Transfer Object used to capture user registration data from the API.
version: v-1
relations:
  - to: impl-api-1
    type: DEFINES
ownership:
  owner: pcaro
  team: architecture
---
Object that encapsulates `email`, `password`, and `age` fields for input validation at the registration endpoint.
