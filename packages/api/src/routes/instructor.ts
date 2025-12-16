import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import {
  getInstructorStudents,
  suspendStudent,
  unsuspendStudent,
  getStudentPayments,
} from '../controllers/instructor-student.controller.js';

const router = Router();

router.use(authenticate);
router.use(requireRole(['INSTRUCTOR']));

router.get('/students', getInstructorStudents);
router.post('/students/:userId/suspend', suspendStudent);
router.post('/students/:userId/unsuspend', unsuspendStudent);
router.get('/students/:userId/payments', getStudentPayments);

export { router as instructorRouter };
