import { Router, Request, Response } from 'express';
import { db } from '../database/index.js';

const router: Router = Router();

router.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
});

router.get('/users', async (req: Request, res: Response) => {
    // res.json([{ id: 1, name: 'Alice' }]);

    // const persons = await db
    //     .selectFrom('person')
    //     .select('id')
    //     .where('first_name', '=', 'Arnold')
    //     .execute();

    const catto = await db.transaction().execute(async (trx) => {
        const jennifer = await trx.insertInto('person')
            .values({
                first_name: 'Jennifer',
                last_name: 'Aniston',
                gender: 'male'
            })
            .returning('id')
            .executeTakeFirstOrThrow()

        return await trx.insertInto('pet')
            .values({
                owner_id: jennifer.id,
                name: 'Catto',
                species: 'cat',
                // is_favorite: false,
            })
            .returningAll()
            .executeTakeFirst()
    })

    const persons = await db
        .selectFrom(['person', 'pet'])
        .select('person.id')
        .execute();

    return persons;
});

export default router;
