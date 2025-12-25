import { Router } from 'express';
import { UserRole } from '@repo/db';
import { authenticate } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import {
  getTeachers,
  createTeacher,
  updateTeacher,
  resetTeacherPassword,
  deleteTeacher,
  getCurrentTeacher,
  updateCurrentTeacher,
} from '../controllers/teacher.controller.js';
import type { Router as ExpressRouter } from 'express';

const router: ExpressRouter = Router();

router.use(authenticate);

router.get('/me', requireRole([UserRole.INSTRUCTOR]), getCurrentTeacher);
router.patch('/me', requireRole([UserRole.INSTRUCTOR]), updateCurrentTeacher);

router.use(requireRole([UserRole.ADMIN]));

router.get('/', getTeachers);
router.post('/', createTeacher);
router.patch('/:id', updateTeacher);
router.post('/:id/reset-password', resetTeacherPassword);
router.delete('/:id', deleteTeacher);

export { router as teachersRouter };
