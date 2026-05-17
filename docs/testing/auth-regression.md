---
id: ver-tst-1
type: TEST
subType: Test Case
title: Auth Regression Suite
version: v-1
relations:
  - to: impl-ctr-1
    type: TESTS
ownership:
  owner: pcaro
  team: architecture
---
Suite de pruebas unitarias e integración para el flujo de autenticación.

## Cobertura
* Registro exitoso.
* Fallo por email duplicado.
* Fallo por contraseña débil.
