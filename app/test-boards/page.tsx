// app/test-boards/page.tsx
import { revalidatePath } from 'next/cache';
import { boardsDB } from '@/lib/couchdb';
import type { Board } from '@/types/board';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// تابع تبدیل بدون هیچ any
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

// Server Action: ایجاد برد
async function createBoard(formData: FormData) {
  'use server';
  const title = formData.get('title');
  if (typeof title !== 'string' || title.trim() === '') return;

  try {
    await boardsDB.insert({
      _id: new Date().toISOString(),
      type: 'board',
      title: title.trim(),
    } as Board);
    revalidatePath('/test-boards');
  } catch (err) {
    console.error('Failed to create board:', err);
  }
}

// Server Action: حذف برد
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

// صفحه اصلی — Server Component
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
    errorMsg = 'خطا در بارگذاری بردها';
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Your Boards</h1>

      {errorMsg && <p className="text-red-500">{errorMsg}</p>}

      <form action={createBoard} className="flex gap-2 items-center">
        <Input
          name="title"
          placeholder="عنوان برد جدید"
          required
          minLength={1}
          maxLength={100}
          className="max-w-sm"
        />
        <Button type="submit">ساختن برد</Button>
      </form>

      {boards.length === 0 ? (
        <p className="text-gray-500">هنوز هیچ بردی ساخته نشده.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {boards.map((board) => (
            <Card key={board._id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex justify-between items-center gap-4">
                  <span className="truncate">{board.title}</span>
                  <form action={deleteBoard.bind(null, board._id)}>
                    <Button type="submit" variant="destructive" size="sm">
                      حذف
                    </Button>
                  </form>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{board.description || 'بدون توضیحات'}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
