//components/TaskCard
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Task } from '@/types/kanban';
import { cn } from '@/lib/utils';
export function TaskCard({ task }: { task: Task }) {
  return (
    <Card className="w-64 shrink-0 cursor-pointer hover:shadow-md transition-shadow">
      <CardContent className="p-4 space-y-3">
        {/* Title */}
        <h3 className="text-sm font-semibold text-slate-900">{task.title}</h3>

        {/* Description */}
        {task.description && <p className="text-xs text-slate-600">{task.description}</p>}

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {task.tags?.slice(0, 3).map((tag) => (
            <Badge key={tag.id} className="text-xs px-2 py-1">
              {tag.label}
            </Badge>
          ))}
        </div>

        {/* Assignee */}
        {task.assignee && (
          <Avatar className="h-7 w-7">
            <AvatarFallback>
              {task.assignee.initials ?? task.assignee.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        )}
      </CardContent>
    </Card>
  );
}
