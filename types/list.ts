//types/list.ts

import type { MaybeDocument } from 'nano';

export interface List extends MaybeDocument {
  _id: string;
  _rev?: string;
  type: 'list';

  boardId: string;
  title: string;
  color?: string;

  createdAt: string;
  updatedAt: string;
}
