---
id: ops-inc-1
type: INCIDENT
subType: Incident
title: 'INC-1020: Auth Timeout'
version: v-1
ownership:
  owner: pcaro
  team: sre-team
relations:
  - to: ops-dep-1
    type: BREAKS
---
Se detectaron picos de latencia de hasta 10s en el endpoint `/api/v1/auth/login` durante la hora pico.

## Análisis Raíz
El pool de conexiones a la base de datos se agota prematuramente bajo carga sostenida.
