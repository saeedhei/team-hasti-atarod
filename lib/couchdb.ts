// lib/couchdb.ts
import nano from 'nano';

if (!process.env.COUCH_URL) {
  throw new Error('COUCH_URL is missing from environment');
}

export const couch = nano(process.env.COUCH_URL);
export const boardsDB = couch.db.use('kanban_test');

async function checkDatabaseConnection(retries = 5, delay = 2000) {
  for (let i = 0; i < retries; i++) {
    try {
      await couch.db.get('kanban_test');
      console.log('✅ CouchDB is online.');
      return;
    } catch (error) {
      // Use 'error' instead of 'err' to match convention
      console.error(`❌ Attempt ${i + 1} - CouchDB is offline. Retrying in ${delay}ms...`);
      console.error(error); // explicitly log the error object
      if (i === retries - 1) {
        console.error('❌ CouchDB is still offline. Exiting.');
        process.exit(1);
      }
      await new Promise((res) => setTimeout(res, delay));
    }
  }
}

checkDatabaseConnection();

// Create a .env.local and add COUCH_URL=http://admin:secret123@127.0.0.1:5984
