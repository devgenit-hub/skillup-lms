import { Router, type IRouter } from 'express';
import { CourseController } from '../controllers/course.controller.js';

export const coursesRouter: IRouter = Router();

// Course routes - see /docs/routes.yaml for API documentation
coursesRouter.get('/', CourseController.getAll);
coursesRouter.get('/:id', CourseController.getById);
coursesRouter.post('/', CourseController.create);
coursesRouter.put('/:id', CourseController.update);
coursesRouter.delete('/:id', CourseController.delete);
