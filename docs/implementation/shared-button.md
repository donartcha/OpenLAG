---
id: impl-ui-button
type: SHARED_COMPONENT
title: "PrimaryButton.tsx"
version: v-1
systemVersionId: sv-ui-lib-2.3
ownership:
  team: frontend-team
  owner: alice
relations:
  - to: req-func-1
    type: IMPLEMENTS
  - to: des-cmp-1
    type: RELATES_TO
---
Componente de botón base utilizado en todo el frontend. Cumple con los estándares de accesibilidad WCAG 2.1.

```tsx
import { Button } from '@archgraph/ui';

export const PrimaryButton = ({ children, ...props }) => (
  <Button variant="primary" {...props}>
    {children}
  </Button>
);
```
