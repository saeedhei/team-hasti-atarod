//app/boards/[id]/actions.ts
'use server';

import { boardsDB } from '@/lib/couchdb';
import { revalidatePath } from 'next/cache';
import type { Board, Task } from '@/types/board';

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
