# 🗂️ Kanban Board Data Model

This document explains the core data structure used in our Kanban system: **Boards**, **Columns**, and **Tasks**, and how they relate to each other.

## 📐 Structure Overview

- A **Board** contains multiple **Columns**
- A **Column** contains multiple **Tasks**

`Board → Columns → Tasks`

## Entities & Fields

---

## 🧩 Board

Represents a single workspace.

| Field       | Type     | Description            |
| ----------- | -------- | ---------------------- |
| id          | string   | Unique board ID        |
| title       | string   | Board name             |
| description | string   | Optional description   |
| createdAt   | datetime | Creation timestamp     |
| updatedAt   | datetime | Last updated timestamp |

**Example**

```json
{
  "id": "board_123",
  "title": "Main Board",
  "description": "Project workflow",
  "createdAt": "2024-01-10",
  "updatedAt": "2024-01-12"
}
```

📊 Column

Workflow stage inside a board.

| Field     | Type     | Description                  |
| --------- | -------- | ---------------------------- |
| id        | string   | Column ID                    |
| boardId   | string   | Belongs to which board       |
| title     | string   | Column title (e.g., "To Do") |
| order     | number   | Position inside board        |
| createdAt | datetime | Creation timestamp           |

📝 Task

Movable work item inside a column.
| Field | Type | Description |
| ----------- | -------- | --------------------------- |
| id | string | Task ID |
| columnId | string | Column reference |
| title | string | Task title |
| description | string | Optional details |
| assignee | string | Optional responsible person |
| order | number | Position inside column |
| status | enum | `todo`, `doing`, `done` |
| createdAt | datetime | Creation timestamp |
| updatedAt | datetime | Last update |

📌 Notes

- `order` is required for drag-and-drop sorting.
- `status` may reflect column or be stored separately.
- Structure is designed to scale as new features are added.
