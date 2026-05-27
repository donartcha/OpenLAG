---
id: impl-ctr-1
type: CONTROLLER
title: AuthController.ts
version: v-1
relations:
  - to: des-con-1
    type: RELATES_TO
  - to: impl-api-1
    type: IMPLEMENTS
  - to: req-br-1
    type: RELATES_TO
ownership:
  owner: pcaro
  team: architecture
---
Controlador encargado de orquestar la lógica de negocio de autenticación.
1. Recibe el Request.
2. Valida Reglas de Negocio (Edad).
3. Invoca al Servicio.
