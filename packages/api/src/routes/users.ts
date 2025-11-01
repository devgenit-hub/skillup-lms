import { Router, type IRouter } from 'express';
import { UserController } from '../controllers/user.controller.js';

export const usersRouter: IRouter = Router();

// User routes - see /docs/routes.yaml for API documentation
usersRouter.get('/', UserController.getAll);
usersRouter.get('/:id', UserController.getById);
usersRouter.post('/', UserController.create);
usersRouter.put('/:id', UserController.update);
usersRouter.delete('/:id', UserController.delete);
