# pnpm create next-app

```
What is your project named? my-app
Would you like to use the recommended Next.js defaults? » - Use arrow-keys. Return to submit.
>   Yes, use recommended defaults
    TypeScript, ESLint, Tailwind CSS, App Router
```

# Next.js Setup (Frontend)

## 1. Creating the Project

## 2. Installed UI Framework (shadcn/ui)

shadcn/ui has been added to the frontend using:
pnpm dlx shadcn@latest init

## 2.1 Theme Selection

During the shadcn/ui initialization, the **Neutral** theme was selected.

### Output

This command:

- Configured TailwindCSS automatically
- Added required global CSS
- Created the `/components/ui` folder
- Installed base configuration files
  Notes:
- If team members want to switch to another theme later (e.g. Zinc, Slate), shadcn supports regenerating styles but it will affect all existing components.
- Keep the theme consistent across the project.

## How to Run the Project

Install dependencies: pnpm install
pnpm dev

## Project Structure Notes

- app/ → App Router pages
- components/ui/ → shadcn auto-generated components
