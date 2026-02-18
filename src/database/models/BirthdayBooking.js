import mongoose from "mongoose";

const BirthdayBookingSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    bookingId: {
      type: String,
      unique: true,
      sparse: true,
    },
    userDetails: {
      name: {
        type: String,
        trim: true,
      },
      phone: {
        type: String,
        trim: true,
      },
      birthdayDate: {
        type: Date,
      },
    },
    venueId: {
      type: String,
      trim: true,
    },
    venueName: {
      type: String,
      trim: true,
    },
    venueLocation: {
      type: String,
      trim: true,
    },
    venuePrice: {
      type: Number,
    },
    bookingDetails: {
      eventDate: {
        type: Date,
      },
      guestCount: {
        type: Number,
      },
      timeSlot: {
        type: String,
        trim: true,
      },
      specialRequests: {
        type: String,
        trim: true,
      },
    },
    status: {
      type: String,
      enum: ["RECIVED", "PROCESSING", "PENDING", "COMPLETED", "FAILED"],
      default: "RECIVED",
      required: true,
      index: true,
    },
    submittedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

BirthdayBookingSchema.index({ sessionId: 1, status: 1 });
BirthdayBookingSchema.index({ createdAt: -1 });

// Force recompilation in development to pick up schema changes
if (process.env.NODE_ENV === "development") {
  delete mongoose.models.BirthdayBooking;
}

export default mongoose.models.BirthdayBooking || mongoose.model("BirthdayBooking", BirthdayBookingSchema);
