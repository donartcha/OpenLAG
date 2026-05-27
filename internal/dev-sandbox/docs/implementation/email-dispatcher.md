---
id: impl-worker-notif
type: ASYNC_WORKER
title: EmailDispatcher
version: v-1
systemVersionId: sv-notif-0.8
ownership:
  owner: pcaro
  team: architecture
relations:
  - type: IMPLEMENTS
    to: req-nfunc-1
  - type: RELATES_TO
    to: arch-overview
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
