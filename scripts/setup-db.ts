// scripts/setup-db.ts

/**
 * Ensures required CouchDB Mango indexes exist.
 * Run this script manually when DB schema changes
 * (e.g. new sort fields or selector fields).
 *
 * pnpm dlx ts-node scripts/setup-db.ts
 */
/*
import { ensureIndexes } from '@/lib/indexes';

async function setup() {
  await ensureIndexes();
  console.log('CouchDB indexes ensured');
}

setup().catch((err) => {
  console.error('Failed to setup DB indexes:', err);
  process.exit(1);
});
*/
