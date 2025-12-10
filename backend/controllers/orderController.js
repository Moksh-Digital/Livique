// backend/controllers/orderController.js
import asyncHandler from "express-async-handler";
import Order from "../models/orderModel.js";
import User from "../models/userModel.js";
import Product from "../models/productModel.js";
import sendEmail from "../utils/sendEmail.js";
import { generateOrderConfirmationEmail, generateOwnerNotificationEmail } from "../utils/orderEmailTemplate.js";

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

  // Send order confirmation emails (non-blocking - after response)
  if (user) {
    try {
      // Send email to customer
      if (user.email) {
        console.log("📧 Sending order confirmation email to customer:", user.email);
        
        const emailHtml = generateOrderConfirmationEmail(createdOrder, user, items);
        
        const emailResult = await sendEmail({
          to: user.email,
          subject: `Order Confirmed! #${createdOrder._id.toString().substring(0, 8).toUpperCase()} - Livique`,
          html: emailHtml,
        });

        if (emailResult && emailResult.success) {
          console.log("✅ Customer order confirmation email sent successfully");
        } else {
          console.warn("⚠️ Failed to send customer order confirmation email");
        }
      }

      // Send email to owner/admin
      console.log("📧 Sending order notification email to owner: liviqueofficial@gmail.com");
      
      try {
        const ownerEmailHtml = generateOwnerNotificationEmail(createdOrder, user, items);
        console.log("✅ Owner email HTML generated successfully");
        
        const ownerEmailResult = await sendEmail({
          to: "liviqueofficial@gmail.com",
          subject: `New Order Received! #${createdOrder._id.toString().substring(0, 8).toUpperCase()} - ₹${createdOrder.total?.toFixed(2) || "0.00"}`,
          html: ownerEmailHtml,
        });

        if (ownerEmailResult && ownerEmailResult.success) {
          console.log("✅ Owner order notification email sent successfully");
        } else {
          console.warn("⚠️ Failed to send owner order notification email:", ownerEmailResult?.error);
        }
      } catch (ownerEmailErr) {
        console.error("❌ Error generating/sending owner email:", ownerEmailErr.message);
        console.error("Stack:", ownerEmailErr.stack);
      }
    } catch (emailError) {
      console.error("❌ Error sending order confirmation emails:", emailError.message);
    }
  }
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

// @desc    Admin: Update order tracking ID
// @route   PUT /api/orders/:orderId/tracking
// @access  Admin
export const updateOrderTracking = asyncHandler(async (req, res) => {
  const { trackingId } = req.body;
  const { orderId } = req.params;

  if (!trackingId) {
    res.status(400);
    throw new Error("Tracking ID is required");
  }

  // Find the order and populate user info
  const order = await Order.findById(orderId).populate("user", "name email");

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  // Update order with tracking information
  order.trackingId = trackingId;
  order.trackingUpdatedAt = new Date();
  order.status = "Shipped"; // Update status to Shipped

  const updatedOrder = await order.save();

  res.status(200).json({
    success: true,
    message: "Tracking ID updated successfully",
    order: updatedOrder,
  });

  // Send tracking email to customer (non-blocking - after response)
  if (order.user && order.user.email) {
    try {
      console.log("📧 Sending tracking email to customer:", order.user.email);

      const { generateTrackingEmail } = await import("../utils/orderEmailTemplate.js");
      const emailHtml = generateTrackingEmail(order, order.user, order.items);

      const emailResult = await sendEmail({
        to: order.user.email,
        subject: `Your Order Has Been Shipped! 📦 Tracking ID: ${trackingId}`,
        html: emailHtml,
      });

      if (emailResult && emailResult.success) {
        console.log("✅ Tracking email sent successfully");
      } else {
        console.warn("⚠️ Failed to send tracking email");
      }
    } catch (emailError) {
      console.error("❌ Error sending tracking email:", emailError.message);
    }
  }
});

export { addOrderItems, getMyOrders };
