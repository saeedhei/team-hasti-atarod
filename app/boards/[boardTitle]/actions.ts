//app/boards/[boardTitle]/actions.ts
'use server';

import { boardsDB } from '@/lib/couchdb';
import { revalidatePath } from 'next/cache';
import type { Board, Task, List } from '@/types/board';
import { string } from 'zod';

// ---------------------- Add Task ----------------------

export async function addTaskAction(boardId: string, listId: string, task: Task) {
  try {
    // load board
    const board = (await boardsDB.get(boardId)) as Board;

    // update board.list
    const updated: Board = {
      ...board,
      list: board.list.map((lst) =>
        lst.id === listId ? { ...lst, tasks: [task, ...lst.tasks] } : lst,
      ),
    };

    // Save updated board (requires _rev)
    await boardsDB.insert(updated);

    // revalidate board page
    revalidatePath(`/boards/${boardId}`);
  } catch (err) {
    console.error('ADD TASK FAILED:', err);
    throw err;
  }
}

// ---------------------- Create List ----------------------

export async function createListAction(boardId: string, list: List) {
  if (!list || typeof list !== 'object' || typeof list.title !== 'string') {
    console.error('Invalid list payload');
    return;
  }
  try {
    const board = (await boardsDB.get(boardId)) as Board;

    // Add to board
    const updated: Board = {
      ...board,
      list: [...(board.list ?? []), list],
    };
    await boardsDB.insert(updated);

    // Revalidate UI
    revalidatePath(`/boards/${boardId}`);
  } catch (err) {
    console.error('CREATE LIST FAILED:', err);
    throw err;
  }
}
// ---------------------- Delete List ----------------------
export async function deleteListAction(boardId: string, listId: string) {
  try {
    const board = (await boardsDB.get(boardId)) as Board;

    const updated: Board = {
      ...board,
      list: board.list.filter((l) => l.id !== listId),
    };

    await boardsDB.insert(updated);
    revalidatePath(`/boards/${boardId}`);
  } catch (err) {
    console.error('DELETE LIST FAILED:', err);
    throw err;
  }
}
// ---------------------- Delete Task ----------------------
export async function deleteTaskAction(boardId: string, listId: string, taskId: string) {
  try {
    const board = (await boardsDB.get(boardId)) as Board;

    const updated: Board = {
      ...board,
      list: board.list.map((list) =>
        list.id === listId ? { ...list, tasks: list.tasks.filter((t) => t.id !== taskId) } : list,
      ),
    };

    await boardsDB.insert(updated);
    revalidatePath(`/boards/${boardId}`);
  } catch (err) {
    console.error('DELETE TASK FAILED:', err);
    throw err;
  }
}
