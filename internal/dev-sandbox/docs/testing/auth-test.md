---
id: test-auth-01
type: INTEGRATION_TEST
title: AuthController Integration Test
version: v-1
relations:
  - to: req-nfunc-1
    type: TESTS
  - to: impl-ctr-1
    type: TESTS
ownership:
  owner: pcaro
  team: architecture
---
Verifica que el controlador de autenticación maneja correctamente los casos de éxito y error, incluyendo la restricción de edad req-br-1.
