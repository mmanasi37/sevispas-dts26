import 'dotenv/config';
// import { Pool } from 'pg';
import { createPool } from 'mysql2/promise';
import { Kysely, MysqlDialect, PostgresDialect } from 'kysely';
import { LibsqlDialect } from '@libsql/kysely-libsql';
import { createClient } from '@libsql/client';
import { type Database, type LoanApplicationStatusTable, type LoanApplicationTable } from './schema.ts';
import type { LoanApplication, LoanApplicationStatus } from './types.ts';

// const pgDialect = new PostgresDialect({
//     pool: new Pool({
//         database: 'sevispass_db',
//         host: 'localhost',
//         port: 5432,
//         user: 'db_admin',
//         password: 'secr3t',
//         // schema: 'system_v1'
//     })
// });

export const mysqlDialect = new MysqlDialect({
    pool: createPool({
        database: 'sevispass_db',
        host: 'localhost',
        user: 'root',
        password: 'secr3t',
    })
});

export const libsqlClient = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
});

const dialect = new LibsqlDialect({
    client: libsqlClient,
});

export const db = new Kysely<Database>({
    dialect,
});

// const tenant = "system_v1";
// db.withSchema(tenant)

// Utility to map related data
type Relation<T, U> = {
    parent: T;
    children?: U[];
    parentOf?: U;
};
// Helper for type-safe joins
type JoinResult<A, B> = A & { related: B | null };
// Strongly typed version
type ApplicationWithStatus = JoinResult<
    LoanApplication,
    LoanApplicationStatus
>;

class RelationBuilder<T, U> {
    constructor(
        private parentTable: string,
        private childTable: string,
        private foreignKey: keyof U
    ) { }

    async mapOneToMany(parents: T[], children: U[]): Promise<Relation<T, U>[]> {
        const childMap = new Map<number | string, U[]>();

        children.forEach(child => {
            const key = child[this.foreignKey] as any;
            if (!childMap.has(key)) {
                childMap.set(key, []);
            }
            childMap.get(key)!.push(child);
        });

        return parents.map(parent => ({
            parent,
            children: childMap.get((parent as any).id) || []
        }));
    }

    async joinOneToOne<A extends { id: number }, B extends { id: number }>(
        items: A[],
        relatedItems: B[],
        foreignKey: keyof B
    ): Promise<JoinResult<A, B>[]> {
        const relatedMap = new Map<number, B>();
        relatedItems.forEach(item => {
            relatedMap.set((item[foreignKey] as any) as number, item);
        });

        return items.map(item => ({
            ...item,
            related: relatedMap.get(item.id) || null
        }));
    }

}

// const applications = await db.selectFrom('LoanApplication').selectAll().execute();
// const statuses = await db.selectFrom('LoanApplicationStatus').selectAll().execute();

// const relationBuilder = new RelationBuilder<
//     LoanApplication,
//     LoanApplicationStatus
// >('LoanApplication', 'LoanApplicationStatus', 'loan_application_id');

// const mapped = await relationBuilder.mapOneToMany(applications, statuses);
// console.log("", mapped);

// const applicationsWithStatus = relationBuilder.joinOneToOne(
//     applications,
//     statuses,
//     'loan_application_id'
// );

// const s = await applicationsWithStatus.then(e => e[0])
// console.log("", s);
