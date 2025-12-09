## 📄 Routing & Page Props in Next.js 16

Understanding dynamic routes, params, and the new Promise-based API

Next.js 16 introduces changes to how route props (`params` and `searchParams`) work in the App Router. These changes affect every dynamic page in this project, especially the Kanban board routes such as:

```bash

/boards/[boardTitle]
```

This document explains:

- How routing works in the App Router
- How to correctly type route props in TypeScript
- Why `params` and `searchParams` are Promises in Next.js 16
- How we use this pattern in the Kanban board project

---

#### 📌 1. Overview of Routing in the App Router

Every folder inside `app/` becomes part of the route tree.

Example:

```bash
app/
  boards/
    [boardTitle]/
      page.tsx
```

This creates a dynamic route:

```bash
/boards/:boardTitle
```

The value in the URL becomes available in the page component through the params prop.

---

#### 📌 2. Dynamic Route Params in Next.js 15+

Starting from **Next.js 15**, route params are **Promise-based** instead of synchronous objects.

**❗ This is a breaking behavioral change.**
In older versions (`Next.js 13–14`):

```bash
params: { boardTitle: string }
```

In Next.js 15–16:

```bash
params: Promise<{ boardTitle: string }>
```

**Why the change?**
Promise-based params allow Next.js to support:

- Streaming server rendering
- Improved Suspense integration
- Async navigation
- More predictable data dependency management

---

#### 📌 3. Typing Params in This Project

Because our route uses a dynamic segment `[boardTitle]`, we define the page props as:

```bash
type PageProps = {
  params: Promise<{ boardTitle: string }>;
};
```

And use them like this:

```bash
export default async function Page({ params }: PageProps) {
  const { boardTitle } = await params;

  // URL-safe decoding (important)
  const decodedId = decodeURIComponent(boardTitle);
}
```

This is the official recommended approach for Next.js 16.

---

#### 📌 4. Why We Still Support the Synchronous Version

For backwards compatibility, Next.js 15+ still allows this:

```bash
params: { boardTitle: string }
```

This version:

- Works in some cases
- Is familiar for older tutorials
- Was used temporarily in this project to debug a Turbopack sourcemap issue

However:

**🚫 This synchronous behavior will be removed in a future version.**
✅ We use the Promise-based version consistently.

---

#### 📌 5. Full Example from This Project

Route:

```bash
/boards/[boardTitle]
```

Page file:

```bash
// app/boards/[boardTitle]/page.tsx
import { boardsDB } from '@/lib/couchdb';
import BoardClient from './BoardClient';
import type { Board } from '@/types/board';

type PageProps = {
  params: Promise<{ boardTitle: string }>;
};

export default async function BoardPage({ params }: PageProps) {
  const { boardTitle } = await params;

  const decoded = decodeURIComponent(boardTitle);

  let board: Board | null = null;

  try {
    board = (await boardsDB.get(decoded)) as Board;
  } catch {
    return <div className="p-6">Board not found</div>;
  }

  return (
    <main className="p-6">
      <BoardClient initialBoard={board} />
    </main>
  );
}
```

**Notes**

- This page is a **Server Component**, so `async` is allowed.
- Decoding is required because slugs may contain special characters.
- CouchDB fetch happens server-side, which is optimal for performance and security.

---

#### 📌 6. Working with `searchParams`

Like `params`, search parameters are also Promises.

Example:

```bash
/shop?page=2&sort=asc
```

Typing:

```bash
type PageProps = {
  searchParams: Promise<{ page?: string; sort?: string }>;
};
```

Usage:

```bash
const { page = '1', sort = 'asc' } = await searchParams;
```

**Notes**

- Using `searchParams` marks the page as dynamic in Next.js.
- searchParams is a plain object, NOT a URLSearchParams instance.

---

#### 📌 7. Using Params in Client Components

Client Components cannot be async.
To access Promise-based params, React provides the experimental `use()` function:

```bash
'use client';
import { use } from 'react';

export default function Page({ params }: { params: Promise<{ boardTitle: string }> }) {
  const { boardTitle } = use(params);
}
```

We avoid this in most cases because:

- Client Components cannot use server resources (DB)
- It pushes route parsing to the browser
- It makes logic more complex

---

#### 📌 8. Summary

| Concept                        | Next.js 13–14 | Next.js 15–16         |
| ------------------------------ | ------------- | --------------------- |
| `params`                       | object        | **Promise<object>**   |
| `searchParams`                 | object        | **Promise<object>**   |
| Recommended typing             | sync          | **Promise-based**     |
| Server components can be async | Yes           | Yes                   |
| Client components async?       | No            | No (must use `use()`) |

**For this project:**

✔ We follow the **Promise-based Next.js 16 pattern**.
✔ We type all route params consistently.
✔ We fetch board data inside Server Components.
✔ Client Components receive only preloaded data.
