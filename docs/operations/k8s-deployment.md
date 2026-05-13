---
id: ops-dep-1
type: COMPONENT
subType: "Deployment"
title: "K8s Auth Deployment"
version: v-1
relations:
  - to: des-arq-1
    type: IMPLEMENTS
---
Configuración de los archivos YAML de Kubernetes para el despliegue del servicio de Auth.
Incluye HPA y Probes de salud.
