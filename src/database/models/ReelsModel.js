// models/Reel.js
import mongoose from "mongoose";

const reelSchema = new mongoose.Schema(
  {
    // ── Core Identity ────────────────────────────────────────────────────
    title: {
      type: String,
      required: [true, "Reel title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    caption: {
      type: String,
      trim: true,
      maxlength: [300, "Caption cannot exceed 300 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },

    // ── Vendor ───────────────────────────────────────────────────────────
    vendorId: {
      type: String,
      trim: true,
      index: true,
    },
    vendorName: { type: String, trim: true },
    vendorUsername: {
      type: String,
      trim: true,
      lowercase: true,
      index: true,
    },

    // ── Category ─────────────────────────────────────────────────────────
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "venues", "photographers", "makeup", "planners", "catering",
        "clothes", "mehendi", "cakes", "jewellery", "invitations",
        "djs", "hairstyling", "decor", "dhol", "anchor", "stageEntry",
        "fireworks", "other",
      ],
      index: true,
    },
    subcategory: { type: String, trim: true },

    type: {
  type: String,
  trim: true,
  required: [true, "Type is required"],
},
subtype: {
  type: String,
  trim: true,
  required: [true, "Subtype is required"],
},
nestedType: {
  type: String,
  trim: true,
  required: [true, "Nested type is required"],
},
nestedValues: [{ type: String, trim: true }],

    // ── Discovery ────────────────────────────────────────────────────────
    tags: [{ type: String, trim: true, lowercase: true }],
    hashtags: [{ type: String, trim: true }],

    // ── Media ────────────────────────────────────────────────────────────
    videoUrl: {
      type: String,
      required: [true, "Video URL is required"],
      trim: true,
    },
    thumbnailUrl: { type: String, trim: true },
    duration: { type: String, trim: true },
    aspectRatio: {
      type: String,
      enum: ["9:16", "16:9", "1:1", "4:5", "4:3"],
      default: "9:16",
    },
    resolution: { type: String, trim: true },

    // ── Flags ────────────────────────────────────────────────────────────
    isActive: { type: Boolean, default: true, index: true },
    isFeatured: { type: Boolean, default: false, index: true },
    isSponsored: { type: Boolean, default: false },
    isPinned: { type: Boolean, default: false },

    // ── Permissions ──────────────────────────────────────────────────────
    allowComments: { type: Boolean, default: true },
    allowSharing: { type: Boolean, default: true },
    allowDownload: { type: Boolean, default: false },
    ageRestriction: { type: Boolean, default: false },

    // ── Engagement ───────────────────────────────────────────────────────
    viewCount: { type: Number, default: 0, min: 0 },
    likeCount: { type: Number, default: 0, min: 0 },
    shareCount: { type: Number, default: 0, min: 0 },
    commentCount: { type: Number, default: 0, min: 0 },
    saveCount: { type: Number, default: 0, min: 0 },

    // ── Priority ─────────────────────────────────────────────────────────
    priority: { type: Number, default: 0, min: 0, max: 100, index: true },

    // ── Location ─────────────────────────────────────────────────────────
    location: { type: String, trim: true },
    city: { type: String, trim: true, index: true },

    // ── Music ────────────────────────────────────────────────────────────
    musicTitle: { type: String, trim: true },
    musicArtist: { type: String, trim: true },

    // ── CTA ──────────────────────────────────────────────────────────────
    ctaText: { type: String, trim: true },
    ctaLink: { type: String, trim: true },

    // ── Language ─────────────────────────────────────────────────────────
    language: { type: String, default: "Hindi" },

    // ── Scheduling ───────────────────────────────────────────────────────
    publishedAt: { type: Date, index: true },
    expiresAt: { type: Date },

    // ── Social Links ─────────────────────────────────────────────────────
    socialLinks: {
      instagram: { type: String, trim: true },
      youtube: { type: String, trim: true },
    },

    // ── Audit ────────────────────────────────────────────────────────────
    addedBy: { type: String, trim: true },
    updatedBy: { type: String, trim: true },
  },
  {
    timestamps: true, // adds createdAt, updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ── Indexes ──────────────────────────────────────────────────────────────
reelSchema.index({ isActive: 1, category: 1, priority: -1 });
reelSchema.index({ isActive: 1, isFeatured: 1, priority: -1 });
reelSchema.index({ vendorId: 1, isActive: 1 });
reelSchema.index({ tags: 1 });
reelSchema.index({ hashtags: 1 });
reelSchema.index({ createdAt: -1 });
reelSchema.index(
  {
    title: "text",
    caption: "text",
    description: "text",
    tags: "text",
    hashtags: "text",
  },
  {
    name: "reel_text_search",
    default_language: "english",
    language_override: "none", // 🔥 IMPORTANT FIX
  }
);


// ── Virtual: engagement rate ──────────────────────────────────────────────
reelSchema.virtual("engagementRate").get(function () {
  if (!this.viewCount || this.viewCount === 0) return 0;
  return (
    ((this.likeCount + this.shareCount + this.commentCount) / this.viewCount) *
    100
  ).toFixed(2);
});

// ── Pre-save: set publishedAt ─────────────────────────────────────────────
reelSchema.pre("save", function (next) {
  if (this.isNew && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

const Reel = mongoose.models.Reel || mongoose.model("Reel", reelSchema);
export default Reel;