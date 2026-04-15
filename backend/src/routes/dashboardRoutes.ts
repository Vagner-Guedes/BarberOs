import { Router } from 'express';
import { dashboardController } from '../controllers/dashboardController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.use(authMiddleware);
router.get('/stats', dashboardController.getStats);
router.get('/recent-appointments', dashboardController.getRecentAppointments);
router.get('/appointments-by-status', dashboardController.getAppointmentsByStatus);
router.get('/appointments-by-day', dashboardController.getAppointmentsByDay);

export default router;
