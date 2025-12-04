// app/boards/[boardTitle]/page.tsx
import { boardsDB } from '@/lib/couchdb';
import BoardClient from './BoardClient';
import type { Board } from '@/types/board';

type PageProps = {
  params: Promise<{ boardTitle: string }>;
};

export default async function BoardPage({ params }: PageProps) {
  // Await the params before accessing the ID
  const { boardTitle } = await params;
  const decoded = decodeURIComponent(boardTitle);

  let board: Board | null = null;

  try {
    board = (await boardsDB.get(decoded)) as Board;
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

/**interface PageProps {
  params: {
    boardTitle: string;
  };
}

export default function BoardPage({ params }: PageProps) {
  const { boardTitle } = params;

  return <div>{boardTitle}</div>;
}
**/
