---
id: PROJ-001
type: PROJECT
version: VERSION-001
status: draft
layer: BUSINESS
title: "mcp-memory"
description: "Infraestructura modular, persistente, auditable y evolutiva de memoria para agentes IA compatibles con MCP."
ownership:
  owner: dony
  team: architecture
tags:
  - mcp
  - memory
  - ai-agents
  - architecture-as-code
  - persistent-memory
relations: []
---

# mcp-memory

## Propósito

`mcp-memory` es un proyecto orientado a proporcionar una capa base de memoria persistente para sistemas de inteligencia artificial, agentes autónomos y herramientas compatibles con MCP.

Su objetivo es permitir guardar, consultar, organizar y evolucionar memoria de largo plazo para agentes IA sin quedar atado desde el inicio a una base de datos concreta, proveedor de IA específico o herramienta determinada.

## Problema que resuelve

Los agentes IA actuales suelen tener memoria frágil, temporal o dependiente de una herramienta concreta.

`mcp-memory` busca resolver este problema mediante una arquitectura limpia basada en:

- separación entre dominio e infraestructura,
- proveedores de almacenamiento intercambiables,
- memoria auditable,
- recuperación contextual,
- evolución controlada,
- trazabilidad,
- y gobernanza.

## Visión

Convertirse en una infraestructura extensible para memoria IA persistente, portable y gobernable.

La primera versión debe ser pequeña:

- servidor MCP básico,
- proveedor MariaDB,
- operaciones mínimas de memoria,
- configuración sencilla,
- pruebas base,
- documentación clara.

La visión a largo plazo incluye:

- múltiples proveedores,
- memoria semántica,
- políticas de memoria,
- auditoría,
- importación/exportación,
- SDK,
- integración con agentes y editores,
- y posible grafo de memoria.

## Fuera de alcance inicial

La primera versión no pretende ser:

- una plataforma completa de agentes IA,
- un sistema RAG avanzado,
- una base vectorial,
- una solución enterprise cerrada,
- ni un sistema mágico que decida automáticamente qué recordar.

## Principios

- Modularidad.
- Separación entre núcleo y proveedores.
- Almacenamiento intercambiable.
- Memoria auditable.
- Evolución controlada.
- Seguridad desde el inicio.
- Documentación viva mediante OpenLAG.
