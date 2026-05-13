---
id: mon-auth-99
type: MONITORING
subType: "Alert"
title: "Auth Error Rate > 5%"
version: v-1
relations:
  - to: impl-api-1
    type: MONITORS
---
Alerta configurada en Prometheus para detectar picos de error en el endpoint de registro.
