// app/boards/[id]/page.tsx
import { boardsDB } from '@/lib/couchdb';
import BoardClient from './BoardClient';
import type { Board } from '@/types/board';

// In Next.js 15+, params is a Promise
type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function BoardPage({ params }: PageProps) {
  // Await the params before accessing the ID
  const { id } = await params;

  let board: Board | null = null;

  try {
    board = (await boardsDB.get(id)) as Board;
  } catch (err) {
    console.error('BOARD NOT FOUND:', err);
    return <div className="p-6">Board not found</div>;
  }

  return (
    <main className="p-6">
      <BoardClient initialBoard={board} />
    </main>
  );
}
