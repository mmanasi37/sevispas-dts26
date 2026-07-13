import '../env.ts';
import { createClient } from '@libsql/client';

const client = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
});

const statements = [
    `CREATE TABLE IF NOT EXISTS borrowers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sevispass_id TEXT NOT NULL UNIQUE,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email TEXT,
        credit_score INTEGER NOT NULL DEFAULT 0,
        member_since TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )`,
    `CREATE TABLE IF NOT EXISTS loan_applications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        reference TEXT NOT NULL UNIQUE,
        borrower_id INTEGER NOT NULL REFERENCES borrowers(id),
        amount INTEGER NOT NULL,
        term TEXT NOT NULL,
        purpose TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        rejection_reason TEXT,
        submitted_at TEXT NOT NULL DEFAULT (datetime('now')),
        decided_at TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS repayments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        loan_application_id INTEGER NOT NULL REFERENCES loan_applications(id),
        due_date TEXT NOT NULL,
        amount INTEGER NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        paid_at TEXT
    )`,
];

for (const sql of statements) {
    await client.execute(sql);
}

console.log('Migration complete: borrowers, loan_applications, repayments');
client.close();
