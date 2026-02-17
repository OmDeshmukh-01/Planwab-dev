import mongoose from "mongoose";

const GuestSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: String, default: "" },
  email: { type: String, default: "" },
  status: { type: String, enum: ["pending", "confirmed", "declined"], default: "pending" },
  addedAt: { type: Date, default: Date.now },
});

const BudgetCategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  allocated: { type: Number, default: 0 },
  spent: { type: Number, default: 0 },
  color: { type: String, default: "#7c3aed" },
});

const ChecklistItemSchema = new mongoose.Schema({
  id: { type: String, required: true },
  text: { type: String, required: true },
  completed: { type: Boolean, default: false },
  priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
  dueIn: { type: String, default: "" },
  category: { type: String, default: "custom" },
  addedAt: { type: Date, default: Date.now },
});

const TimelineEventSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: "" },
  date: { type: String, required: true },
  time: { type: String, default: "" },
  completed: { type: Boolean, default: false },
  color: { type: String, default: "#7c3aed" },
});

const PlannedToolEventSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    category: {
      type: String,
      enum: ["wedding", "birthday", "conference", "corporate", "party", "anniversary", "other"],
      default: "other",
    },
    date: { type: String, required: true },
    time: { type: String, default: "" },
    venue: { type: String, default: "" },
    venueAddress: { type: String, default: "" },
    guestCount: { type: Number, default: 0 },
    budget: { type: Number, default: 0 },
    image: { type: String, default: "" },
    description: { type: String, default: "" },
    status: { type: String, enum: ["planning", "confirmed", "completed", "cancelled"], default: "planning" },
    guests: [GuestSchema],
    budgetCategories: [BudgetCategorySchema],
    checklist: [ChecklistItemSchema],
    timeline: [TimelineEventSchema],
    savedVendors: [{ type: String }],
    bookedVendors: [
      {
        vendorId: { type: String, required: true },
        vendorName: { type: String },
        category: { type: String },
        bookedDate: { type: Date, default: Date.now },
        price: { type: Number, default: 0 },
        status: { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending" },
        notes: { type: String, default: "" },
      },
    ],
    collaborators: [
      {
        odloid: { type: String },
        name: { type: String },
        email: { type: String },
        role: { type: String, enum: ["viewer", "editor", "admin"], default: "viewer" },
        addedAt: { type: Date, default: Date.now },
      },
    ],
    notes: { type: String, default: "" },
    tags: [{ type: String }],
    isPublic: { type: Boolean, default: false },
    shareCode: { type: String, unique: true, sparse: true },
  },
  {
    timestamps: true,
  }
);

PlannedToolEventSchema.index({ userId: 1, createdAt: -1 });
PlannedToolEventSchema.index({ category: 1 });
PlannedToolEventSchema.index({ date: 1 });
PlannedToolEventSchema.index({ shareCode: 1 });

PlannedToolEventSchema.virtual("tasksCompleted").get(function () {
  return this.checklist.filter((item) => item.completed).length;
});

PlannedToolEventSchema.virtual("totalTasks").get(function () {
  return this.checklist.length;
});

PlannedToolEventSchema.virtual("totalBudgetAllocated").get(function () {
  return this.budgetCategories.reduce((sum, cat) => sum + cat.allocated, 0);
});

PlannedToolEventSchema.virtual("totalBudgetSpent").get(function () {
  return this.budgetCategories.reduce((sum, cat) => sum + cat.spent, 0);
});

PlannedToolEventSchema.virtual("confirmedGuests").get(function () {
  return this.guests.filter((g) => g.status === "confirmed").length;
});

PlannedToolEventSchema.set("toJSON", { virtuals: true });
PlannedToolEventSchema.set("toObject", { virtuals: true });

const PlannedToolEvent = mongoose.models.PlannedToolEvent || mongoose.model("PlannedToolEvent", PlannedToolEventSchema);

export default PlannedToolEvent;