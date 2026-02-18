// database/models/LeadsModel.js
import mongoose from "mongoose";

const LeadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      validate: {
        validator: function (v) {
          return /^[6-9]\d{9}$/.test(v);
        },
        message: "Please enter a valid Indian mobile number",
      },
      index: true,
    },
    actionType: {
      type: String,
      required: true,
      // ✅ CHANGED: Added "auto-popup" to enum
      enum: [
        "revealWhatsapp",
        "revealEmail",
        "revealPhone",
        "downloadBrochure",
        "bookDemo",
        "auto-popup", // ✅ NEW
        "general",
      ],
      default: "general",
      index: true, // ✅ NEW: Added index for faster queries
    },
    // ✅ NEW FIELD: currentUrl
    currentUrl: {
      type: String,
      trim: true,
      maxlength: [500, "URL cannot exceed 500 characters"],
      validate: {
        validator: function (v) {
          if (!v) return true; // Optional field
          try {
            new URL(v);
            return true;
          } catch {
            return false;
          }
        },
        message: "Please provide a valid URL",
      },
    },
    source: {
      type: String,
      default: "website",
      index: true, // ✅ NEW: Added index
    },
    status: {
      type: String,
      enum: ["RECIVED", "PROCESSING", "PENDING", "COMPLETED", "FAILED"],
      default: "RECIVED",
      index: true, // ✅ NEW: Added index
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
    metadata: {
      type: Map,
      of: String,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// ✅ NEW: Compound index for ultra-fast duplicate checking
LeadSchema.index(
  { phone: 1, actionType: 1, createdAt: -1 },
  { name: "duplicate_check_index" }
);

// ✅ NEW: Index for GET queries with status filter
LeadSchema.index(
  { status: 1, createdAt: -1 },
  { name: "status_date_index" }
);

// ✅ NEW: Index for currentUrl queries
LeadSchema.index(
  { currentUrl: 1, createdAt: -1 },
  { name: "url_date_index" }
);

const LeadsModel = mongoose.models.Lead || mongoose.model("Lead", LeadSchema);

export default LeadsModel;