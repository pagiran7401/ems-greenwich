import { Router } from 'express';
import { authenticate, isOrganizer } from '../middleware/auth';
import { getDashboardStats, getEventAnalytics } from '../controllers/analyticsController';

const router = Router();

// Get organizer dashboard stats
router.get('/dashboard', authenticate, isOrganizer, getDashboardStats);

// Get event-specific analytics
router.get('/events/:eventId', authenticate, isOrganizer, getEventAnalytics);

export default router;
