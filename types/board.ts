// types/board.ts
import type { MaybeDocument } from 'nano';

export interface Board extends MaybeDocument {
  _id: string; // required for identifying the board
  _rev?: string; // CouchDB revision (optional on inserts)
  type: 'board'; // document discriminator

  title: string; // board name/title
  slug: string;
  description?: string; // optional board description

  createdAt: string;
  updatedAt: string;
}
