// app/api/boards/[boardId]/lists/[listId]/cards/route.ts
// GET + POST cards for a list

import { NextResponse } from 'next/server';
import { kanbansDB } from '@/lib/couchdb';
import type { Card } from '@/types/card';
import { createCardSchema } from '@/validations/card';

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

    const card: Card = {
      _id: `card:${crypto.randomUUID()}`,
      type: 'card',
      boardId: boardId,
      listId: listId,
      title: parsed.data.title,
      description: parsed.data.description,
      priority: parsed.data.priority,
      position: parsed.data.position ?? 0,
      createdAt: new Date().toISOString(),
    };

    await kanbansDB.insert(card);

    return NextResponse.json({ message: 'Card created' }, { status: 201 });
  } catch (err) {
    console.error('POST Card Error:', err);
    return NextResponse.json({ error: 'Failed to create card' }, { status: 500 });
  }
}
