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

- [KANBAN MODEL](https://github.com/saeedhei/team-hasti-atarod/blob/main/docs/KANBAN_MODEL.md)

</details>

<details>
  <summary>vscode</summary>

- [install](https://github.com/saeedhei/team-hasti-atarod/blob/main/docs/vscode/line-endings.md)

</details>

<details>
  <summary>prettier</summary>

- [line-endings](https://github.com/saeedhei/team-hasti-atarod/blob/main/docs/prettier/line-endings.md)

</details>

<details>
  <summary>pnpm</summary>

- [install](https://github.com/saeedhei/team-hasti-atarod/blob/main/docs/pnpm/install.md)

</details>

<details>
  <summary>next</summary>

- [setup-next](https://github.com/saeedhei/team-hasti-atarod/blob/main/docs/next/setup-next.md)

</details>

<details>
  <summary>git</summary>

- [pr](https://github.com/saeedhei/team-hasti-atarod/blob/main/docs/git/pr.md)
- [line-endings](https://github.com/saeedhei/team-hasti-atarod/blob/main/docs/git/line-endings.md)

</details>

<details>
  <summary>docker</summary>

- [couchdb](https://github.com/saeedhei/team-hasti-atarod/blob/main/docs/docker/couchdb.md)

</details>

<details>
  <summary>couchdb</summary>

- [docker-run](https://github.com/saeedhei/team-hasti-atarod/blob/main/docs/couchdb/docker-run.md)

</details>

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
