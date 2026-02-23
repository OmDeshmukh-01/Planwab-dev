import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  image: { type: String },
  date: { type: Date },
  vendorId: { type: String },
  addons: [
    {
      name: String,
      price: Number,
      id: String,
    },
  ],
});

const OrderSchema = new mongoose.Schema(
  {
    user: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      pincode: { type: String, required: true },
    },
    event: {
      name: { type: String, required: true },
      type: { type: String, required: true },
      date: { type: Date, required: true },
      guests: { type: Number, required: true },
      specialRequests: String,
    },
    items: [OrderItemSchema],
    pricing: {
      subtotal: { type: Number, required: true },
      tax: { type: Number, required: true },
      platformFee: { type: Number, default: 0 },
      discount: { type: Number, default: 0 },
      total: { type: Number, required: true },
    },
    paymentMethod: { type: String, required: true },
    razorpay: {
      orderId: { type: String, required: true },
      paymentId: { type: String },
      signature: { type: String },
    },
    orderStatus: {
      type: String,
      enum: ["PLACED", "CONFIRMED", "COMPLETED", "CANCELLED"],
      default: "CONFIRMED",
    },
    userId: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
