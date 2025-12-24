// app/api/boards/[boardId]/lists/route.ts
// GET + POST lists for a board

import { NextResponse } from 'next/server';
import { kanbansDB } from '@/lib/couchdb';
import type { List } from '@/types/list';
import { createListSchema } from '@/validations/list';

interface Params {
  params: { boardId: string };
}

// ---------- GET ----------

export async function GET(_: Request, { params }: Params) {
  try {
    const result = await kanbansDB.find({
      selector: {
        type: 'list',
        boardId: params.boardId,
      },
    });

    return NextResponse.json({ lists: result.docs as List[] });
  } catch (err) {
    console.error('GET Lists Error:', err);
    return NextResponse.json({ error: 'Failed to fetch lists' }, { status: 500 });
  }
}

// ---------- POST  ----------

export async function POST(req: Request, { params }: Params) {
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
      boardId: params.boardId,
      title: parsed.data.title,
      color: parsed.data.color,
      //ordering via DB
      createdAt: now,
      updatedAt: now,
    };

    await kanbansDB.insert(list);

    return NextResponse.json({ message: 'List created' }, { status: 201 });
  } catch (err) {
    console.error('POST List Error:', err);
    return NextResponse.json({ error: 'Failed to create list' }, { status: 500 });
  }
}
