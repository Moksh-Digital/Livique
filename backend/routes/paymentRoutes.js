import express from "express";
import { createOrder, verifyPayment } from "../controllers/paymentController.js";

const router = express.Router();

router.post("/create-order", createOrder);
router.post("/verify", verifyPayment);


// backend/routes/paymentRoutes.js
router.post("/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  const secret = process.env.RAZORPAY_SECRET;
  const signature = req.headers["x-razorpay-signature"];

  const shasum = crypto.createHmac("sha256", secret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest("hex");

  if (digest === signature) {
    console.log("✅ Payment webhook verified:", req.body);
    // You can update paymentStatus = "Paid" here in the DB
  } else {
    console.log("❌ Invalid webhook signature");
  }

  res.json({ status: "ok" });
});


export default router;
