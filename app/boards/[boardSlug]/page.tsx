// app/boards/[boardTitle]/page.tsx
import { kanbansDB } from '@/lib/couchdb';
import BoardClient from './BoardClient';
import type { Board } from '@/types/board';
import type { List } from '@/types/list';
import type { Card } from '@/types/card';

type PageProps = {
  params: Promise<{ boardSlug: string }>;
};

export default async function BoardPage({ params }: PageProps) {
  const { boardSlug } = await params;

  const boardResult = await kanbansDB.find({
    selector: {
      type: 'board',
      slug: boardSlug,
    },
    limit: 1,
  });

  if (boardResult.docs.length === 0) {
    return <div className="p-6">Board not found</div>;
  }
  const board = boardResult.docs[0] as Board;

  const [listResult, cardResult] = await Promise.all([
    kanbansDB.find({
      selector: { type: 'list', boardId: board._id },
    }),
    kanbansDB.find({
      selector: { type: 'card', boardId: board._id },
    }),
  ]);

  const lists = listResult.docs as List[];
  const cards = cardResult.docs as Card[];

  return <BoardClient initialBoard={board} initialLists={lists} initialCards={cards} />;
}
