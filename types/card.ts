// types/card.ts

import type { MaybeDocument } from 'nano';

export type Priority = 'low' | 'medium' | 'high';

export interface Card extends MaybeDocument {
  _id: string;
  _rev?: string;

  type: 'card';

  boardId: string;
  listId: string;

  title: string;
  description?: string;
  priority?: Priority;
  position: number;
  createdAt?: string;
  tags?: { id: string; label: string }[];
  progress?: number;
  assignee?: { id: string; name: string; initials?: string };
}
