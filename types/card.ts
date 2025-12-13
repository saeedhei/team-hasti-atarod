// types/card.ts

import type { MaybeDocument } from 'nano';

export type Priority = 'low' | 'medium' | 'high';

export interface Card extends MaybeDocument {
  type: 'card';
  boardId: string;
  listId: string;

  title: string;
  description?: string;
  priority?: Priority;
  position: number;
}
