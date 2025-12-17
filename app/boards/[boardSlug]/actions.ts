//app/boards/[boardSlug]/actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { createCard, deleteCard } from '@/lib/domain/cards';
import { createList, deleteList } from '@/lib/domain/lists';

// ---------------------- Create Card ----------------------

export async function createCardAction(
  payload: {
    title: string;
    description?: string;
    priority?: 'low' | 'medium' | 'high';
    position?: number;
  },
  boardId: string,
  listId: string,
  boardSlug: string,
) {
  await createCard(payload, boardId, listId);
  revalidatePath(`/boards/${boardSlug}`);
}

// ---------------------- Create List ----------------------

export async function createListAction(
  payload: { title: string; position?: number; color?: string },
  boardId: string,
  boardSlug: string,
) {
  await createList(payload, boardId);
  revalidatePath(`/boards/${boardSlug}`);
}

// ---------------------- Delete List ----------------------
export async function deleteListAction(boardId: string, listId: string, boardSlug: string) {
  await deleteList(listId);
  revalidatePath(`/boards/${boardSlug}`);
}
/********************Add Delete cards belonging to this list (batch job)**************/

// ---------------------- Delete Card ----------------------

export async function deleteCardAction(
  boardId: string,
  cardId: string,
  listId: string,
  boardSlug: string,
) {
  await deleteCard(cardId);
  revalidatePath(`/boards/${boardSlug}`);
}
