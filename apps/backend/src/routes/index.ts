import { Router, type Request, type Response } from 'express';
import * as loansController from '../controllers/loan.controller.ts';
import * as authController from '../controllers/staff.controller.ts';
import * as rolesController from '../controllers/staff.controller.ts';
import * as permissionsController from '../controllers/staff.controller.ts';
import borrower from './borrower.ts';
import staff from './staff.ts';
import { db } from '../database/index.ts';
import {
    findBorrowerBySevisPassId,
    getBorrowerLoanApplications,
    getLoanRepayments,
    createLoanApplication,
} from '../repositories/BorrowerRepository.ts';

const router: Router = Router();
router.use(borrower);
router.use(staff);

router.get('/', (req: Request, res: Response) => {
    res.json({
        status: "healthy"
    });
});

// Staff: StaffTable;
// Borrower: BorrowerTable;
// Loan: LoanTable;
// LoanApplication: LoanApplicationTable;
// LoanStatus: LoanStatusTable;
// LoanHistory: LoanHistoryTable;
// LoanBorrower: LoanBorrowerTable;
// Role: RoleTable;
// Permission: PermissionTable;
// RoleUser: RoleUserTable;
// PermissionRole: PermissionRoleTable;
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

    router.post('/apply_loan', loansController.applyLoan);
    router.get('/loan_types', loansController.getLoanTypes);
    router.get('/loan_types/:loanTypeId', loansController.getLoanType);
    router.put('/loan_types/:loanTypeId', loansController.updateLoanType);

    router.get('/loans', loansController.getLoanApplications);
    router.get('/loans/:loanId', loansController.getLoanApplication);
    router.put('/loans/:loanId', loansController.updateLoanApplication);
    router.get('/loans/:loanId/status', loansController.getLoanApplicationStatus);
    router.post('/loans/:loanId/submit', loansController.submitLoanApplication);
    router.post('/loans/:loanId/cancel', loansController.cancelLoanApplication);

    // router.get('/auth', authController.findPeople);
    // router.get('/roles', rolesController.findPeople);
    // router.get('/permissions', permissionsController.findPeople);

    export default router;