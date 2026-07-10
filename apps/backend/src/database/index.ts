import { Pool } from 'pg';
import { Kysely, PostgresDialect } from 'kysely';
import { FileMigrationProvider, Migrator } from 'kysely/migration';
import { type Database } from './schema.js';

const dialect = new PostgresDialect({
    pool: new Pool({
        database: 'sevispass_db',
        host: 'localhost',
        port: 5432,
        user: 'db_admin',
        password: 'secr3t',
        // schema: 'system_v1'
    })
});

export const db = new Kysely<Database>({
    dialect,
});

// const tenant = "system_v1";
// db.withSchema(tenant)
