import { Router, type Request, type Response } from 'express';
import * as staffController from '../controllers/user.controller.js';
import * as borrowerController from '../controllers/user.controller.js';
import * as loansController from '../controllers/user.controller.js';
import * as authController from '../controllers/user.controller.js';
import * as rolesController from '../controllers/user.controller.js';
import * as permissionsController from '../controllers/user.controller.js';
import * as userController from '../controllers/user.controller.js';

const router: Router = Router();

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

router.get('/staff', staffController.findPeople);
router.get('/borrower', borrowerController.findPeople);
router.get('/loans', loansController.findPeople);

router.get('/auth', authController.findPeople);
router.get('/users', userController.findPeople);
router.get('/roles', rolesController.findPeople);
router.get('/permissions', permissionsController.findPeople);

export default router;
