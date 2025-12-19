import { Router, type IRouter } from 'express';
import { CourseController } from '../controllers/course.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { requireInstructor, requireAdmin } from '../middleware/role.middleware.js';

export const coursesRouter: IRouter = Router();

coursesRouter.get('/', CourseController.getAll);
coursesRouter.get('/:id', CourseController.getById);
coursesRouter.get(
  '/:id/students',
  authenticate,
  requireInstructor,
  CourseController.getEnrolledStudents
);

coursesRouter.post('/', authenticate, requireInstructor, CourseController.create);
coursesRouter.post(
  '/:id/assign-teachers',
  authenticate,
  requireAdmin,
  CourseController.assignTeachers
);

coursesRouter.put('/:id', authenticate, requireInstructor, CourseController.update);
coursesRouter.delete('/:id', authenticate, requireInstructor, CourseController.delete);
