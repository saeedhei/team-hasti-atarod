// GET / PUT / DELETE for a single board

import { NextResponse } from 'next/server';
import { boardsDB } from '@/lib/couchdb';
import type { Board } from '@/types/board';
import { updateBoardSchema } from '@/validations/board';

// ---------- Types ----------
interface Params {
  params: { id: string };
}

interface NanoError {
  statusCode?: number;
  error?: string;
  message?: string;
  reason?: string;
}

// ---------- Type Guards ----------
function isNanoError(err: unknown): err is NanoError {
  return (
    typeof err === 'object' &&
    err !== null &&
    ('statusCode' in err || 'error' in err || 'reason' in err || 'message' in err)
  );
}

function getStatus(err: unknown): number {
  if (isNanoError(err) && typeof err.statusCode === 'number') {
    return err.statusCode;
  }
  return 500;
}

function getMessage(err: unknown): string {
  if (isNanoError(err)) {
    if (typeof err.reason === 'string') return err.reason;
    if (typeof err.message === 'string') return err.message;
    if (typeof err.error === 'string') return err.error;
  }
  return 'Unknown error';
}

// ---------- GET /api/boards/[id] ----------
export async function GET(_: Request, { params }: Params) {
  try {
    const board = (await boardsDB.get(params.id)) as Board;
    return NextResponse.json({ board });
  } catch (error: unknown) {
    return NextResponse.json({ error: getMessage(error) }, { status: getStatus(error) });
  }
}

// ---------- PUT /api/boards/[id] ----------
export async function PUT(req: Request, { params }: Params) {
  try {
    const body = await req.json();
    const parsed = updateBoardSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ errors: parsed.error.flatten() }, { status: 400 });
    }

    const existing = (await boardsDB.get(params.id)) as Board;

    const updated: Board = {
      ...existing,
      ...parsed.data,
    };

    const result = await boardsDB.insert(updated);

    return NextResponse.json({
      message: 'Board updated',
      id: result.id,
    });
  } catch (error: unknown) {
    return NextResponse.json({ error: getMessage(error) }, { status: getStatus(error) });
  }
}

// ---------- DELETE /api/boards/[id] ----------
export async function DELETE(_: Request, { params }: Params) {
  try {
    const existing = (await boardsDB.get(params.id)) as Board;

    const result = await boardsDB.destroy(existing._id, existing._rev!);

    return NextResponse.json({
      message: 'Board deleted',
      id: result.id,
    });
  } catch (error: unknown) {
    return NextResponse.json({ error: getMessage(error) }, { status: getStatus(error) });
  }
}
