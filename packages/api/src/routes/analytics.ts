import { Router } from 'express';
import { AnalyticsController } from '../controllers/analytics.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { requireAdmin } from '../middleware/requireRole.js';

const router = Router();

router.use(authenticate, requireAdmin);

router.get('/dashboard', AnalyticsController.getDashboardStats);
router.get('/revenue', AnalyticsController.getRevenueAnalytics);
router.get('/students', AnalyticsController.getStudentAnalytics);
router.get('/courses', AnalyticsController.getCourseAnalytics);

export default router;
