// One-off migration: adds the extra SevisPass-disclosed profile columns to
// the already-live Borrower table (the bootstrap CREATE TABLE in migration.ts
// only applies to fresh databases). Safe to re-run — duplicate-column errors
// are swallowed per-column since SQLite only allows one ADD COLUMN per ALTER.
import { libsqlClient as client } from './index.ts';

const columns = [
    ['marital_status', 'VARCHAR(20)'],
    ['gender', 'VARCHAR(10)'],
    ['title', 'VARCHAR(20)'],
    ['nationality', 'VARCHAR(100)'],
    ['district', 'TEXT'],
    ['issue_date', 'DATE'],
    ['expiry_date', 'DATE'],
];

for (const [column, type] of columns) {
    try {
        await client.execute(`ALTER TABLE Borrower ADD COLUMN ${column} ${type}`);
        console.log(`Added Borrower.${column} column`);
    } catch (error: any) {
        if (String(error?.message ?? error).includes('duplicate column name')) {
            console.log(`Borrower.${column} column already exists, skipping`);
        } else {
            throw error;
        }
    }
}

client.close();
