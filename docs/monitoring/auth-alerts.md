---
id: mon-auth-99
type: ALERT
title: Auth Error Rate > 5%
version: v-1
relations:
  - to: impl-api-1
    type: MONITORS
ownership:
  owner: pcaro
  team: architecture
---
Alerta configurada en Prometheus para detectar picos de error en el endpoint de registro.
