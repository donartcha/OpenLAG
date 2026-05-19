---
id: VERSION-001
type: VERSION
name: Baseline VERSION-001
timestamp: 2026-05-18
parentVersion: null
layer: GOVERNANCE
ownership:
  owner: donartcha
  team: architecture
tags:
  - mcp
  - ai
  - memory
  - snapshot
  - architecture
relations:
  - type: RELATES_TO
    to: PROJ-001
---

# mcp-memory 1.0.0-SNAPSHOT

## Descripción

`1.0.0-SNAPSHOT` representa el estado inicial evolutivo del ecosistema `mcp-memory`.

No representa una release estable ni un producto finalizado.

Representa:
- la fundación arquitectónica,
- el modelo inicial de dominio,
- las primeras decisiones estructurales,
- y la dirección conceptual del sistema.

La arquitectura, relaciones y componentes descritos en esta versión están sujetos a evolución continua.

## Objetivo

Validar y construir progresivamente una infraestructura modular y persistente de memoria para agentes IA compatibles con MCP.

## Estado

La versión se encuentra actualmente en:
- exploración arquitectónica,
- definición de dominio,
- modelado de contratos,
- y construcción incremental del núcleo.

## Áreas iniciales

Las primeras áreas contempladas son:

- Núcleo de memoria (`mcp-memory-core`)
- Servidor MCP (`mcp-memory-server`)
- Proveedor MariaDB inicial
- Contratos de almacenamiento
- Namespaces
- Retrieval básico
- Configuración desacoplada
- Auditoría inicial
- Documentación Architecture as Code mediante OpenLAG

## Filosofía

La prioridad inicial es:
- arquitectura limpia,
- separación de responsabilidades,
- extensibilidad,
- trazabilidad,
- y gobernanza futura.

La complejidad avanzada:
- embeddings,
- grafos,
- retrieval semántico,
- memoria distribuida,
- y políticas complejas,

queda explícitamente fuera del alcance inicial.

## Evolución esperada

Esta línea SNAPSHOT evolucionará progresivamente hacia:
- releases alpha,
- beta,
- y posteriormente una release estable.

## Relación con OpenLAG

OpenLAG actúa como:
- sistema de trazabilidad,
- documentación viva,
- grafo arquitectónico,
- y motor de evolución documental

del ecosistema `mcp-memory`.
