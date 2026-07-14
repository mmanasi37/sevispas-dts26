import { sql, type Kysely } from 'kysely'
import type { Database } from '../schema.ts';

export async function up(db: Kysely<Database>): Promise<void> {
	await db.schema.createTable('Staff').addColumn('id', 'serial').addColumn('first_name', 'varchar(255)').addColumn('last_name', 'varchar(255)').addColumn('email', 'varchar(255)').addColumn('phone', 'varchar(255)').addColumn('role', 'varchar(255)').addColumn('created_at', 'timestamp').addColumn('updated_at', 'timestamp').execute();
	await db.schema.createTable('Staff').addColumn('id', 'serial').addColumn('first_name', 'varchar(255)').addColumn('last_name', 'varchar(255)').addColumn('email', 'varchar(255)').addColumn('phone', 'varchar(255)').addColumn('role', 'varchar(255)').addColumn('created_at', 'timestamp').addColumn('updated_at', 'timestamp').execute();

	await db.schema
		.createTable('User')
		.addColumn('id', 'serial', (col) => col.primaryKey())
		.addColumn('first_name', 'varchar', (col) => col.notNull())
		.addColumn('last_name', 'varchar')
		.addColumn('gender', 'varchar(50)', (col) => col.notNull())
		.addColumn('created_at', 'timestamp', (col) =>
			col.defaultTo(sql`now()`).notNull(),
		)
		.execute()

	await db.schema
		.createTable('pet')
		.addColumn('id', 'serial', (col) => col.primaryKey())
		.addColumn('name', 'varchar', (col) => col.notNull().unique())
		.addColumn('owner_id', 'integer', (col) =>
			col.references('user.id').onDelete('cascade').notNull(),
		)
		.addColumn('species', 'varchar', (col) => col.notNull())
		.execute()

	await db.schema
		.createIndex('pet_owner_id_index')
		.on('pet')
		.column('owner_id')
		.execute()
}

export async function down(db: Kysely<Database>): Promise<void> {
	await db.schema.dropTable('pet').execute()
	await db.schema.dropTable('User').execute()

	await db.schema.dropTable('Staff').execute();
}
