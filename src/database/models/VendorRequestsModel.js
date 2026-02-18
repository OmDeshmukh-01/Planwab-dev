import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: String,
    required: true,
    trim: true,
  },
  duration: {
    type: String,
    required: true,
    trim: true,
  },
});

const VendorRequestSchema = new mongoose.Schema(
  {
    // Basic Information (from both forms)
    businessName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    ownerName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email"],
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      match: [/^[+]?[0-9]{10,15}$/, "Please enter a valid phone number"],
    },
    password: {
      type: String,
      required: function () {
        return this.registrationType === "full";
      },
      minlength: 6,
    },

    // Business Details
    category: {
      type: String,
      required: true,
      enum: [
        "Event Planner",
        "Venue",
        "Photographer",
        "Decorator",
        "Caterer",
        "Makeup Artist",
        "DJ/Music",
        "Mehendi Artist",
        "Cake",
        "Pandit",
      ],
    },
    subcategory: {
      type: String,
      trim: true,
    },
    experience: {
      type: String,
      required: true,
      enum: ["0-1", "1-3", "3-5", "5-10", "10+"],
    },
    teamSize: {
      type: String,
      enum: ["1", "2-5", "6-10", "11-20", "20+"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000,
    },

    // Location Details
    address: {
      type: String,
      required: function () {
        return this.registrationType === "full";
      },
      trim: true,
      maxlength: 200,
    },
    city: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    state: {
      type: String,
      trim: true,
      maxlength: 50,
    },
    pincode: {
      type: String,
      required: function () {
        return this.registrationType === "full";
      },
      trim: true,
      match: [/^[0-9]{6}$/, "Please enter a valid pincode"],
    },
    serviceAreas: [
      {
        type: String,
        trim: true,
      },
    ],

    // Services & Portfolio
    services: [ServiceSchema],
    portfolioImages: [
      {
        type: String, // URLs to uploaded images
        trim: true,
      },
    ],

    // Social & Legal
    website: {
      type: String,
      trim: true,
      match: [/^https?:\/\/.+/, "Please enter a valid URL"],
    },
    instagram: {
      type: String,
      trim: true,
    },
    facebook: {
      type: String,
      trim: true,
    },
    linkedin: {
      type: String,
      trim: true,
    },
    gstNumber: {
      type: String,
      trim: true,
      match: [/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, "Please enter a valid GST number"],
    },
    panNumber: {
      type: String,
      trim: true,
      match: [/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Please enter a valid PAN number"],
    },

    // Terms & Status
    agreeToTerms: {
      type: Boolean,
      required: true,
      default: false,
    },

    // Registration Type (to differentiate between full form and quick drawer)
    registrationType: {
      type: String,
      enum: ["full", "quick"],
      default: "full",
      required: true,
    },

    // Status Management
    status: {
      type: String,
      enum: ["RECIVED", "PROCESSING", "PENDING", "COMPLETED", "FAILED"],
      default: "RECIVED",
      required: true,
    },

    // Admin Notes
    adminNotes: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    // Timestamps
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    reviewedAt: {
      type: Date,
    },
    reviewedBy: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for better query performance
VendorRequestSchema.index({ email: 1 });
VendorRequestSchema.index({ status: 1 });
VendorRequestSchema.index({ category: 1 });
VendorRequestSchema.index({ city: 1 });
VendorRequestSchema.index({ submittedAt: -1 });

// Virtual for full name
VendorRequestSchema.virtual("fullContactInfo").get(function () {
  return `${this.ownerName} (${this.businessName})`;
});

// Pre-save middleware to set reviewedAt when status changes
VendorRequestSchema.pre("save", function (next) {
  if (this.isModified("status") && this.status !== "RECIVED") {
    this.reviewedAt = new Date();
  }
  next();
});

export default mongoose.models.VendorRequest || mongoose.model("VendorRequest", VendorRequestSchema);
