import { Router, type IRouter } from 'express';
import { CourseController } from '../controllers/course.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { requireInstructor, requireAdmin } from '../middleware/role.middleware.js';
import { validateTeacherCourseAccess } from '../middleware/teacher.middleware.js';

export const coursesRouter: IRouter = Router();

coursesRouter.get('/', CourseController.getAll);

// Teacher-specific route to manage their course (with access validation)
// Must come BEFORE /:id to avoid route conflict
coursesRouter.get(
  '/teacher/:id',
  authenticate,
  requireInstructor,
  validateTeacherCourseAccess,
  CourseController.getById
);

coursesRouter.get('/:id', CourseController.getById);

coursesRouter.get(
  '/:id/students',
  authenticate,
  requireInstructor,
  validateTeacherCourseAccess,
  CourseController.getEnrolledStudents
);

coursesRouter.post('/', authenticate, requireAdmin, CourseController.create);
coursesRouter.post(
  '/:id/assign-teachers',
  authenticate,
  requireAdmin,
  CourseController.assignTeachers
);

// Coupon routes - Admin only
coursesRouter.post('/:id/coupons', authenticate, requireAdmin, CourseController.createCoupon);
coursesRouter.get('/:id/coupons', authenticate, requireAdmin, CourseController.getCoupons);
coursesRouter.patch(
  '/:id/coupons/:couponId',
  authenticate,
  requireAdmin,
  CourseController.toggleCoupon
);
coursesRouter.put(
  '/:id/coupons/:couponId',
  authenticate,
  requireAdmin,
  CourseController.updateCoupon
);
coursesRouter.delete(
  '/:id/coupons/:couponId',
  authenticate,
  requireAdmin,
  CourseController.deleteCoupon
);

// Curriculum routes - Teachers can manage for assigned courses
coursesRouter.get(
  '/:id/curriculum',
  authenticate,
  requireInstructor,
  validateTeacherCourseAccess,
  CourseController.getCurriculum
);
coursesRouter.put(
  '/:id/curriculum',
  authenticate,
  requireInstructor,
  validateTeacherCourseAccess,
  CourseController.updateCurriculum
);

// Course update - Teachers can only update publish status, Admins can update everything
coursesRouter.put(
  '/:id',
  authenticate,
  requireInstructor,
  validateTeacherCourseAccess,
  CourseController.update
);

// Delete course - Admin only
coursesRouter.delete('/:id', authenticate, requireAdmin, CourseController.delete);
