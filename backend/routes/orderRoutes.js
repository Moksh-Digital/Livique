import express from "express";
import { addOrderItems, getMyOrders, getAllOrders, updateOrderTracking } from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";
import Order from '../models/orderModel.js';


const router = express.Router();

// Public/Admin route: get all orders
router.get('/', async (req, res) => {
  try {
    // Populate user info from the 'User' collection
    const orders = await Order.find().populate('user', 'name email');

    res.status(200).json(orders);
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

// Authenticated routes
router.post("/", protect, addOrderItems);
router.get("/my-orders", protect, getMyOrders);

// Admin route: Update tracking ID
router.put("/:orderId/tracking", updateOrderTracking);

export default router;
