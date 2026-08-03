# Next.js Project Structure Guide (Feature-Based Architecture)

> **Stack**
>
> - Next.js App Router
> - TypeScript
> - TailwindCSS
> - TanStack Query
> - React Hook Form
> - Zod
> - Axios / Fetch
> - Feature-based architecture

---

# Core Principles

## 1. Feature First

Everything belongs to a feature.

❌ Bad

```
components/
hooks/
services/
pages/
```

✅ Good

```
features/
    auth/
    dashboard/
    profile/
```

Each feature owns:

- UI
- hooks
- api
- types
- schemas
- constants
- utils

---

## 2. Keep app/ Clean

The `app` folder should only contain routing.

```
app/
    dashboard/
        page.tsx
    profile/
        page.tsx
```

No business logic.

No API calls.

No forms.

No validation.

No useEffect.

---

## 3. Never Put "use client" in page.tsx

Instead, page.tsx should remain a Server Component.

### ❌ Bad

```tsx
"use client";

export default function Page() {}
```

### ✅ Good

```tsx
import DashboardPage from "@/features/dashboard/components/dashboard-page";

export default function Page() {
    return <DashboardPage />;
}
```

Inside feature:

```tsx
"use client";

export default function DashboardPage() {}
```

This keeps routing server-rendered while allowing client interactivity only where needed.

---

## 4. One Responsibility Per File

Bad

```
page.tsx

- fetch data
- render UI
- validation
- mutation
- modal
- table
```

Good

```
page.tsx
↓

DashboardPage

↓

DashboardTable
DashboardFilter
DashboardToolbar
```

---

# Recommended Folder Structure

```
src/

│
├── app/
│
│   ├── (public)/
│   ├── (auth)/
│   ├── (dashboard)/
│   │
│   ├── api/
│   ├── layout.tsx
│   └── page.tsx
│
├── features/
│
│   ├── auth/
│   │
│   │   ├── api/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── schemas/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── constants/
│   │   └── index.ts
│   │
│   ├── dashboard/
│   ├── profile/
│   └── post/
│
├── components/
│
│   ├── ui/
│   ├── layout/
│   ├── shared/
│   └── icons/
│
├── hooks/
│
│   ├── use-debounce.ts
│   ├── use-media-query.ts
│   └── use-mounted.ts
│
├── lib/
│
│   ├── api.ts
│   ├── axios.ts
│   ├── query-client.ts
│   ├── auth.ts
│   ├── env.ts
│   └── utils.ts
│
├── providers/
│
│   ├── query-provider.tsx
│   ├── theme-provider.tsx
│   └── app-provider.tsx
│
├── types/
│
├── constants/
│
├── config/
│
├── styles/
│
├── middleware.ts
│
└── assets/
```

---

# Feature Structure

Example:

```
features/

    post/

        api/

            create-post.ts

            update-post.ts

            delete-post.ts

            get-post.ts

            get-posts.ts

        components/

            post-page.tsx

            post-form.tsx

            post-card.tsx

            post-table.tsx

            post-dialog.tsx

        hooks/

            use-post.ts

            use-posts.ts

            use-create-post.ts

            use-update-post.ts

            use-delete-post.ts

        schemas/

            post.schema.ts

        types/

            post.type.ts

        utils/

            mapper.ts

            formatter.ts

        constants/

            post.constant.ts

        index.ts
```

Everything related to Post stays inside Post.

---

# API Layer

Each request is one file.

```
api/

    get-post.ts

    get-posts.ts

    create-post.ts

    update-post.ts

    delete-post.ts
```

Example

```ts
export async function getPosts() {}
```

Avoid giant service files like:

```
post.service.ts
```

containing 30 endpoints.

---

# Hooks

Hooks should only contain React logic.

```
hooks/

    use-posts.ts

    use-post.ts

    use-create-post.ts
```

Example

```ts
export function usePosts() {
    return useQuery(...)
}
```

Never place fetch logic directly inside components.

---

# Components

Feature Components

```
features/post/components/

    post-page.tsx

    post-table.tsx

    post-filter.tsx

    post-dialog.tsx

    post-form.tsx
```

Reusable Components

```
components/

    ui/

    layout/

    shared/
```

Rules

Feature component

✔ Used only by one feature

Reusable component

✔ Used by multiple features

---

# Global Hooks

Only generic hooks belong here.

```
hooks/

    use-media-query.ts

    use-debounce.ts

    use-copy.ts
```

Feature-specific hooks stay inside the feature.

---

# Validation

Validation belongs to feature.

```
features/post/schemas/

    post.schema.ts
```

```ts
export const createPostSchema = ...
```

---

# Types

Feature type

```
features/post/types/post.ts
```

Shared type

```
types/
```

---

# Constants

Feature

```
features/post/constants/
```

Global

```
constants/
```

Avoid magic strings.

---

# Providers

```
providers/

    query-provider.tsx

    theme-provider.tsx

    auth-provider.tsx
```

Compose them

```
app-provider.tsx
```

---

# Route Example

```
app/

    posts/

        page.tsx
```

```tsx
import PostPage from "@/features/post/components/post-page";

export default function Page() {
    return <PostPage />;
}
```

Client component

```tsx
"use client";

export default function PostPage() {
    ...
}
```

---

# Import Rules

Prefer absolute imports.

Good

```ts
import { Button } from "@/components/ui/button";
```

Avoid

```ts
../../../components/button
```

---

# Naming Convention

Folders

```
kebab-case
```

Files

```
post-table.tsx

create-post.ts

use-post.ts
```

Components

```
PascalCase
```

Hooks

```
useSomething
```

Types

```
Post
CreatePostDto
```

Interfaces should be avoided unless extending third-party types.

Prefer

```ts
type Post = {}
```

---

# Dependency Rules

```
app
    ↓

feature

    ↓

shared component

    ↓

lib
```

Never

```
feature A

↓

feature B
```

Instead extract shared logic.

```
components/shared/

hooks/

lib/

utils/
```

---

# Feature Checklist

Every feature should ideally contain:

```
feature/

├── api/
├── components/
├── hooks/
├── schemas/
├── types/
├── constants/
├── utils/
└── index.ts
```

---

# Best Practices

- Keep `app/` for routing only.
- Never add `"use client"` to `page.tsx`.
- Move interactive logic into feature components.
- Organize by feature, not by file type.
- One API endpoint per file.
- One hook per concern.
- Keep fetch logic inside API modules.
- Keep React Query inside hooks.
- Keep validation in Zod schemas.
- Keep reusable UI in `components/ui`.
- Keep feature-specific UI inside the feature.
- Use absolute imports (`@/`).
- Avoid cross-feature dependencies.
- Prefer composition over deeply nested components.
- Keep components focused and small (ideally under ~200 lines).
- Separate presentation, state management, and data fetching responsibilities.
```