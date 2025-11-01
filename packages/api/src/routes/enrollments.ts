import { Router, type IRouter } from 'express';
import { EnrollmentController } from '../controllers/enrollment.controller.js';

export const enrollmentsRouter: IRouter = Router();

// Enrollment routes - see /docs/routes.yaml for API documentation
enrollmentsRouter.get('/', EnrollmentController.getAll);
enrollmentsRouter.get('/:id', EnrollmentController.getById);
enrollmentsRouter.post('/', EnrollmentController.create);
enrollmentsRouter.put('/:id', EnrollmentController.update);
enrollmentsRouter.delete('/:id', EnrollmentController.delete);
