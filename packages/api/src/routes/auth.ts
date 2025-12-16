import { Router, type IRouter } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authLimiter } from '../middleware/rateLimiter.js';

export const authRouter: IRouter = Router();

authRouter.post('/sync', authLimiter, AuthController.sync);
authRouter.get('/me', authenticate, AuthController.getMe);
authRouter.patch('/profile', authenticate, AuthController.updateProfile);
authRouter.post('/logout', authenticate, AuthController.logout);
