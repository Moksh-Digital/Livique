// backend/controllers/orderController.js

import asyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';
import User from '../models/userModel.js'; // Assuming you have this

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  const { items, address, paymentMethod, subtotal, deliveryCharges, total } = req.body;

  if (items && items.length === 0) {
    res.status(400);
    throw new Error('No order items');
  } else {
    // 1. Create the order
    const order = new Order({
      user: req.user._id, // req.user is set by authMiddleware
      items,
      address,
      paymentMethod,
      subtotal,
      deliveryCharges,
      total,
      // Status is 'Confirmed' by default as per model
    });

    const createdOrder = await order.save();
    
    // 2. Clear the user's cart after successful order placement
    // Assuming your user model has a cart field (see 1.C)
    const user = await User.findById(req.user._id);
    if (user) {
        user.cart = []; // Clear the cart field
        await user.save();
    }


    res.status(201).json(createdOrder);
  }
});

// @desc    Get logged in user's orders
// @route   GET /api/orders/my-orders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});


export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email address") // fetch user details
      .populate("products.productId", "name price") // optional: fetch product info
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch orders." });
  }
};

export { addOrderItems, getMyOrders };