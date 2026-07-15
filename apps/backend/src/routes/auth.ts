import { Router, type Request, type Response } from 'express';
import * as authController from '../controllers/auth.controller.ts';

const router: Router = Router();

// Systems route
router.post('/auth/login', authController.login);
router.post('/auth/register', authController.register);
router.post('/auth/logout', authController.logout);
router.post('/auth/refresh', authController.refresh);
router.post('/auth/forgot-password', authController.forgotPassword);
router.post('/auth/reset-password', authController.resetPassword);

// SevisPass routes
router.post('/auth/callback', authController.callback);
router.post('/auth/initiate', authController.initiate);
// Proxies to the SSO server so the browser never sees CLIENT_SECRET.
router.get('/auth/session-status', authController.sessionStatus);
router.get('/auth/user', authController.user);

export default router;
