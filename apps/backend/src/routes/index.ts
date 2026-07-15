import { Router, type Request, type Response } from 'express';
import * as loansController from '../controllers/loan.controller.ts';
import * as rolesController from '../controllers/staff.controller.ts';
import * as permissionsController from '../controllers/staff.controller.ts';
import borrower from './borrower.ts';
import staff from './staff.ts';

const router: Router = Router();
router.use(borrower);
router.use(staff);

router.get('/', (req: Request, res: Response) => {
    res.json({
        status: "healthy"
    });
});

router.post('/apply_loan', loansController.applyLoan);
router.get('/loan_types', loansController.getLoanTypes);
router.get('/loan_types/:loanTypeId', loansController.getLoanType);
router.put('/loan_types/:loanTypeId', loansController.updateLoanType);

router.get('/loans', loansController.getLoanApplications);
router.get('/loans/:loanId', loansController.getLoanApplication);
router.put('/loans/:loanId', loansController.updateLoanApplication);
router.get('/loans/:loanId/repayments', loansController.getLoanApplicationRepayments);
router.get('/loans/:loanId/status', loansController.getLoanApplicationStatus);
router.post('/loans/:loanId/submit', loansController.submitLoanApplication);
router.post('/loans/:loanId/cancel', loansController.cancelLoanApplication);

// router.get('/roles', rolesController.findPeople);
// router.get('/permissions', permissionsController.findPeople);

export default router;