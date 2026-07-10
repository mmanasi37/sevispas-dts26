import { sql } from 'kysely'
import { db } from '../src/database/index'
import * as UserRepository from '../src/repositories/UserRepository'

describe('UserRepository', () => {
    before(async () => {
        await db.schema.createTable('User')
            .addColumn('id', 'serial', (cb) => cb.primaryKey())
            .addColumn('first_name', 'varchar', (cb) => cb.notNull())
            .addColumn('last_name', 'varchar')
            .addColumn('gender', 'varchar(50)', (cb) => cb.notNull())
            .addColumn('created_at', 'timestamp', (cb) =>
                cb.notNull().defaultTo(sql`now()`)
            )
            .execute()
    })

    afterEach(async () => {
        await sql`truncate table ${sql.table('User')}`.execute(db)
    })

    after(async () => {
        await db.schema.dropTable('User').execute()
    })

    it('should find a user with a given id', async () => {
        await UserRepository.findUserById(123)
    })

    it('should find all people named Arnold', async () => {
        await UserRepository.findPeople({ first_name: 'Arnold' })
    })

    it('should update gender of a user with a given id', async () => {
        await UserRepository.updateUser(123, { gender: 'woman' })
    })

    it('should create a user', async () => {
        await UserRepository.createUser({
            first_name: 'Jennifer',
            last_name: 'Aniston',
            gender: 'woman',
        })
    })

    it('should delete a user with a given id', async () => {
        await UserRepository.deleteUser(123)
    })
})