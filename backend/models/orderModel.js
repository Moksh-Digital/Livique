// backend/models/orderModel.js

import mongoose from 'mongoose';

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // Link order to a user
    },
    items: [
      {
        id: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, default: 1 },
        image: { type: String },
        delivery: { type: String },
        deliveryCharge: { type: Number, default: 0 },
      },
    ],
    address: { // Storing the shipping address details at the time of order
      fullName: { type: String, required: true },
      mobile: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      addressType: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    subtotal: {
      type: Number,
      required: true,
      default: 0.0,
    },
    deliveryCharges: {
      type: Number,
      required: true,
      default: 0.0,
    },
    total: {
      type: Number,
      required: true,
      default: 0.0,
    },
    status: {
      type: String,
      required: true,
      default: 'Confirmed',
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model('Order', orderSchema);

export default Order;