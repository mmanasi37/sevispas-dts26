import type { Request, Response } from "express";
import { db } from "../database/index.js";

async function findLoan(req: Request, res: Response) {
    // res.json([{ id: 1, name: 'Alice' }]);

    // const users = await db
    //     .selectFrom('User')
    //     .select('id')
    //     .where('first_name', '=', 'Arnold')
    //     .execute();

    const catto = await db.transaction().execute(async (trx) => {
        const jennifer = await trx.insertInto('User')
            .values({
                first_name: 'Jennifer',
                last_name: 'Aniston',
                gender: 'male'
            })
            .returning('id')
            .executeTakeFirstOrThrow()

        return await trx.insertInto('Borrower')
            .values({
                owner_id: jennifer.id,
                name: 'Catto',
                species: 'cat',
                // is_favorite: false,
            })
            .returningAll()
            .executeTakeFirst()
    })

    const users = await db
        .selectFrom(['User', 'Borrower'])
        .select('user.id')
        .execute();

    return users;
}