// app/api/boards/route.ts
// GET (board list) + POST (create board)
import { NextResponse } from 'next/server';
import { kanbansDB } from '@/lib/couchdb';
import type { Board } from '@/types/board';
import type { DocumentListResponse } from 'nano';
import { createBoardSchema } from '@/validations/board';
import { randomUUID } from 'crypto';
import { generateSlug } from '@/lib/slug';

export async function GET() {
  try {
    // nano: list() returns docs with type `unknown` instead of Board
    const raw = await kanbansDB.list({ include_docs: true });

    // Let TypeScript know that row.doc is a Board
    const data = raw as DocumentListResponse<Board>;

    const boards = data.rows.flatMap((row) => (row.doc ? [row.doc] : []));

    return NextResponse.json({ boards });
  } catch (err) {
    console.error('GET Boards Error:', err);
    return NextResponse.json({ error: 'Failed to fetch boards' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = createBoardSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ errors: parsed.error.flatten() }, { status: 400 });
    }

    const { title, description } = parsed.data;
    const slug = generateSlug(title);

    const board: Board = {
      _id: `board:${randomUUID()}`,
      type: 'board',
      title,
      slug,
      description,
    };

    const result = await kanbansDB.insert(board);

    return NextResponse.json({ message: 'Board created', id: result.id }, { status: 201 });
  } catch (err) {
    console.error('POST Board Error:', err);
    return NextResponse.json({ error: 'Failed to create board' }, { status: 500 });
  }
}
