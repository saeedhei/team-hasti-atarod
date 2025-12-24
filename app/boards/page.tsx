// app/boards/page.tsx
import Link from 'next/link';
import { revalidatePath } from 'next/cache';
import { kanbansDB } from '@/lib/couchdb';
import { generateSlug } from '@/lib/slug';
import { randomUUID } from 'crypto';
import type { Board } from '@/types/board';
import { createBoardSchema } from '@/validations/board';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

// Server Action: create board
async function createBoard(formData: FormData) {
  'use server';

  const rawData = {
    title: formData.get('title'),
    description: formData.get('description'),
  };

  const data = createBoardSchema.parse({
    title: typeof rawData.title === 'string' ? rawData.title : '',
    description:
      typeof rawData.description === 'string' && rawData.description.trim() !== ''
        ? rawData.description.trim()
        : undefined,
  });
  const now = new Date().toISOString();
  const board: Board = {
    _id: `board:${randomUUID()}`,
    type: 'board',
    title: data.title.trim(),
    slug: generateSlug(data.title),
    description: data.description,
    createdAt: now,
    updatedAt: now,
  };

  await kanbansDB.insert(board);
  revalidatePath('/boards');
}

// Server Action: delete board
async function deleteBoard(boardId: string) {
  'use server';
  const board = (await kanbansDB.get(boardId)) as Board;

  if (!board._rev) {
    throw new Error('Missing document revision');
  }

  await kanbansDB.destroy(board._id, board._rev);
  revalidatePath('/boards');
}

// Main page — Server Component
export default async function BoardsPage() {
  let boards: Board[] = [];

  try {
    const result = await kanbansDB.find({
      selector: { type: 'board' },
      //sort: [{ createdAt: 'asc' }],
    });

    boards = result.docs as Board[];
  } catch (err) {
    console.error('Failed to load boards:', err);
  }

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-36">
        {/* Create Board Tile */}
        <Dialog>
          <DialogTrigger asChild>
            <Card className="cursor-pointer flex items-center justify-center p-6 hover:shadow-lg transition">
              <div className="flex items-center gap-2 text-lg font-medium text-gray-700">
                <Plus className="h-5 w-5" /> <span>Create Board</span>
              </div>
            </Card>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create a new board</DialogTitle>
            </DialogHeader>

            <form action={createBoard} className="flex flex-col gap-4 mt-4">
              <Input name="title" placeholder="Board title..." required minLength={1} />
              <Textarea
                name="description"
                placeholder="Description..."
                className="resize-none"
                minLength={1}
              />

              <div className="flex justify-end gap-2">
                <DialogTrigger asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </DialogTrigger>

                <Button type="submit">Create</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {boards.map((board) => (
          <Card key={board._id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex justify-between items-center gap-4">
                <span className="truncate">{board.title}</span>
                <div className="flex gap-2">
                  {/* Open button */}
                  <Link href={`/boards/${board.slug}`}>
                    <Button variant="default" size="sm">
                      Open
                    </Button>
                  </Link>
                  <form action={deleteBoard.bind(null, board._id)}>
                    <Button type="submit" variant="destructive" size="sm">
                      Delete
                    </Button>
                  </form>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">{board.description || 'No description'}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
