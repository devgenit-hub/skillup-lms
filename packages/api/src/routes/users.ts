import { Router, type IRouter } from 'express';
import { UserController } from '../controllers/user.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { requireAdmin } from '../middleware/role.middleware.js';

export const usersRouter: IRouter = Router();

usersRouter.get('/', authenticate, requireAdmin, UserController.getAll);
usersRouter.get('/:id', authenticate, requireAdmin, UserController.getById);
usersRouter.post('/', authenticate, requireAdmin, UserController.create);
usersRouter.put('/:id', authenticate, requireAdmin, UserController.update);
usersRouter.delete('/:id', authenticate, requireAdmin, UserController.delete);
usersRouter.post('/change-password', authenticate, UserController.changePassword);
