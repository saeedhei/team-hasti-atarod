// app/boards/[boardTitle]/page.tsx
import { db } from '@/lib/couchdb';
import BoardClient from './BoardClient';
import type { Board } from '@/types/board';

type PageProps = {
  params: Promise<{ boardSlug: string }>;
};

export default async function BoardPage({ params }: PageProps) {
  const { boardSlug } = await params;

  const result = await db.find({
    selector: {
      type: 'board',
      slug: boardSlug,
    },
    limit: 1,
  });

  if (result.docs.length === 0) {
    return <div className="p-6">Board not found</div>;
  }

  const board = result.docs[0] as Board;

  return <BoardClient initialBoard={board} />;
}
