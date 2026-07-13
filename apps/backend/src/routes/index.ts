import { Router, Request, Response } from 'express';
import { db } from '../database/index.js';
import {
    findBorrowerBySevisPassId,
    getBorrowerLoanApplications,
    getLoanRepayments,
    createLoanApplication,
} from '../repositories/BorrowerRepository.js';

const router: Router = Router();

router.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
});

router.get('/borrowers/:sevispassId', async (req: Request, res: Response) => {
    const borrower = await findBorrowerBySevisPassId(String(req.params.sevispassId));
    if (!borrower) {
        return res.status(404).json({ error: 'Borrower not found' });
    }
    res.json(borrower);
});

router.get('/borrowers/:sevispassId/dashboard', async (req: Request, res: Response) => {
    const borrower = await findBorrowerBySevisPassId(String(req.params.sevispassId));
    if (!borrower) {
        return res.status(404).json({ error: 'Borrower not found' });
    }

    const applications = await getBorrowerLoanApplications(borrower.id);
    const applicationsWithRepayments = await Promise.all(
        applications.map(async (application) => ({
            ...application,
            repayments: await getLoanRepayments(application.id),
        }))
    );

    res.json({ borrower, applications: applicationsWithRepayments });
});

router.post('/borrowers/:sevispassId/applications', async (req: Request, res: Response) => {
    const borrower = await findBorrowerBySevisPassId(String(req.params.sevispassId));
    if (!borrower) {
        return res.status(404).json({ error: 'Borrower not found' });
    }

    const { amount, term, purpose } = req.body ?? {};
    if (typeof amount !== 'number' || amount <= 0 || typeof term !== 'string' || typeof purpose !== 'string') {
        return res.status(400).json({ error: 'amount (positive number), term, and purpose are required' });
    }

    const application = await createLoanApplication(borrower.id, { amount, term, purpose });
    res.status(201).json({ ...application, repayments: [] });
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
