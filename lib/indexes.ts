// lib/indexes.ts

//if sorting is required in a query, CouchDB requires an index that includes the sorted fields.

/*import { kanbansDB } from './couchdb';

export async function ensureIndexes() {
  // Boards (find by slug)
  await kanbansDB.createIndex({
    index: { fields: ['type', 'slug'] },
  });

  // Lists & Cards (ordered by createdAt)
  await kanbansDB.createIndex({
    index: { fields: ['tupe', 'boardId', 'createdAt'] },
  });

  // Cards by list (future-proof)

  await kanbansDB.createIndex({
    index: { fields: ['type', 'listId', 'createdAt'] },
  });
}
  */
