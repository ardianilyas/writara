# AGENTS.md

## Project Overview

This project is an Express.js REST API using:

- Express
- Zod
- Prisma ORM
- Better Auth
- Feature-based architecture
- TypeScript
- PostgreSQL

The primary goal is maintainability and scalability. Every new feature should be isolated and easy to remove without affecting unrelated features.

---

# Architecture Principles

## 1. Organize by Feature

Never organize application code by technical layer.

❌ Avoid

```
controllers/
services/
repositories/
routes/
models/
```

These folders become difficult to navigate as the project grows.

Instead, organize everything by business feature.

✅ Good

```
features/
    auth/
    users/
    products/
    orders/
```

Everything related to one feature stays together.

---

## 2. Shared Code Lives Outside Features

Only reusable code belongs outside `features`.

```
src/
    features/
    lib/
    middleware/
    config/
    utils/
    types/
```

If code is only used by one feature, keep it inside that feature.

---

## 3. Features Should Be Independent

Features should not directly depend on each other's internal implementation.

Allowed:

```
users
    ↓
shared lib
```

Avoid:

```
users
    ↓
orders
        ↓
payments
```

If two features need the same functionality, move it into `lib`.

---

# Folder Structure

```
src/
│
├── app.ts
├── server.ts
│
├── config/
│
├── lib/
│   ├── prisma.ts
│   ├── logger.ts
│   ├── auth.ts
│   └── env.ts
│
├── middleware/
│   ├── auth.middleware.ts
│   ├── error.middleware.ts
│   └── validation.middleware.ts
│
├── utils/
│
├── types/
│
├── features/
│
│   ├── auth/
│   │
│   │   ├── auth.route.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.validation.ts
│   │   ├── auth.types.ts
│   │   └── index.ts
│   │
│   ├── users/
│   │
│   │   ├── user.route.ts
│   │   ├── user.controller.ts
│   │   ├── user.service.ts
│   │   ├── user.validation.ts
│   │   ├── user.types.ts
│   │   ├── user.mapper.ts
│   │   └── index.ts
│   │
│   └── products/
│
└── routes/
    index.ts
```

---

# Feature Structure

Every feature should follow the same layout.

Example:

```
users/

user.route.ts
user.controller.ts
user.service.ts
user.validation.ts
user.mapper.ts
user.types.ts
index.ts
```

Do not invent new naming conventions.

Consistency is more important than personal preference.

---

# Responsibilities

## Route

Responsible for:

- Express Router
- Route definitions
- Middleware
- Validation middleware

Should NOT contain business logic.

Example:

```
GET /users
POST /users
PATCH /users/:id
DELETE /users/:id
```

---

## Controller

Responsible for:

- Receiving Request
- Calling Service
- Returning Response
- HTTP status codes

Should remain thin.

Good

```
Request

↓

Controller

↓

Service
```

Bad

```
Request

↓

Controller

↓

Prisma
```

---

## Service

Contains all business logic.

Responsible for

- Database operations
- Authorization checks
- Validation beyond schema
- Transactions
- External APIs

Services may call Prisma directly.

There is no Repository layer unless the project genuinely needs one.

---

## Validation

Contains all request validation schemas.

Prefer Zod.

Example

```
createUserSchema

updateUserSchema

loginSchema
```

---

## Mapper

Responsible for converting database models into API responses.

Never expose Prisma models directly.

Good

```
User

↓

UserResponse
```

This makes future database changes much easier.

---

## Types

Feature-specific types only.

Shared types belong in

```
src/types
```

---

# Prisma

Prisma client should exist only once.

```
lib/
    prisma.ts
```

Never instantiate Prisma inside a feature.

Good

```
import prisma from "@/lib/prisma"
```

---

# Better Auth

Authentication configuration belongs in

```
lib/auth.ts
```

Feature-specific auth endpoints stay inside

```
features/auth
```

Authentication middleware belongs in

```
middleware/
```

---

# Error Handling

Never use

```
try {
}
catch {
}
```

inside controllers unless necessary.

Throw errors from services.

Global error middleware should convert errors into API responses.

Example

```
Service

↓

throw AppError()

↓

Error Middleware

↓

Response
```

---

# API Responses

Use a consistent response shape.

Success

```json
{
    "success": true,
    "data": {}
}
```

Error

```json
{
    "success": false,
    "message": "...",
    "errors": []
}
```

Avoid returning raw Prisma errors.

---

# Imports

Prefer absolute imports.

Good

```
@/features/users
@/lib/prisma
@/utils/date
```

Avoid long relative imports.

```
../../../../utils
```

---

# Naming

Use singular names.

Good

```
user.service.ts
user.controller.ts
product.service.ts
```

Avoid

```
users.service.ts
products.controller.ts
```

Folders may remain plural if they represent collections.

```
features/users
features/orders
```

---

# Business Logic Rules

Business logic belongs only inside Services.

Controllers should be easy to read within 20–30 lines.

If a controller exceeds ~30 lines, move logic into the service.

---

# Shared Utilities

Only truly reusable code belongs in

```
lib/
utils/
```

Do not create helper files prematurely.

Wait until at least two features need the same functionality.

---

# Index Files

Each feature exports its public API.

Example

```
export * from "./user.route";
```

Consumers should never import internal files unless necessary.

---

# Testing

Tests should live beside the code they test.

Example

```
users/

user.service.ts
user.service.test.ts

user.controller.ts
user.controller.test.ts
```

Avoid a global `tests/` directory for unit tests.

---

# AI Agent Guidelines

When adding a new feature:

1. Create a new folder inside `features`.
2. Keep all feature files together.
3. Do not create global controllers or services.
4. Reuse shared libraries when appropriate.
5. Prefer composition over inheritance.
6. Keep controllers thin.
7. Put business rules in services.
8. Never duplicate validation schemas.
9. Never instantiate Prisma outside `lib/prisma.ts`.
10. Follow existing naming conventions.

When unsure, optimize for consistency over cleverness.