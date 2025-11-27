## Next.js 16 — Summary for the Kanban Board Project

This document summarizes the parts of the Next.js 16 update that are **relevant to our Kanban Board app** (TypeScript + App Router + shadcn/ui).<br>
Unnecessary framework internals or unrelated features are removed.

---

### 🚀 Core Changes That Affect Our Project

#### 1. Cache Components <font color="red">(New)</font>

Next.js introduces **Cache Components**, enabled via `"use cache"`.

Why it matters for our Kanban app:

- We can cache board data, columns, and tasks for **instant navigation**.
- Works together with **Partial Pre-Rendering (PPR)**.
- Caching is now **opt-in**, so our dynamic board pages behave more predictably.

Enable:

```bash

// next.config.ts
export default {
  cacheComponents: true,
};
```

---

#### 2. Partial Pre-Rendering (PPR)

PPR lets us prerender static shells while keeping task data dynamic.

Useful for:

- Fast loading of board layout (columns + UI).
- Dynamic parts (tasks, actions, drag & drop) still run on request.

---

#### 3. Improved Caching APIs

New and updated APIs give better control over how board and task data updates.

`revalidateTag()` **(updated)**

Now requires a caching profile:

```bash

revalidateTag('boards', 'max');
```

`updateTag()` <font color="red">(New)</font>

For Server Actions: immediately refresh updated data
→ Great for updating tasks, titles, and column order.

```bash

updateTag(`task-${id}`);
```

`refresh()` <font color="red">(New)</font>

Refreshes uncached data only.
Useful for notifications, activity counts, etc.

---

### ⚙️ Development & Architecture Improvements

#### 4. Turbopack (Stable)

Now the **default bundler** with:

- 5–10× faster refreshes
- 2–5× faster builds

Great for our day-to-day Kanban dev workflow.

---

#### 5. Turbopack File System Caching (Beta)

Faster startup on large projects.

Enable:

```bash

export default {
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },
};
```

---

#### 6. Next.js DevTools MCP

Adds AI-assisted debugging with:

- Unified browser + server logs
- Route awareness
- Error context

This will help diagnose issues in data fetching, caching, and dynamic routes like:

```bash

/boards/[id]
```

---

#### 7. proxy.ts (Renamed from middleware.ts)

`middleware.ts` is replaced by `proxy.ts`.

Useful if we add:

- Authentication
- API rewriting
- Multi-tenant board routing

Example:

```bash

export default function proxy(req) {
  return NextResponse.redirect(new URL('/home', req.url));
}
```

---

#### 8. Improved Routing & Prefetching

Next.js now:

- Deduplicates shared layouts
- Prefetches only missing parts
- Cancels unused prefetches

Impact:

- Board pages with many links (to tasks or subpages) load faster.
- Lighter network usage.

---

### 🧩 React & UI Enhancements

#### 9. React Compiler (Stable)

Automatically memoizes components → fewer unnecessary renders.

Good for:

- Task cards
- Column lists
- Board pages with heavy UI

Enable:

```bash

export default {
  reactCompiler: true,
};
```

---

#### 10. React 19.2 Features

Relevant additions:

- **View Transitions** → Smooth animations between board states
- **useEffectEvent** → Cleaner logic for drag-and-drop or autosave
- **Activity** → Background loaders without losing state

---

### 🛠 Upgrade Instructions

**Automatic**

```bash
npx @next/codemod@canary upgrade latest
```

**Manual**

```bash
npm install next@latest react@latest react-dom@latest
```

---

### ✔ Final Notes for the Kanban Project

These changes affect us the most:

- **Cache Components + PPR** → for fast, dynamic boards
- **updateTag()** → instant task/column updates
- **React Compiler** → better performance for our card-heavy UI
- **Enhanced routing** → faster prefetching of board pages
- **Turbopack** → significantly faster local development
