---
id: test-auth-01
type: TEST
subType: Integration Test
title: AuthController Integration Test
version: v-1
relations:
  - to: impl-ctr-1
    type: TESTS
ownership:
  owner: pcaro
  team: architecture
---
Verifica que el controlador de autenticación maneja correctamente los casos de éxito y error, incluyendo la restricción de edad req-br-1.
