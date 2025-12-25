import { Router, type IRouter } from 'express';
import { StudentController } from '../controllers/student.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { requireAdmin } from '../middleware/role.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import { UserRole } from '@repo/db';

export const studentsRouter: IRouter = Router();

// Teacher accessible endpoints
studentsRouter.get(
  '/teacher',
  authenticate,
  requireRole([UserRole.INSTRUCTOR]),
  StudentController.getByTeacher
);
studentsRouter.patch(
  '/teacher/:id/suspend',
  authenticate,
  requireRole([UserRole.INSTRUCTOR]),
  StudentController.suspendByTeacher
);
studentsRouter.patch(
  '/teacher/:id/unsuspend',
  authenticate,
  requireRole([UserRole.INSTRUCTOR]),
  StudentController.unsuspendByTeacher
);

// Admin only endpoints
studentsRouter.get('/', authenticate, requireAdmin, StudentController.getAll);
studentsRouter.get('/:id', authenticate, requireAdmin, StudentController.getById);
studentsRouter.post('/', authenticate, requireAdmin, StudentController.create);
studentsRouter.put('/:id', authenticate, requireAdmin, StudentController.update);
studentsRouter.patch('/:id/suspend', authenticate, requireAdmin, StudentController.suspend);
studentsRouter.patch('/:id/unsuspend', authenticate, requireAdmin, StudentController.unsuspend);
studentsRouter.delete('/:id', authenticate, requireAdmin, StudentController.delete);
