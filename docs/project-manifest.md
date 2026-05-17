---
project: OpenLAG Demo
---

# Project Manifest

Esta es la configuración central de la arquitectura y el ciclo de vida del proyecto. Sustituye al archivo `archgraph.config.json` para facilitar la lectura y edición manual.

## Versions
Define las iteraciones del grafo arquitectónico.

```yaml
- id: v-1
  name: 1.0.0
  timestamp: "2026-05-06T12:00:00Z"
  parentVersion: null
- id: v-2
  name: 1.1.0
  timestamp: "2026-05-13T12:00:00Z"
  parentVersion: v-1
```

## System Versions
Inventario de versiones reales de los componentes del sistema.

```yaml
- id: sv-auth-1.0
  component: Auth-Service
  version: 1.0.0
  releaseDate: "2026-05-06"
- id: sv-ui-lib-2.3
  component: Shared-UI-Lib
  version: 2.3.1
  releaseDate: "2026-04-15"
- id: sv-notif-0.8
  component: Notification-Worker
  version: 0.8.5-beta
  releaseDate: "2026-05-10"
- id: sv-db-pg-15
  component: PostgreSQL Engine
  version: 15.4
  releaseDate: "2023-08-10"
- id: sv-mq-rb-3.12
  component: RabbitMQ Cluster
  version: 3.12.0
  releaseDate: "2024-01-20"
- id: sv-cache-rd-7.2
  component: Redis Cache
  version: 7.2.4
  releaseDate: "2024-02-15"
- id: sv-search-es-8.12
  component: Elasticsearch Node
  version: 8.12.1
  releaseDate: "2024-03-01"
```

## Changes
Registro de intervenciones, refactors y deudas técnicas abordadas.

```yaml
- id: ch-auth-pool
  type: ERROR
  title: Resolución de Timeouts en Auth API
  description: "Se identificó que el pool de conexiones de la base de datos era insuficiente para el volumen de tráfico de v1.0.0."
  affects: ["impl-dao-user", "sv-db-pg-15"]
  versionFrom: "v-1"
  versionTo: "v-2"
- id: ch-ui-refactor
  type: FEATURE
  title: Refactor de Componentes UI Core
  description: "Migración de los componentes de botón y layouts a la nueva librería compartida Shared-UI-Lib v2.3.1 para asegurar consistencia visual."
  affects: ["impl-ui-button", "sv-ui-lib-2.3"]
  versionFrom: "v-1"
  versionTo: "v-2"
- id: ch-compliance-update
  type: EVOLUTION
  title: Ajustes de Cumplimiento GDPR
  description: "Actualización de dependencias y refactorización del DAO para asegurar la anonimización de datos. Impacta relaciones de fuerza débil y media."
  affects: ["impl-dao-user", "req-res-1", "req-func-1"]
  versionFrom: "v-1"
  versionTo: "v-2"
```
