---
id: ops-inc-fix-1
type: CODE_ENTITY
subType: Patch
title: ConnectionPoolFix
version: v-2
relations:
  - to: ops-inc-1
    type: FIXES
  - to: impl-repo-1
    type: IMPLEMENTS
ownership:
  owner: pcaro
  team: architecture
---
Incremento del pool de conexiones de la base de datos de 10 a 50 para evitar timeouts bajo carga.

## Cambios
* Se modificó `datasource.ts`.
* Se añadió monitoreo de pool en Prometheus.
