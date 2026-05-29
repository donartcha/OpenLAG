---
id: impl-api-1
type: API_ROUTE
title: /api/v1/user/register
version: v-1
systemVersionId: sv-auth-1.0
ownership:
  owner: pcaro
  team: backend-team
  reviewers:
    - security-team
relations:
  - to: req-func-1
    type: RELATES_TO
  - to: des-reg-01
    type: RELATES_TO
---
Implementación del endpoint de registro de usuarios. Utiliza Express y valida la entrada con Joi.

```typescript
router.post('/register', validate(UserSchema), async (req, res) => {
  const user = await AuthService.register(req.body);
  res.status(201).json(user);
});
```
