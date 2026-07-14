import { Router } from 'express';
import * as staffController from '../controllers/staff.controller.ts';
import * as loansController from '../controllers/loan.controller.ts';

const router: Router = Router();

router.get('/staffs', staffController.getStaffs);
router.get('/staffs/:staffId', staffController.getStaff);

export default router;