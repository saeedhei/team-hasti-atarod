//app/Board-page-sidebar/page.tsx

import { BacklogRow } from '@/components/BacklogRow';
import { Task } from '@/types/kanban';

const mockTasks: Task[] = [
  {
    id: 't1',
    title: 'User Research Analysis',
    description: 'Analyze user feedback and create personas',
    tags: [{ id: 'tag1', label: 'Research' }],
  },
  {
    id: 't2',
    title: 'Content Strategy',
    description: 'Plan content flow',
    tags: [{ id: 'tag2', label: 'Content' }],
  },
  {
    id: 't3',
    title: 'Wireframe Audit',
    description: 'Review low fidelity designs',
  },
  {
    id: 't4',
    title: 'User Research Analysis',
    description: 'Analyze user feedback and create personas',
    tags: [{ id: 'tag1', label: 'Research' }],
  },
  {
    id: 't5',
    title: 'Content Strategy',
    description: 'Plan content flow',
    tags: [{ id: 'tag2', label: 'Content' }],
  },
  {
    id: 't6',
    title: 'Wireframe Audit',
    description: 'Review low fidelity designs',
  },
];

export default function Board() {
  return (
    <main className="p-6">
      <BacklogRow tasks={mockTasks} />
    </main>
  );
}
