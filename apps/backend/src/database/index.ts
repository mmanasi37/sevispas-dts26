import { createClient } from '@libsql/client'
import { LibsqlDialect } from '@libsql/kysely-libsql'
import { Kysely } from 'kysely'
import { FileMigrationProvider, Migrator } from 'kysely/migration'
import { Database } from '../types.js';

const dialect = new LibsqlDialect({
    client: createClient({
        url: process.env.TURSO_DATABASE_URL!,
        authToken: process.env.TURSO_AUTH_TOKEN,
    }),
})

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
