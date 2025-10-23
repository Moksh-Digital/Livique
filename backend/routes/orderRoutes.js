// backend/routes/orderRoutes.js

import express from 'express';
const router = express.Router();
import { addOrderItems, getMyOrders } from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js'; // Your existing auth middleware

// Use 'protect' middleware to ensure only logged-in users can access these routes
router.route('/').post(protect, addOrderItems);
router.route('/my-orders').get(protect, getMyOrders);

export default router;