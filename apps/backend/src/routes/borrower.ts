import { Router, type Request, type Response } from 'express';
import * as borrowerController from '../controllers/borrower.controller.ts';
import * as borrowerRepo from '../repositories/BorrowerRepository.ts';
import * as loansController from '../controllers/loan.controller.ts';

const router: Router = Router();

router.get('/borrowers', borrowerController.getBorrowers);
router.post('/borrowers', borrowerController.getBorrowers);
// router.get('/borrowers/:borrowerId', borrowerController.getBorrower);
router.get('/borrowers/:sevispassId', async (req: Request, res: Response) => {
    const borrower = await borrowerRepo.findBorrowerBySevisPassId(String(req.params.sevispassId));
    if (!borrower) {
        return res.status(404).json({ error: 'Borrower not found' });
    }
    res.json(borrower);
});

router.get('/borrowers/:sevispassId/dashboard', async (req: Request, res: Response) => {
    const borrower = await borrowerRepo.findBorrowerBySevisPassId(String(req.params.sevispassId));
    if (!borrower) {
        return res.status(404).json({ error: 'Borrower not found' });
    }

    const applications = await borrowerRepo.getBorrowerLoanApplications(borrower.id);
    const applicationsWithRepayments = await Promise.all(
        applications.map(async (application: any) => ({
            ...application,
            repayments: await borrowerRepo.getLoanRepayments(application.id),
        }))
    );

    res.json({ borrower, applications: applicationsWithRepayments });
});

router.post('/borrowers/:sevispassId/applications', async (req: Request, res: Response) => {
    const borrower = await borrowerRepo.findBorrowerBySevisPassId(String(req.params.sevispassId));
    if (!borrower) {
        return res.status(404).json({ error: 'Borrower not found' });
    }

    const { amount, term, purpose } = req.body ?? {};
    if (typeof amount !== 'number' || amount <= 0 || typeof term !== 'string' || typeof purpose !== 'string') {
        return res.status(400).json({ error: 'amount (positive number), term, and purpose are required' });
    }

    const application = await borrowerRepo.createLoanApplication(borrower.id, { amount, term, purpose });
    res.status(201).json({ ...application, repayments: [] });
});

export default router;