import { Router } from 'express';
import { AnalyticsController } from '../controllers/analytics.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { requireAdmin } from '../middleware/role.middleware.js';

const router = Router();

router.use(authenticate, requireAdmin);

router.get('/dashboard', AnalyticsController.getDashboardStats);
router.get('/revenue', AnalyticsController.getRevenueAnalytics);
router.get('/students', AnalyticsController.getStudentAnalytics);
router.get('/courses', AnalyticsController.getCourseAnalytics);

export default router;
