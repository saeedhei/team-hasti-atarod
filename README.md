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
- CouchDB (nano client)
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
git clone https://github.com/saeedhei/team-hasti-atarod
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
  <summary>docs</summary>

- [Architecture](https://github.com/saeedhei/team-hasti-atarod/blob/main/docs/Architecture)

  - [data model](https://github.com/saeedhei/team-hasti-atarod/blob/main/docs/Architecture/data-model.md)
  - [api architecture](https://github.com/saeedhei/team-hasti-atarod/blob/main/docs/Architecture/api-architecture.md)
  - [system overview](https://github.com/saeedhei/team-hasti-atarod/blob/main/docs/Architecture/system-overview.md)

- [Backend](https://github.com/saeedhei/team-hasti-atarod/blob/main/docs/Backend)

  - [couchdb](https://github.com/saeedhei/team-hasti-atarod/blob/main/docs/Backend/couchdb)
    - [nano](https://github.com/saeedhei/team-hasti-atarod/blob/main/docs/Backend/couchdb/nano)
      - [typescript](https://github.com/saeedhei/team-hasti-atarod/blob/main/docs/Backend/couchdb/nano/typescript.md)
    - [docker run](https://github.com/saeedhei/team-hasti-atarod/blob/main/docs/Backend/couchdb/docker-run.md)
  - [docker](https://github.com/saeedhei/team-hasti-atarod/blob/main/docs/Backend/docker.md)

- [Frontend](https://github.com/saeedhei/team-hasti-atarod/blob/main/docs/Frontend)

  - [nextjs](https://github.com/saeedhei/team-hasti-atarod/blob/main/docs/Frontend/nextjs/)
    - [nextjs-16 upgrade](https://github.com/saeedhei/team-hasti-atarod/blob/main/docs/Frontend/nextjs/nextjs-16-upgrade.md)
    - [setup next](https://github.com/saeedhei/team-hasti-atarod/blob/main/docs/Frontend/nextjs/setup-next.md)
  - [UI](https://github.com/saeedhei/team-hasti-atarod/blob/main/docs/Frontend/UI)
    - [shadcn components](https://github.com/saeedhei/team-hasti-atarod/blob/main/docs/Frontend/UI/shadcn-components.md)

- [Setup](https://github.com/saeedhei/team-hasti-atarod/blob/main/docs/Setup)

  - [pnpm](https://github.com/saeedhei/team-hasti-atarod/blob/main/docs/Setup/pnpm)
    - [install](https://github.com/saeedhei/team-hasti-atarod/blob/main/docs/Setup/pnpm/install.md)
  - [prettier](https://github.com/saeedhei/team-hasti-atarod/blob/main/docs/Setup/prettier)
    - [line endings](https://github.com/saeedhei/team-hasti-atarod/blob/main/docs/Setup/prettier/line-endings.md)
  - [vscode](https://github.com/saeedhei/team-hasti-atarod/blob/main/docs/Setup/vscode)
    - [line endings](https://github.com/saeedhei/team-hasti-atarod/blob/main/docs/Setup/vscode/line-endings.md)

- [Git](https://github.com/saeedhei/team-hasti-atarod/blob/main/docs/Git)

  - [line endings](https://github.com/saeedhei/team-hasti-atarod/blob/main/docs/Git/line-endings.md)
  - [pr](https://github.com/saeedhei/team-hasti-atarod/blob/main/docs/Git/pr.md)

- [Problem](https://github.com/saeedhei/team-hasti-atarod/blob/main/docs/Problem)
  - [object literal error](https://github.com/saeedhei/team-hasti-atarod/blob/main/docs/Problem/object-literal-error.md)

</details>

## :handshake: Contribution Workflow (VERY IMPORTANT)

1. Create a feature branch:

```bash

   git checkout -b feature-branch
```

2. Commit changes:

```bash

   git commit -m "some message"
```

3. Sync with upstream:

```bash

   git fetch upstream
   git merge upstream/main
   git push origin feature-branch
```

4. Open Pull Request
