---
id: des-arq-1
type: ARCHITECTURE
title: Microservices Setup
version: v-1
relations:
  - to: req-br-1
    type: DERIVES_FROM
  - to: req-func-1
    type: DERIVES_FROM
ownership:
  owner: pcaro
  team: architecture
---
Arquitectura basada en eventos usando RabbitMQ para la comunicación entre servicios.

```mermaid
graph LR
  Gateway --> Auth
  Gateway --> Orders
  Auth --> EventBus[RabbitMQ]
  Orders --> EventBus
```
