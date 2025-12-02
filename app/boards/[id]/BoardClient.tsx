// app/boards/[id]/BoardClient.tsx
'use client';

import { useCallback, useMemo, useState } from 'react';
import { addTaskAction } from './actions';
import { TaskDetails } from './TaskDetails';
import type { Board, List, Task } from '@/types/board';

import { Drawer, DrawerContent } from '@/components/ui/drawer';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// Utility: simple id generator
const genId = (prefix = '') => `${prefix}${Math.random().toString(36).slice(2, 9)}`;

// ---------------------- Task Card ----------------------
const TaskCard = ({ task, onClick }: { task: Task; onClick?: () => void }) => (
  <article
    className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
    onClick={onClick}
  >
    <h3 className="text-sm font-semibold">{task.title}</h3>

    {task.description && <p className="text-xs text-slate-600 mt-2">{task.description}</p>}

    <div className="mt-3 flex items-center justify-between gap-2">
      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {task.tags?.slice(0, 3).map((t) => (
          <Badge key={t.id} className="text-xs py-1 px-2">
            {t.label}
          </Badge>
        ))}
      </div>

      {/* Progress + Assignee */}
      <div className="flex items-center gap-2">
        {typeof task.progress === 'number' && (
          <div className="w-24 text-xs">
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-yellow-500"
                style={{
                  width: `${Math.min(100, Math.max(0, task.progress))}%`,
                }}
              />
            </div>
            <div className="text-slate-500 text-[10px] mt-1">{task.progress}%</div>
          </div>
        )}

        {task.assignee && (
          <Avatar className="h-7 w-7">
            <AvatarFallback>
              {task.assignee.initials ?? task.assignee.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    </div>
  </article>
);

// ---------------------- List View ----------------------
const ListView = ({
  list,
  onTaskClick,
  onAddTaskClick,
}: {
  list: List;
  onTaskClick: (task: Task) => void;
  onAddTaskClick: (listId: string) => void;
}) => (
  <section className="w-full max-w-xs">
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-sm font-semibold flex items-center gap-2">
        <span className={cn('inline-block h-3 w-3 rounded-full', list.color ?? 'bg-slate-400')} />
        {list.title}
      </h2>
      <span className="text-sm text-slate-500">{list.tasks.length}</span>
    </div>

    <div className="space-y-3">
      {list.tasks.map((task) => (
        <TaskCard key={task.id} task={task} onClick={() => onTaskClick(task)} />
      ))}
    </div>

    <Button
      variant="outline"
      size="sm"
      className="w-full mt-3 cursor-pointer"
      onClick={() => onAddTaskClick(list.id)}
    >
      + Add Task
    </Button>
  </section>
);

// ---------------------- Main Component ----------------------
export default function BoardClient({ initialBoard }: { initialBoard: Board }) {
  const safeBoard: Board = {
    ...initialBoard,
    list: Array.isArray(initialBoard.list) ? initialBoard.list : [],
  };

  const [board, setBoard] = useState<Board>(safeBoard);

  const [isCreating, setIsCreating] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskOpen, setIsTaskOpen] = useState(false);
  const [targetListId, setTargetListId] = useState<string | null>(null);

  const lists = useMemo(() => board.list, [board.list]);

  const boardId = board._id;

  // ---------------- Add Task ----------------
  const addTask = useCallback(
    async (listId: string, payload: Pick<Task, 'title' | 'description' | 'priority'>) => {
      const newTask: Task = {
        id: genId('t-'),
        title: payload.title,
        description: payload.description,
        priority: payload.priority ?? 'low',
      };

      // Optimistic UI update
      setBoard((prev) => ({
        ...prev,
        list: prev.list.map((list) =>
          list.id === listId ? { ...list, tasks: [newTask, ...list.tasks] } : list,
        ),
      }));

      await addTaskAction(boardId, listId, newTask);
    },
    [boardId],
  );

  return (
    <main className="p-6 max-w-full">
      {/* Header */}
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{board.title}</h1>

        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button onClick={() => setTargetListId(null)}>Add Task</Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Create task</DialogTitle>
            </DialogHeader>

            <CreateTaskForm
              lists={lists}
              selectedListId={targetListId ?? undefined}
              onCreate={(listId, payload) => {
                addTask(listId, payload);
                setIsCreating(false);
              }}
            />
          </DialogContent>
        </Dialog>
      </header>

      {/* Task Drawer */}
      <Drawer open={isTaskOpen} onOpenChange={setIsTaskOpen}>
        <DrawerContent className="w-1/2 ml-auto p-6 overflow-auto">
          {selectedTask && <TaskDetails task={selectedTask} onClose={() => setIsTaskOpen(false)} />}
        </DrawerContent>
      </Drawer>

      {/* Lists */}
      <section className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide">
        {lists.map((list) => (
          <div key={list.id} className="shrink-0" style={{ width: 320 }}>
            <ListView
              list={list}
              onTaskClick={(task) => {
                setSelectedTask(task);
                setIsTaskOpen(true);
              }}
              onAddTaskClick={(listId) => {
                setTargetListId(listId);
                setIsCreating(true);
              }}
            />
          </div>
        ))}
      </section>
    </main>
  );
}

// ---------------------- Create Task Form ----------------------
const CreateTaskForm = ({
  lists,
  selectedListId,
  onCreate,
}: {
  lists: List[];
  selectedListId?: string;
  onCreate: (listId: string, payload: Pick<Task, 'title' | 'description' | 'priority'>) => void;
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [listId, setListId] = useState(selectedListId ?? lists[0]?.id ?? '');
  const [priority, setPriority] = useState<Task['priority']>('low');

  const disabled = title.trim().length === 0;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!disabled) {
          onCreate(listId, {
            title: title.trim(),
            description: description.trim() || undefined,
            priority,
          });

          setTitle('');
          setDescription('');
        }
      }}
      className="space-y-4"
    >
      {/* Title */}
      <div>
        <Label htmlFor="title">Title</Label>
        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>

      {/* Description */}
      <div>
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {/* List Select */}
      <div>
        <Label>List</Label>
        <select
          className="w-full p-2 border rounded-md"
          value={listId}
          onChange={(e) => setListId(e.target.value)}
        >
          {lists.map((l) => (
            <option key={l.id} value={l.id}>
              {l.title}
            </option>
          ))}
        </select>
      </div>

      {/* Priority */}
      <div>
        <Label>Priority</Label>
        <div className="flex gap-2 mt-1">
          {(['low', 'medium', 'high'] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPriority(p)}
              className={cn(
                'px-3 py-1 rounded-md border',
                priority === p ? 'border-black' : 'border-slate-200',
              )}
            >
              {p[0].toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <Button type="submit" disabled={disabled}>
          Create
        </Button>
      </div>
    </form>
  );
};
