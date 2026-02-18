import mongoose from "mongoose";

const DetailsBookingRequestSchema = new mongoose.Schema(
  {
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
      index: true,
    },
    userId: {
      type: String,
      required: false,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: false,
      trim: true,
      lowercase: true,
    },
    date: {
      type: Date,
      required: true,
    },
    guests: {
      type: Number,
      required: true,
      min: 1,
    },
    eventType: {
      type: String,
      required: false,
      trim: true,
    },
    budget: {
      type: String,
      required: false,
      trim: true,
    },
    timeSlot: {
      type: String,
      required: false,
      trim: true,
    },
    notes: {
      type: String,
      required: false,
      trim: true,
    },
    status: {
      type: String,
      enum: ["RECEIVED", "PROCESSING", "PENDING", "COMPLETED", "FAILED"],
      default: "PENDING",
    },
    vendorResponse: {
      type: String,
      required: false,
    },
    respondedAt: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

DetailsBookingRequestSchema.index({ vendorId: 1, createdAt: -1 });
DetailsBookingRequestSchema.index({ userId: 1, createdAt: -1 });
DetailsBookingRequestSchema.index({ status: 1 });

const DetailsBookingRequest =
  mongoose.models.DetailsBookingRequest ||
  mongoose.model("DetailsBookingRequest", DetailsBookingRequestSchema);

export default DetailsBookingRequest;