import mongoose from "mongoose";

const querySchema = mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Order",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    query: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Open", "Resolved", "Closed"],
      default: "Open",
    },
    adminReply: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Query = mongoose.model("Query", querySchema);

export default Query;
