// lib/couchdb.ts
import nano from 'nano';

if (!process.env.COUCH_URL) {
  throw new Error('COUCH_URL is missing from environment');
}

export const couch = nano(process.env.COUCH_URL);
export const boardsDB = couch.db.use('kanban_test');

// Create a .env.local and add COUCH_URL=http://admin:secret123@127.0.0.1:5984
