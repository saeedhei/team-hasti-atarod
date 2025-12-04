// types/board.ts
import type { MaybeDocument } from 'nano';

export type Priority = 'low' | 'medium' | 'high';
export interface Task {
  id: string;
  title: string;
  description?: string;
  priority?: Priority;
  progress?: number;
  tags?: { id: string; label: string }[];
  assignee?: { id: string; name: string; initials?: string };
}

export interface List {
  id: string;
  title: string;
  color?: string;
  tasks: Task[];
}

export interface Board extends MaybeDocument {
  _id: string; // required for identifying the board
  _rev?: string; // CouchDB revision (optional on inserts)
  type: 'board'; // document discriminator
  title: string; // board name/title
  description?: string; // optional board description
  list: List[];
}
