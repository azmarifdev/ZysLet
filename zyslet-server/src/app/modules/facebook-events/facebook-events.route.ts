import express from 'express';
import { FacebookEventsController } from './facebook-events.controller';

const router = express.Router();

// Route for sending events with Meta Business documentation payload structure
router.post('/send-event', FacebookEventsController.sendEventsToFacebook);

// Route for sending test purchase event
router.get('/test-purchase', FacebookEventsController.sendTestPurchaseEvent);

// Route for hashing user data (email, phone)
router.post('/hash-user-data', FacebookEventsController.hashUserData);

export const FacebookEventsRoutes = router;
