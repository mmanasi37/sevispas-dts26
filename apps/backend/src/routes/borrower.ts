import { Router } from 'express';
import * as borrowerController from '../controllers/borrower.controller.ts';
import * as loansController from '../controllers/loan.controller.ts';

const router: Router = Router();

router.get('/borrowers', borrowerController.getBorrowers);
router.post('/borrowers', borrowerController.getBorrowers);
router.get('/borrowers/:borrowerId', borrowerController.getBorrower);

export default router;