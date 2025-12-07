// backend/controllers/orderController.js
import asyncHandler from "express-async-handler";
import Order from "../models/orderModel.js";
import User from "../models/userModel.js";
import Product from "../models/productModel.js";

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    items,
    address,
    paymentMethod,
    paymentStatus,
    subtotal,
    deliveryCharges,
    total,
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
  } = req.body;

  if (!items || items.length === 0) {
    res.status(400);
    throw new Error("No order items");
  }

  // Decrease product quantities for each item in the order
  for (const item of items) {
    const product = await Product.findById(item.id);
    if (product) {
      // Decrease quantity by the ordered amount
      product.quantity = Math.max(0, product.quantity - item.quantity);
      // Set inStock to false if quantity reaches 0
      if (product.quantity === 0) {
        product.inStock = false;
      }
      await product.save();
    }
  }

  // Create the order
  const order = new Order({
    user: req.user._id,
    items,
    address,
    paymentMethod,
    subtotal,
    deliveryCharges,
    total,
    paymentStatus: paymentStatus || (paymentMethod === "razorpay" ? "Paid" : "Pending"),
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
  });

  const createdOrder = await order.save();

  // Clear user's cart if you store it in DB
  const user = await User.findById(req.user._id);
  if (user) {
    user.cart = [];
    await user.save();
  }

  res.status(201).json(createdOrder);
});

// @desc    Get logged-in user's orders
// @route   GET /api/orders/my-orders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

// @desc    Admin: Get all orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch orders." });
  }
};

export { addOrderItems, getMyOrders };
