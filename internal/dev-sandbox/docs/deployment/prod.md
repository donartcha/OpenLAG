---
id: deploy-prod-1
type: DEPLOYMENT
title: Estrategia de Despliegue Blue-Green
version: v-2
ownership:
  owner: pcaro
  team: architecture
relations:
  - type: RELATES_TO
    to: arch-overview
---
Utilizamos despliegue Blue-Green para minimizar el downtime.
Actualmente el entorno **Green** es el activo ejecutando v1.1.0.
