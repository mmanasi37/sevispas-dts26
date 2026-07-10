import { Pool } from 'pg'
import { Kysely, PostgresDialect } from 'kysely'
import { FileMigrationProvider, Migrator } from 'kysely/migration'
import { Database } from '../types.js';

const dialect = new PostgresDialect({
    pool: new Pool({
        database: 'test',
        host: 'localhost',
        user: 'admin',
        port: 5434,
        max: 10,
    })
});

export const db = new Kysely<Database>({
    dialect,
})

// const migratorConfig = {
//     db,
//     provider: new FileMigrationProvider({}),
//     allowUnorderedMigrations: true
// };

// const migrator = new Migrator(migratorConfig)
// await migrator.migrateToLatest()
