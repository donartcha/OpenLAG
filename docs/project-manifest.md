---
project: OpenLAG Demo
---

# Project Manifest

Esta es la configuración central de la arquitectura y el ciclo de vida del proyecto.

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
