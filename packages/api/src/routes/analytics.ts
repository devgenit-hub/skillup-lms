import { Router, type Router as RouterType } from 'express';
import { AnalyticsController } from '../controllers/analytics.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { requireAdmin } from '../middleware/role.middleware.js';

const router: RouterType = Router();

router.use(authenticate, requireAdmin);

router.get('/dashboard', AnalyticsController.getDashboardStats);
router.get('/revenue', AnalyticsController.getRevenueAnalytics);
router.get('/students', AnalyticsController.getStudentAnalytics);
router.get('/courses', AnalyticsController.getCourseAnalytics);
router.get('/purchases', AnalyticsController.getPurchaseAnalytics);
router.get('/enrollments', AnalyticsController.getEnrollmentAnalytics);
router.get('/course-revenue', AnalyticsController.getCourseRevenueAnalytics);
router.get('/items', AnalyticsController.getItemsForAnalytics);

export default router;
