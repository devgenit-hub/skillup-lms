import { Router, type IRouter } from 'express';
import { EnrollmentController } from '../controllers/enrollment.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

export const enrollmentsRouter: IRouter = Router();

// Student-specific routes (must be before /:id to avoid conflicts)
enrollmentsRouter.get('/my', authenticate, EnrollmentController.getMyEnrollments);
enrollmentsRouter.get(
  '/my/course/:courseId',
  authenticate,
  EnrollmentController.getMyCourseDetails
);
enrollmentsRouter.post(
  '/my/course/:courseId/lesson/:lessonId/progress',
  authenticate,
  EnrollmentController.updateLessonProgress
);

// Webinar registration routes
enrollmentsRouter.get('/my/webinars', authenticate, EnrollmentController.getMyWebinarRegistrations);
enrollmentsRouter.get(
  '/my/webinar/:webinarId',
  authenticate,
  EnrollmentController.getMyWebinarDetails
);

// Admin routes
enrollmentsRouter.get('/', authenticate, EnrollmentController.getAll);
enrollmentsRouter.get('/:id', authenticate, EnrollmentController.getById);
enrollmentsRouter.post('/', authenticate, EnrollmentController.create);
enrollmentsRouter.put('/:id', authenticate, EnrollmentController.update);
enrollmentsRouter.delete('/:id', authenticate, EnrollmentController.delete);
