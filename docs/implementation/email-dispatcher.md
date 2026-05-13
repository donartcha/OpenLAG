---
id: impl-worker-notif
type: CODE_ENTITY
subType: "Async Worker"
title: "EmailDispatcher"
version: v-1
systemVersionId: sv-notif-0.8
---
Worker encargado de procesar la cola de correos electrónicos. Utiliza BullMQ para la gestión de colas.

```typescript
export class EmailDispatcher {
  async process(job: Job) {
    const { to, subject, body } = job.data;
    await mailer.send(to, subject, body);
  }
}
```
