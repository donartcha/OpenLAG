---
id: ops-dep-1
type: DEPLOYMENT
subType: Deployment
title: K8s Auth Deployment
version: v-1
ownership:
  owner: pcaro
  team: devops
relations:
  - to: des-arq-1
    type: IMPLEMENTS
  - to: impl-api-1
    type: DEPLOYS
---
Configuración de los archivos YAML de Kubernetes para el despliegue del servicio de Auth.
Incluye HPA y Probes de salud.
