// app/api/boards/[boardId]/lists/route.ts
// GET + POST lists for a board

import { NextResponse } from 'next/server';
import { kanbansDB } from '@/lib/couchdb';
import type { List } from '@/types/list';
import { createListSchema } from '@/validations/list';

interface RouteContext {
  params: Promise<{ boardId: string }>;
}
// ---------- GET ----------

export async function GET(_: Request, props: RouteContext) {
  const { boardId } = await props.params;
  try {
    const result = await kanbansDB.find({
      selector: {
        type: 'list',
        boardId: boardId,
      },
    });

    return NextResponse.json(
      {
        lists: result.docs as List[],
        total: result.docs.length,
      },
      { status: 200 },
    );
  } catch (err) {
    console.error('GET Lists Error:', err);
    return NextResponse.json({ error: 'Failed to fetch lists' }, { status: 500 });
  }
}

// ---------- POST  ----------

export async function POST(req: Request, props: RouteContext) {
  const { boardId } = await props.params;
  try {
    const body = await req.json();
    const parsed = createListSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ errors: parsed.error.flatten() }, { status: 400 });
    }

    const now = new Date().toISOString();
    const list: List = {
      _id: `list:${crypto.randomUUID()}`,
      type: 'list',
      boardId: boardId,
      title: parsed.data.title,
      position: parsed.data.position ?? 0,
      color: parsed.data.color,
      createdAt: now,
      updatedAt: now,
    };

    const result = await kanbansDB.insert(list);

    return NextResponse.json({ message: 'List created', id: result.id }, { status: 201 });
  } catch (err) {
    console.error('POST List Error:', err);
    return NextResponse.json({ error: 'Failed to create list' }, { status: 500 });
  }
}
