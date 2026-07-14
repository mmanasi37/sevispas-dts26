import path from 'path'
import { Pool } from 'pg'
import { promises as fs } from 'fs'
import { Kysely, PostgresDialect } from 'kysely'
import { FileMigrationProvider, Migrator } from 'kysely/migration'
import type { Database } from './schema.ts'
import { db } from './index.ts';
import { libsqlClient as client } from './index.ts';

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

// for (const sql of statements) {
//   await client.execute(sql);
// }

console.log('Migration complete: borrowers, loan_applications, repayments');
// client.close();

const migratorConfig = {
  allowUnorderedMigrations: true,
  db,
  provider: new FileMigrationProvider({
    fs,
    path,
    // point to the folder containing your migration files
    migrationFolder: path.join(__dirname, './migrations'),
  }),
};

const migrator = new Migrator(migratorConfig)

async function runMigrations() {
  const { error, results } = await migrator.migrateToLatest();

  if (results) {
    results.forEach((it) => {
      if (it.status === 'Success') {
        console.log(`migration "${it.migrationName}" was executed successfully`);
      } else if (it.status === 'Error') {
        console.error(`failed to execute migration "${it.migrationName}"`);
      }
    });
  }

  if (error) {
    console.error('failed to migrate')
    console.error(error)
    process.exit(1)
  }

  await db.destroy();
}

runMigrations();
