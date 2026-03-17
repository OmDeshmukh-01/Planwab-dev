// app/api/reels/[id]/route.js
import mongoose from "mongoose";
import { ok, notFound, badRequest, serverError } from "../../../../lib/apiResponse";
import ReelsModel from "../../../../database/models/ReelsModel";
import connectToDatabase from "../../../../database/mongoose";

// ── Validate ObjectId ──────────────────────────────────────────────────────
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// ── GET /api/reels/:id ─────────────────────────────────────────────────────
export async function GET(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;

    if (!isValidId(id)) return badRequest("Invalid reel ID format");

    const reel = await ReelsModel.findById(id).lean();
    if (!reel) return notFound("Reel not found");

    // Increment view count (fire-and-forget)
    ReelsModel.findByIdAndUpdate(id, { $inc: { viewCount: 1 } }).exec();

    return ok({ data: reel });
  } catch (error) {
    return serverError("Failed to fetch reel", error);
  }
}

// ── PUT /api/reels/:id ─────────────────────────────────────────────────────
export async function PUT(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;

    if (!isValidId(id)) return badRequest("Invalid reel ID format");

    const body = await request.json();

    // Prevent overwriting immutable fields
    delete body._id;
    delete body.createdAt;
    delete body.addedBy;

    // Sanitize
    if (body.title) body.title = body.title.trim();
    if (!body.title) return badRequest("Reel title is required");
    if (!body.category) return badRequest("Category is required");

    if (body.hashtags) {
      body.hashtags = body.hashtags.map((h) =>
        h.startsWith("#") ? h : `#${h}`
      );
    }
    if (body.tags) {
      body.tags = body.tags.map((t) => t.trim().toLowerCase());
    }
    if (body.vendorUsername) {
      body.vendorUsername = body.vendorUsername.trim().toLowerCase();
    }
    if (body.priority !== undefined) {
      body.priority = Math.min(100, Math.max(0, parseInt(body.priority) || 0));
    }
    if (body.publishedAt) body.publishedAt = new Date(body.publishedAt);
    if (body.expiresAt)   body.expiresAt   = new Date(body.expiresAt);

    body.updatedAt = new Date();

    const updated = await ReelsModel.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    ).lean();

    if (!updated) return notFound("Reel not found");

    return ok({ message: "Reel updated successfully", data: updated });
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((e) => e.message);
      return badRequest("Validation failed", { errors });
    }
    return serverError("Failed to update reel", error);
  }
}

// ── DELETE /api/reels/:id ──────────────────────────────────────────────────
export async function DELETE(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;

    if (!isValidId(id)) return badRequest("Invalid reel ID format");

    const deleted = await ReelsModel.findByIdAndDelete(id).lean();
    if (!deleted) return notFound("Reel not found");

    return ok({ message: "Reel deleted successfully", data: deleted });
  } catch (error) {
    return serverError("Failed to delete reel", error);
  }
}