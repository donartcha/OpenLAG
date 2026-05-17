---
id: ch-auth-pool
type: CHANGE
changeType: ERROR
title: Resolución de Timeouts en Auth API
affects:
  - impl-dao-user
  - sv-db-pg-15
versionFrom: v-1
versionTo: v-2
ownership:
  owner: pcaro
  team: architecture
relations:
  - type: RELATES_TO
    to: arch-overview
---
Se identificó que el pool de conexiones de la base de datos era insuficiente para el volumen de tráfico de v1.0.0.

---
id: ch-ui-refactor
type: CHANGE
changeType: FEATURE
title: Refactor de Componentes UI Core
affects: ["impl-ui-button", "sv-ui-lib-2.3"]
versionFrom: "v-1"
versionTo: "v-2"
---
Migración de los componentes de botón y layouts a la nueva librería compartida Shared-UI-Lib v2.3.1 para asegurar consistencia visual.

---
id: ch-compliance-update
type: CHANGE
changeType: EVOLUTION
title: Ajustes de Cumplimiento GDPR
affects: ["impl-dao-user", "req-res-1", "req-func-1"]
versionFrom: "v-1"
versionTo: "v-2"
---
Actualización de dependencias y refactorización del DAO para asegurar la anonimización de datos. Impacta relaciones de fuerza débil y media.
