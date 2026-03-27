import express from 'express';
import { TrackingController } from './tracking.controller';

const router = express.Router();

// Route for tracking various events
router.post('/event', TrackingController.trackEvent);

export const TrackingRoutes = router;
