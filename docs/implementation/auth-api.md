---
id: impl-api-1
type: CODE_ENTITY
subType: API Route
title: /api/v1/user/register
version: v-1
systemVersionId: sv-auth-1.0
relations:
  - to: req-func-1
    type: IMPLEMENTS
---
Implementación del endpoint de registro de usuarios. Utiliza Express y valida la entrada con Joi.

```typescript
router.post('/register', validate(UserSchema), async (req, res) => {
  const user = await AuthService.register(req.body);
  res.status(201).json(user);
});
```
