import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";
import Order from "../models/orderModel.js";
import sendEmail from "../utils/sendEmail.js";
import { generateOrderConfirmationEmail } from "../utils/orderEmailTemplate.js";

dotenv.config();

export const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });

    const options = {
      amount: amount * 100, // amount in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await instance.orders.create(options);
    res.status(200).json(order);
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      userId,
      items,
      address,
      subtotal,
      deliveryCharges,
      total,
      paymentMethod,
      userEmail,
      userName
    } = req.body;

    // Step 1: Verify signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(sign)
      .digest("hex");

    if (expectedSign !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }

    // Step 2: Payment is verified, now create order in database
    console.log("✅ Payment verified, creating order...");
    
    const newOrder = new Order({
      user: userId,
      items: items,
      address: address,
      paymentMethod: paymentMethod,
      paymentStatus: "Paid",
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      subtotal: subtotal,
      deliveryCharges: deliveryCharges,
      total: total,
      status: "Confirmed",
    });

    await newOrder.save();
    console.log("✅ Order created in database:", newOrder._id);

    // Step 3: Send order confirmation email
    const emailHtml = generateOrderConfirmationEmail(newOrder, { name: userName, email: userEmail }, items);

    await sendEmail({
      to: userEmail,
      subject: `Order Confirmed - Livique #${newOrder._id.toString().substring(0, 8).toUpperCase()}`,
      html: emailHtml,
    });

    console.log("✅ Order confirmation email sent to:", userEmail);

    res.status(200).json({ 
      success: true, 
      message: "Payment verified and order created successfully",
      orderId: newOrder._id
    });
  } catch (error) {
    console.error("❌ Payment verification error:", error);
    res.status(500).json({ 
      success: false,
      message: "Payment verified but order creation failed", 
      error: error.message 
    });
  }
};
