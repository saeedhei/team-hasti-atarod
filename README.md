# Kanban Board

A collaborative Kanban board built with **Next.js**, **TypeScript**, **Tailwind**, and a modern API architecture (**REST** + **GraphQL** + **tRPC**).  
This tool helps teams manage tasks by columns, track workflow, and improve productivity.

## :sparkles: Features

- Create, edit, delete tasks
- Drag & drop between columns
- User authentication
- Different board views
- Dark/Light mode
- Real-time updates (later)

## :hammer_and_wrench: Tech Stack

```
- Next.js 16.0.3 (App Router)
- TypeScript
- TailwindCSS
- Shadcn/UI
- tRPC
- REST API
- GraphQL (Apollo)
```

## :file_folder: Project Structure

- **/app** → Main Next.js application (App Router)
- **/docs** → Project documentation (setup files, guides)
- **/lib** → Utilities, configurations, and shared functions
- **/public** → Static assets (images, icons)

## :rocket: Getting Started

Open a terminal (Command Prompt or PowerShell for Windows, Terminal for macOS or Linux)

Ensure Git is installed
`Visit https://git-scm.com to download and install console Git if not already installed`

Clone the repo:

```bash
git clone https://github.com/hastiatarod/team-hasti-atarod.git
```

Install dependencies:

```bash
pnpm install
```

Run development:

```bash
pnpm dev
```

## :books: Documentation

<details>
   <summary>pnpm</summary>
   - [install] (https://github.com/saeedhei/team-hasti-atarod/blob/main/docs/pnpm/install.md)
</details>

- next
- git
- docker
- couchdb

## :handshake: Contribution Workflow (VERY IMPORTANT)

1. Create a feature branch:
   `git checkout -b feature-branch`
2. Commit changes:
   `git commit -m "some message"`
3. Sync with upstream:
   `git fetch upstream`
   `git merge upstream/main`
   `git push origin feature-branch`
4. Open Pull Request
