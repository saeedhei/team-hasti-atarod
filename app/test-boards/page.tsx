// app/test-boards/page.tsx
import Link from 'next/link';
import { revalidatePath } from 'next/cache';
import { boardsDB } from '@/lib/couchdb';
import type { Board } from '@/types/board';
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

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '');
}

// Conversion function without using any
function asBoard(doc: unknown): Board | null {
  if (!doc || typeof doc !== 'object') return null;

  const candidate = doc as Record<string, unknown>;

  if (typeof candidate._id !== 'string') return null;
  if (candidate.type !== 'board') return null;
  if (typeof candidate.title !== 'string' || candidate.title.trim() === '') return null;

  return {
    _id: candidate._id,
    _rev: typeof candidate._rev === 'string' ? candidate._rev : undefined,
    type: 'board',
    title: candidate.title,
    description: typeof candidate.description === 'string' ? candidate.description : undefined,
  };
}

// Server Action: create board
async function createBoard(formData: FormData) {
  'use server';
  const title = formData.get('title');
  const description = formData.get('description');
  if (typeof title !== 'string' || title.trim() === '') return;

  try {
    await boardsDB.insert({
      _id: `${slugify(title.trim())}-${Math.random().toString(36).slice(2, 7)}`,
      type: 'board',
      title: title.trim(),
      description: typeof description === 'string' ? description.trim() : undefined,
    } as Board);
    revalidatePath('/test-boards');
  } catch (err) {
    console.error('Failed to create board:', err);
  }
}

// Server Action: delete board
async function deleteBoard(id: string) {
  'use server';
  try {
    const doc = await boardsDB.get(id);
    if (doc && typeof doc === 'object') {
      const candidate = doc as unknown as Record<string, unknown>;
      if (typeof candidate._rev === 'string') {
        await boardsDB.destroy(id, candidate._rev);
      }
    }
  } catch (error) {
    const err = error as { error?: string };
    if (err.error !== 'not_found') {
      console.error('Delete failed:', error);
    }
  } finally {
    revalidatePath('/test-boards');
  }
}

// Main page — Server Component
export default async function BoardsPage() {
  let boards: Board[] = [];
  let errorMsg: string | null = null;

  try {
    const result = await boardsDB.list({ include_docs: true });

    const rawDocs = result.rows.map((row) => row.doc as unknown);

    const validBoards = rawDocs.map(asBoard).filter((board): board is Board => board !== null);

    boards = validBoards;
  } catch (err) {
    console.error('Failed to load boards:', err);
    errorMsg = 'Failed to load boards';
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
                  <Link href={`/boards/${board._id}`}>
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
