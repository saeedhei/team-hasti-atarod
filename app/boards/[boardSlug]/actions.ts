//app/boards/[boardTitle]/actions.ts
'use server';

import { db } from '@/lib/couchdb';
import { revalidatePath } from 'next/cache';
import type { List } from '@/types/list';
import type { Card } from '@/types/card';

// ---------------------- Create Card ----------------------

export async function createCardAction(card: Card) {
  try {
    await db.insert(card);

    revalidatePath(`/boards/${card.boardId}`);
  } catch (err) {
    console.error('CREATE CARD FAILED:', err);
    throw err;
  }
}

// ---------------------- Create List ----------------------

export async function createListAction(list: List) {
  try {
    await db.insert(list);

    revalidatePath(`/boards/${list.boardId}`);
  } catch (err) {
    console.error('CREATE LIST FAILED:', err);
    throw err;
  }
}

// ---------------------- Delete List ----------------------
export async function deleteListAction(boardId: string, listId: string) {
  try {
    const list = await db.get(listId);
    await db.destroy(list._id, list._rev);

    revalidatePath(`/boards/${boardId}`);
  } catch (err) {
    console.error('DELETE LIST FAILED:', err);
    throw err;
  }
}
/********************Add Delete cards belonging to this list (batch job)**************/

// ---------------------- Delete Card ----------------------

export async function deleteCardAction(boardId: string, cardId: string) {
  try {
    const card = await db.get(cardId);
    await db.destroy(card._id, card._rev);

    revalidatePath(`/boards/${boardId}`);
  } catch (err) {
    console.error('DELETE CARD FAILED:', err);
    throw err;
  }
}
