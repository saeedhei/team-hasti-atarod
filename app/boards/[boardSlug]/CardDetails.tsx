'use client';

import { useState } from 'react';
import type { Card } from '@/types/card';
import type { Priority } from '@/types/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

export function CardDetails({ card, onClose }: { card: Card; onClose: () => void }) {
  // Local editable fields
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description ?? '');
  const [priority, setPriority] = useState<Priority>(card.priority ?? 'low');

  // Simple tag editing
  const [tags, setTags] = useState(card.tags?.map((t) => t.label).join(', ') ?? '');

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{title}</h2>
        <Button variant="ghost" onClick={onClose}>
          Close
        </Button>
      </div>

      {/* TASK TITLE */}
      <div>
        <Label htmlFor="task-title">Title</Label>
        <Input
          id="task-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1"
        />
      </div>

      {/* DESCRIPTION */}
      <div>
        <Label htmlFor="task-desc">Description</Label>
        <Textarea
          id="task-desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1"
          rows={4}
        />
      </div>

      {/* PRIORITY SELECT */}
      <div>
        <Label>Priority</Label>
        <div className="flex gap-2 mt-2">
          {(['low', 'medium', 'high'] as Priority[]).map((p) => (
            <Button
              key={p}
              type="button"
              variant="outline"
              onClick={() => setPriority(p)}
              className={cn(
                priority === p ? 'border-blue-600 text-blue-600' : 'border-gray-300 text-gray-600',
              )}
            >
              {p[0].toUpperCase() + p.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* TAGS */}
      <div>
        <Label htmlFor="task-tags">Tags (comma separated)</Label>
        <Input
          id="task-tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="mt-1"
        />
      </div>

      {/* FOOTER */}
      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button
          onClick={() => {
            // Later you can save this to backend or update state
            console.log('Save task changes TODO:');
            console.log({ title, description, priority, tags });
            onClose();
          }}
        >
          Save
        </Button>
      </div>
    </div>
  );
}
