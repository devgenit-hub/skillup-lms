import { Router } from 'express';
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

router.get('/me', requireRole(['INSTRUCTOR']), getCurrentTeacher);
router.patch('/me', requireRole(['INSTRUCTOR']), updateCurrentTeacher);

router.use(requireRole(['ADMIN']));

router.get('/', getTeachers);
router.post('/', createTeacher);
router.patch('/:id', updateTeacher);
router.post('/:id/reset-password', resetTeacherPassword);
router.delete('/:id', deleteTeacher);

export { router as teachersRouter };
