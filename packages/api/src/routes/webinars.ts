import { Router, type IRouter } from 'express';
import { WebinarController } from '../controllers/webinar.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { requireAdmin } from '../middleware/role.middleware.js';

export const webinarsRouter: IRouter = Router();

webinarsRouter.get('/', WebinarController.getAll);
webinarsRouter.get('/:id', WebinarController.getById);
webinarsRouter.post('/', authenticate, requireAdmin, WebinarController.create);
webinarsRouter.put('/:id', authenticate, requireAdmin, WebinarController.update);
webinarsRouter.delete('/:id', authenticate, requireAdmin, WebinarController.delete);
webinarsRouter.post('/:id/register', authenticate, WebinarController.register);
webinarsRouter.delete('/:id/register', authenticate, WebinarController.unregister);
