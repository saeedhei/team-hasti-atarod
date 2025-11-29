// app/boards/[id]/BoardClient.tsx
// UI-only Kanban board component.
// - No data fetching
'use client';
import { TaskDetails } from './TaskDetails';
import dynamic from 'next/dynamic';
import React, { useCallback, useMemo, useState } from 'react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// ---------- Types ----------
export type Priority = 'low' | 'medium' | 'high';

export type Tag = {
  id: string;
  label: string;
};

export type Task = {
  id: string;
  title: string;
  description?: string;
  tags?: Tag[];
  assignee?: { id: string; name: string; initials?: string };
  priority?: Priority;
  progress?: number; // 0–100
};

export type Column = {
  id: string;
  title: string;
  color?: string; // tailwind color class or hex
  tasks: Task[];
};

export type Board = {
  id: string;
  title: string;
  columns: Column[];
};

// Utility: friendly id generator (not cryptographically secure)
const id = (prefix = '') => `${prefix}${Math.random().toString(36).slice(2, 9)}`;

// ---------- Task Card ----------
const TaskCard: React.FC<{ task: Task; onClick?: () => void }> = React.memo(({ task, onClick }) => {
  return (
    <article
      className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-150 cursor-pointer"
      aria-labelledby={`task-${task.id}-title`}
      role="button"
      onClick={onClick}
    >
      <h3 id={`task-${task.id}-title`} className="text-sm font-semibold text-slate-900">
        {task.title}
      </h3>

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
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.max(0, Math.min(100, task.progress))}%`,
                    background: '#F59E0B',
                  }}
                />
              </div>
              <div className="text-slate-500 text-[10px] mt-1">{task.progress}%</div>
            </div>
          )}

          {task.assignee && (
            <Avatar className="h-7 w-7">
              <AvatarFallback>
                {task.assignee.initials ?? task.assignee.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      </div>
    </article>
  );
});
TaskCard.displayName = 'TaskCard';

// ---------- Column View ----------
const ColumnView: React.FC<{
  column: Column;
  onTaskClick: (task: Task) => void;
  onAddTaskClick: (columnId: string) => void;
}> = ({ column, onTaskClick, onAddTaskClick }) => {
  return (
    <section aria-labelledby={`col-${column.id}-title`} className="w-full max-w-xs">
      <div className="flex items-center justify-between mb-3">
        <h2
          id={`col-${column.id}-title`}
          className="text-sm font-semibold text-slate-900 flex items-center gap-2"
        >
          <span
            className={cn('inline-block h-3 w-3 rounded-full', column.color ?? 'bg-slate-400')}
            aria-hidden
          />
          {column.title}
        </h2>

        <span className="text-sm text-slate-500">{column.tasks.length}</span>
      </div>

      <div className="space-y-3">
        {column.tasks.map((task) => (
          <TaskCard key={task.id} task={task} onClick={() => onTaskClick(task)} />
        ))}
      </div>
      <Button
        variant="outline"
        size="sm"
        className="w-full"
        onClick={() => onAddTaskClick(column.id)}
      >
        + Add Task
      </Button>
    </section>
  );
};

// ---------- Main UI Component ----------
export default function BoardClient({ initialBoard }: { initialBoard?: Board }) {
  // IMPORTANT: fallback board is created *CLIENT-ONLY*
  const [board, setBoard] = useState<Board>(() => {
    return (
      initialBoard ?? {
        id: 'board-' + id(),
        title: 'Website Redesign Project',
        columns: [
          {
            id: 'backlog',
            title: 'Backlog',
            color: 'bg-slate-400',
            tasks: [
              {
                id: id('t-'),
                title: 'User Research Analysis',
                description: 'Analyze user feedback and create personas',
                tags: [{ id: id('tag-'), label: 'Research' }],
                priority: 'high',
              },
              {
                id: id('t-'),
                title: 'Content Strategy',
                description: 'Develop content hierarchy',
                tags: [{ id: id('tag-'), label: 'Content' }],
                priority: 'medium',
              },
            ],
          },
          {
            id: 'todo',
            title: 'To Do',
            color: 'bg-sky-400',
            tasks: [
              {
                id: id('t-'),
                title: 'Homepage Wireframes',
                description: 'Create low-fidelity wireframes',
              },
            ],
          },
          {
            id: 'inprogress',
            title: 'In Progress',
            color: 'bg-amber-400',
            tasks: [
              {
                id: id('t-'),
                title: 'Navigation Component',
                description: 'Develop responsive navigation',
                tags: [{ id: id('tag-'), label: 'Frontend' }],
                progress: 65,
                priority: 'medium',
              },
            ],
          },
          {
            id: 'completed',
            title: 'Completed',
            color: 'bg-emerald-400',
            tasks: [
              {
                id: id('t-'),
                title: 'Project Setup',
                description: 'Init repo and env',
                tags: [{ id: id('tag-'), label: 'Setup' }],
                priority: 'low',
              },
            ],
          },
        ],
      }
    );
  });
  const [isCreating, setIsCreating] = useState(false);
  // Task detail drawer states
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskOpen, setIsTaskOpen] = useState(false);
  const [targetColumnId, setTargetColumnId] = useState<string | null>(null);

  const columns = useMemo(() => board.columns, [board.columns]);

  // Add task (local UI state only)
  const addTask = useCallback(
    (columnId: string, payload: Pick<Task, 'title' | 'description' | 'priority'>) => {
      setBoard((prev) => {
        const newTask: Task = {
          id: id('t-'),
          title: payload.title,
          description: payload.description,
          priority: payload.priority ?? 'low',
        };

        const newColumns = prev.columns.map((col) =>
          col.id === columnId ? { ...col, tasks: [newTask, ...col.tasks] } : col,
        );

        return { ...prev, columns: newColumns };
      });
    },
    [],
  );

  return (
    <main className="p-6 max-w-full">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">{board.title}</h1>

        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button onClick={() => setTargetColumnId(null)}>Add Task</Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Create task</DialogTitle>
            </DialogHeader>

            <CreateTaskForm
              columns={columns}
              selectedColumnId={targetColumnId ?? undefined}
              onCreate={(colId, payload) => {
                addTask(colId, payload);
                setIsCreating(false);
              }}
            />
          </DialogContent>
        </Dialog>
      </header>
      <Drawer open={isTaskOpen} onOpenChange={setIsTaskOpen}>
        <DrawerContent className="w-1/2 ml-auto p-6 overflow-auto">
          {selectedTask && <TaskDetails task={selectedTask} onClose={() => setIsTaskOpen(false)} />}
        </DrawerContent>
      </Drawer>

      {/* Columns */}
      <section className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide">
        {columns.map((col) => (
          <div key={col.id} className="shrink-0" style={{ width: 320 }}>
            <ColumnView
              column={col}
              onTaskClick={(task) => {
                setSelectedTask(task);
                setIsTaskOpen(true);
              }}
              onAddTaskClick={(columnId) => {
                setTargetColumnId(columnId); // set column for auto-select
                setIsCreating(true); // open modal
              }}
            />
          </div>
        ))}
      </section>
    </main>
  );
}

// ---------- Create Task Form ----------
const CreateTaskForm: React.FC<{
  columns: Column[];
  selectedColumnId?: string;
  onCreate: (
    columnId: string,
    payload: { title: string; description?: string; priority?: Priority },
  ) => void;
}> = ({ columns, selectedColumnId, onCreate }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [columnId, setColumnId] = useState(selectedColumnId ?? columns[0]?.id ?? '');
  const [priority, setPriority] = useState<Priority>('low');

  const disabled = title.trim().length === 0;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (disabled) return;

        onCreate(columnId, {
          title: title.trim(),
          description: description.trim() || undefined,
          priority,
        });

        setTitle('');
        setDescription('');
      }}
      className="space-y-4"
    >
      <div>
        <Label htmlFor="task-title">Title</Label>
        <Input id="task-title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>

      <div>
        <Label htmlFor="task-desc">Description</Label>
        <Input
          id="task-desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="task-column">Column</Label>
        <select
          id="task-column"
          className="w-full p-2 border rounded-md"
          value={columnId}
          onChange={(e) => setColumnId(e.target.value)}
        >
          {columns.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label>Priority</Label>
        <div className="flex gap-2 mt-1">
          {(['low', 'medium', 'high'] as Priority[]).map((p) => (
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

      <div className="flex justify-end">
        <Button type="submit" disabled={disabled}>
          Create
        </Button>
      </div>
    </form>
  );
};
