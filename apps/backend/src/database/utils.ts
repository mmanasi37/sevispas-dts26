import { sql } from 'kysely'

export const withTimestampsSqlite = (db: any) => {
    return db
        .addColumn('created_at', 'text', (col: any) =>
            col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
        )
        .addColumn('updated_at', 'text', (col: any) =>
            col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
        )
}