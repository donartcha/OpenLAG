---
id: depl-auth-prod
type: DEPLOYMENT
subType: GitHub Actions
title: Auth Service Production Deployment
version: v-1
relations:
  - to: impl-ctr-1
    type: DEPLOYS
ownership:
  owner: pcaro
  team: architecture
---
Pipeline de despliegue automático para el servicio de autenticación en el entorno de producción.
