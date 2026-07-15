import { Router, type Request, type Response } from 'express';
import * as authController from '../controllers/auth.controller.ts';

const router: Router = Router();

router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/logout', authController.logout);
router.post('/refresh', authController.refresh);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.post('/callback', authController.callback);
router.post('/initiate', authController.initiate);
// Proxies to the SSO server so the browser never sees CLIENT_SECRET.
router.get('/sessionstatus', authController.sessionStatus);
router.get('/user', authController.user);

export default router;
