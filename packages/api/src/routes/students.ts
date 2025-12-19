import { Router, type IRouter } from 'express';
import { StudentController } from '../controllers/student.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { requireAdmin } from '../middleware/role.middleware.js';

export const studentsRouter: IRouter = Router();

studentsRouter.get('/', authenticate, requireAdmin, StudentController.getAll);
studentsRouter.get('/:id', authenticate, requireAdmin, StudentController.getById);
studentsRouter.post('/', authenticate, requireAdmin, StudentController.create);
studentsRouter.put('/:id', authenticate, requireAdmin, StudentController.update);
studentsRouter.patch('/:id/suspend', authenticate, requireAdmin, StudentController.suspend);
studentsRouter.patch('/:id/unsuspend', authenticate, requireAdmin, StudentController.unsuspend);
studentsRouter.delete('/:id', authenticate, requireAdmin, StudentController.delete);
