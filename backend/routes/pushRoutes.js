import express from 'express';
import { subscribe, unsubscribe, testNotification } from '../controllers/pushNotificationController.js';

const router = express.Router();

// Subscribe to push notifications
router.post('/subscribe', subscribe);

// Unsubscribe from push notifications
router.post('/unsubscribe', unsubscribe);

// Test notification (admin only)
router.post('/test', testNotification);

export default router;
