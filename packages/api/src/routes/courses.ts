import { Router, type IRouter } from 'express';
import { CourseController } from '../controllers/course.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { requireInstructor } from '../middleware/role.middleware.js';

export const coursesRouter: IRouter = Router();

coursesRouter.get('/', CourseController.getAll);
coursesRouter.get('/:id', CourseController.getById);

coursesRouter.post('/', authenticate, requireInstructor, CourseController.create);
coursesRouter.put('/:id', authenticate, requireInstructor, CourseController.update);
coursesRouter.delete('/:id', authenticate, requireInstructor, CourseController.delete);
