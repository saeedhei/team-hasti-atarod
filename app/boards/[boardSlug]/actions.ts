//app/boards/[boardSlug]/actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { randomUUID } from 'crypto';
import { kanbansDB } from '@/lib/couchdb';
import { createCardSchema } from '@/validations/card';
import { createListSchema } from '@/validations/list';
import type { Card } from '@/types/card';
import type { List } from '@/types/list';

// ---------------------- Create Card ----------------------

export async function createCardAction(
  payload: unknown,
  boardId: string,
  listId: string,
  boardSlug: string,
) {
  const data = createCardSchema.parse(payload);

  const card: Card = {
    _id: `card:${randomUUID()}`,
    type: 'card',
    boardId,
    listId,
    title: data.title,
    description: data.description,
    priority: data.priority,
    position: data.position ?? 0,
    createdAt: new Date().toISOString(),
    tags: data.tags,
    progress: data.progress,
    assignee: data.assignee,
  };
  await kanbansDB.insert(card);
  return card;
}

// ---------------------- Create List ----------------------

export async function createListAction(payload: unknown, boardId: string, boardSlug: string) {
  const data = createListSchema.parse(payload);

  // Fetch existing lists for this board to compute the next stable position.
  const existing = await kanbansDB.find({
    selector: { type: 'list', boardId },
  });
  const position = existing.docs.length;
  const list: List = {
    _id: `list:${randomUUID()}`,
    type: 'list',
    boardId,
    title: data.title,
    position,
    color: data.color,
  };

  await kanbansDB.insert(list);
  return list;
}

// ---------------------- Delete List ----------------------
export async function deleteListAction(boardId: string, listId: string, boardSlug: string) {
  const list = (await kanbansDB.get(listId)) as List;

  // Security: ensure list belongs to board
  if (list.boardId !== boardId) {
    throw new Error('List does not belong to this board');
  }

  await kanbansDB.destroy(list._id, list._rev!);
}
/********************Add Delete cards belonging to this list (batch job)**************/

// ---------------------- Delete Card ----------------------

export async function deleteCardAction(
  //***** to avoid positional arguments, use objects later
  boardId: string,
  cardId: string,
  listId: string,
  boardSlug: string,
) {
  const card = (await kanbansDB.get(cardId)) as Card;

  // Security: ensure card belongs to board + list
  if (card.boardId !== boardId || card.listId !== listId) {
    throw new Error('Card does not belong to this list or board');
  }
  await kanbansDB.destroy(card._id, card._rev!);
}
