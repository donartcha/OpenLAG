---
id: build-pkg-1
type: INFRASTRUCTURE
subType: Package
title: Docker Image Multi-Arch
version: v-2
ownership:
  owner: pcaro
  team: architecture
relations:
  - type: RELATES_TO
    to: arch-overview
---
Configuración de empaquetado para generar imágenes compatibles con x86 y ARM64.
Se utiliza `buildx` para la compilación cruzada.
