// One-off migration: adds the `photo` column to the already-live Borrower
// table (the bootstrap CREATE TABLE in migration.ts only applies to fresh
// databases). Safe to re-run — a duplicate-column error is swallowed.
import { libsqlClient as client } from './index.ts';

try {
    await client.execute('ALTER TABLE Borrower ADD COLUMN photo TEXT');
    console.log('Added Borrower.photo column');
} catch (error: any) {
    if (String(error?.message ?? error).includes('duplicate column name')) {
        console.log('Borrower.photo column already exists, skipping');
    } else {
        throw error;
    }
}

client.close();
