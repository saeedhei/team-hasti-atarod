//components/BacklogRow.tsx

'use client';

import { Task } from '@/types/kanban';
import { TaskCard } from './TaskCard';
interface BacklogRowProps {
  title?: string;
  tasks: Task[];
}
export function BacklogRow({ title = 'Backlog', tasks }: BacklogRowProps) {
  return (
    <section className="w-full">
      {/* Header */}
      <header className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold flex items-center gap-2 text-slate-900">
          <span className="inline-block h-3 w-3 rounded-full bg-slate-400" />
          {title}
        </h2>
        <span className="text-sm text-slate-500">{tasks.length}</span>
      </header>

      {/* Horizontal scroll area */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </section>
  );
}
