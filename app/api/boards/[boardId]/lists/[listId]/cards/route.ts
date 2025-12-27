// app/api/boards/[boardId]/lists/[listId]/cards/route.ts
// GET + POST cards for a list

import { NextResponse } from 'next/server';
import { kanbansDB } from '@/lib/couchdb';
import type { Card } from '@/types/card';
import { createCardSchema } from '@/validations/card';
import { randomUUID } from 'crypto';

interface RouteContext {
  params: Promise<{
    boardId: string;
    listId: string;
  }>;
}

// ---------- GET ----------
export async function GET(_: Request, props: RouteContext) {
  const { boardId, listId } = await props.params;

  try {
    const result = await kanbansDB.find({
      selector: {
        type: 'card',
        boardId: boardId,
        listId: listId,
      },
    });

    return NextResponse.json(
      {
        cards: result.docs as Card[],
        total: result.docs.length,
      },
      { status: 200 },
    );
  } catch (err) {
    console.error('GET Cards Error:', err);
    return NextResponse.json({ error: 'Failed to fetch cards' }, { status: 500 });
  }
}

// ---------- POST ----------
export async function POST(req: Request, props: RouteContext) {
  const { boardId, listId } = await props.params;

  try {
    const body = await req.json();
    const parsed = createCardSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ errors: parsed.error.flatten() }, { status: 400 });
    }

    const now = new Date().toISOString();
    const card: Card = {
      _id: `card:${randomUUID()}`,
      type: 'card',
      boardId: boardId,
      listId: listId,
      title: parsed.data.title,
      description: parsed.data.description,
      priority: parsed.data.priority,
      //ordering via DB
      createdAt: now,
      updatedAt: now,
    };

    const result = await kanbansDB.insert(card);

    return NextResponse.json({ message: 'Card created', id: result.id }, { status: 201 });
  } catch (err) {
    console.error('POST Card Error:', err);
    return NextResponse.json({ error: 'Failed to create card' }, { status: 500 });
  }
}
