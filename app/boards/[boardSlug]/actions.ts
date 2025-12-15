//app/boards/[boardSlug]/actions.ts
'use server';

import { kanbansDB } from '@/lib/couchdb';
import { revalidatePath } from 'next/cache';
import type { List } from '@/types/list';
import type { Card } from '@/types/card';

// ---------------------- Create Card ----------------------

export async function createCardAction(card: Card, boardSlug: string) {
  try {
    await kanbansDB.insert(card);

    revalidatePath(`/boards/${boardSlug}`);
  } catch (err) {
    console.error('CREATE CARD FAILED:', err);
    throw err;
  }
}

// ---------------------- Create List ----------------------

export async function createListAction(list: List, boardSlug: string) {
  try {
    await kanbansDB.insert(list);

    revalidatePath(`/boards/$${boardSlug}`);
  } catch (err) {
    console.error('CREATE LIST FAILED:', err);
    throw err;
  }
}

// ---------------------- Delete List ----------------------
export async function deleteListAction(boardId: string, listId: string, boardSlug: string) {
  try {
    const list = await kanbansDB.get(listId);
    await kanbansDB.destroy(list._id, list._rev);

    revalidatePath(`/boards/${boardSlug}`);
  } catch (err) {
    console.error('DELETE LIST FAILED:', err);
    throw err;
  }
}
/********************Add Delete cards belonging to this list (batch job)**************/

// ---------------------- Delete Card ----------------------

export async function deleteCardAction(boardId: string, cardId: string, boardSlug: string) {
  try {
    const card = await kanbansDB.get(cardId);
    await kanbansDB.destroy(card._id, card._rev);

    revalidatePath(`/boards/${boardSlug}`);
  } catch (err) {
    console.error('DELETE CARD FAILED:', err);
    throw err;
  }
}
