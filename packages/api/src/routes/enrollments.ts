import { Router, type IRouter } from 'express';
import { EnrollmentController } from '../controllers/enrollment.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

export const enrollmentsRouter: IRouter = Router();

enrollmentsRouter.get('/', authenticate, EnrollmentController.getAll);
enrollmentsRouter.get('/:id', authenticate, EnrollmentController.getById);
enrollmentsRouter.post('/', authenticate, EnrollmentController.create);
enrollmentsRouter.put('/:id', authenticate, EnrollmentController.update);
enrollmentsRouter.delete('/:id', authenticate, EnrollmentController.delete);
