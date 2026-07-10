import { db } from '../database/index.js';
import { UserUpdate, User, NewUser } from '../types.js';


const result = await db
    .selectFrom('User')
    // .innerJoin('Users as u', 'u.id', 'p.author_id')
    // .select(['p.title', 'u.name as author_name'])
    .execute();


export async function findUserById(id: number) {
    return await db.selectFrom('User')
        .where('id', '=', id)
        .selectAll()
        .executeTakeFirst();
}

export async function findPeople(criteria: Partial<User>) {
    let query = db.selectFrom('User')

    if (criteria.id) {
        query = query.where('id', '=', criteria.id) // Kysely is immutable, you must re-assign!
    }

    if (criteria.first_name) {
        query = query.where('first_name', '=', criteria.first_name)
    }

    if (criteria.last_name !== undefined) {
        query = query.where(
            'last_name',
            criteria.last_name === null ? 'is' : '=',
            criteria.last_name
        )
    }

    if (criteria.gender) {
        query = query.where('gender', '=', criteria.gender)
    }

    if (criteria.created_at) {
        query = query.where('created_at', '=', criteria.created_at)
    }

    return await query.selectAll().execute()
}

export async function updateUser(id: number, updateWith: UserUpdate) {
    await db.updateTable('User').set(updateWith).where('id', '=', id).execute()
}

export async function createUser(user: NewUser) {
    return await db.insertInto('User')
        .values(user)
        .returningAll()
        .executeTakeFirstOrThrow()
}

export async function deleteUser(id: number) {
    return await db.deleteFrom('User').where('id', '=', id)
        .returningAll()
        .executeTakeFirst()
}