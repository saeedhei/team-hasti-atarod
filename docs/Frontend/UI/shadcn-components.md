## Shadcn UI Component Documentation

For the Kanban Board Project (Next.js · TypeScript · App Router · TailwindCSS)

shadcn/ui is a component generator, not a library. It copies UI components directly into our project.
This documentation explains our installed components, where they live, and how to work with them consistently.

### 📁 1. Installed Components

**Base / Layout**

- `theme-provider`
- `button`
- `card`
- `separator`
- `sheet`
- `sidebar`
- `skeleton`
- `tooltip`

**Forms**

- `input`

**Navigation**

- `navigation-menu`
- `dropdown-menu`
- `sidebar (used for app layout)`

**Display**

- `avatar`
- `table`

All installed components are located in:

```bash

/components/ui/
```

---

### 📂 2. File Structure

```bash
components/
 ├─ ui/
 │   ├─ avatar.tsx
 │   ├─ button.tsx
 │   ├─ card.tsx
 │   ├─ dropdown-menu.tsx
 │   ├─ input.tsx
 │   ├─ navigation-menu.tsx
 │   ├─ separator.tsx
 │   ├─ sheet.tsx
 │   ├─ sidebar.tsx
 │   ├─ skeleton.tsx
 │   ├─ table.tsx
 │   ├─ tooltip.tsx
 │   └─ theme-provider.tsx
 ├─ app-sidebar.tsx
 ├─ Layout-header.tsx
 └─ Layout-footer.tsx
```

---

### ➕ 3. How to Add a New Shadcn Component

Use the official CLI:

```bash
pnpm dlx shadcn@latest add <component-name>
```

Example:

```bash
pnpm dlx shadcn@latest add dialog
```

This will:

- Download the newest version

- Add files under `/components/ui`

- Install all dependencies

---

### 🛑 4. Modification Policy

**Do NOT modify components directly inside** `/components/ui`.

Why:

- Hard to update later

- Risk of breaking shared UI

- Causes inconsistency

**✔ Instead: Create wrapper components**

Example:

```bash

/components/custom/CardSection.tsx
```

Use wrappers if you need variants, styling changes, or composition logic.

---

### 🌙 5. Theme Provider (Dark Mode)

We use the latest `theme-provider` from shadcn for:

- Light mode
- Dark mode
- System mode

File:

```bash
/components/ui/theme-provider.tsx
```

Layout usage:

```bash

<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
  {children}
</ThemeProvider>
```

**Customization (colors, radius, etc.) must be done in:**

`ailwind.config.js`

---

### 📘 6. Component Usage Guidelines

**Button**

```bash
<Button variant="default">Save</Button>
```

**Card**

Used for dashboard, board containers, and UI grouping.

**Dropdown Menu**

Used for header avatar actions and contextual menus.

**Navigation Menu**

Used in the top header for global navigation.

**Sidebar**

Used as the main app navigation panel.

**Table**

Used for structured lists (e.g., admin panels, logs).

**Skeleton**

Used for loading placeholders.

**Tooltip**

Used for icons, buttons, and condensed actions.

---

### 🧩 7. Adding New UI Elements

Before creating a custom component:

- Check if shadcn provides it
- If yes → install via CLI
- If no → create a custom component under `/components/`
- Follow Tailwind, accessibility, and TypeScript best practices
- Maintain consistency with existing UI

---

### 🔄 8. Updating Shadcn Components

To update a single component:

```bash

pnpm dlx shadcn@latest add <component>
```

This will overwrite the component with the newest official version.

⚠ Risk:
If you modified the file inside `/components/ui`, your changes will be lost.

---

### 🎯 9. Best Practices

**✔ Do**

- Keep all UI primitives in /components/ui

- Use wrapper components for custom behavior

- Preserve accessibility and TypeScript types

- Update this doc when adding new components

**✖ Don’t**

- Modify shadcn files directly

- Rename core UI files

- Duplicate components

- Remove Tailwind classes needed for dark mode

---

### 📝 10. Summary

This documentation helps maintain:

- A consistent UI

- Predictable updates

- Scalable component usage

- Easier onboarding

- A clean shadcn setup for the Kanban project
