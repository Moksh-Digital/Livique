import express from "express";
import Query from "../models/queryModel.js";
import Order from "../models/orderModel.js";
import { sendToAdmins } from "../controllers/pushNotificationController.js";
import { protect as authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ CREATE QUERY - User submits a query about an order
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { orderId, name, email, phone, query } = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (!orderId || !name || !email || !phone || !query) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Verify order exists and belongs to user
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.user.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized access to this order" });
    }

    // Create new query
    const newQuery = new Query({
      order: orderId,
      user: userId,
      name,
      email,
      phone,
      query,
    });

    await newQuery.save();

    // Push notification to admins (non-blocking)
    sendToAdmins({
      title: "❓ New Query",
      body: `Order #${orderId} - ${name}`,
      icon: "/logo.png",
      url: "/admin",
    }).catch((err) => console.error("Push notification failed (query)", err?.message || err));

    res.status(201).json({
      message: "Query submitted successfully",
      query: newQuery,
    });
  } catch (error) {
    console.error("Error creating query:", error);
    res.status(500).json({ message: "Failed to submit query", error: error.message });
  }
});

// ✅ GET ALL QUERIES FOR AN ORDER (Admin)
router.get("/order/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;

    const queries = await Query.find({ order: orderId })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(queries);
  } catch (error) {
    console.error("Error fetching queries:", error);
    res.status(500).json({ message: "Failed to fetch queries", error: error.message });
  }
});

// ✅ GET ALL QUERIES (Admin Dashboard)
router.get("/admin/all", async (req, res) => {
  try {
    const queries = await Query.find()
      .populate("order", "total status _id")
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(queries);
  } catch (error) {
    console.error("Error fetching all queries:", error);
    res.status(500).json({ message: "Failed to fetch queries", error: error.message });
  }
});

// ✅ UPDATE QUERY STATUS & ADD ADMIN REPLY
router.put("/:queryId", async (req, res) => {
  try {
    const { queryId } = req.params;
    const { status, adminReply } = req.body;

    const query = await Query.findByIdAndUpdate(
      queryId,
      {
        status: status || "Open",
        adminReply: adminReply || null,
      },
      { new: true }
    ).populate("user", "name email phone");

    if (!query) {
      return res.status(404).json({ message: "Query not found" });
    }

    res.status(200).json({
      message: "Query updated successfully",
      query,
    });
  } catch (error) {
    console.error("Error updating query:", error);
    res.status(500).json({ message: "Failed to update query", error: error.message });
  }
});

// ✅ GET USER QUERIES
router.get("/user/my-queries", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const queries = await Query.find({ user: userId })
      .populate("order", "total status _id items")
      .sort({ createdAt: -1 });

    res.status(200).json(queries);
  } catch (error) {
    console.error("Error fetching user queries:", error);
    res.status(500).json({ message: "Failed to fetch queries", error: error.message });
  }
});

export default router;
