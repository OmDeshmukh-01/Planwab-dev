// app/api/reels/[id]/status/route.js
import mongoose from "mongoose";
import connectToDatabase from "../../../../../database/mongoose";
import ReelsModel from "../../../../../database/models/ReelsModel";
import { ok, notFound, badRequest, serverError } from "../../../../../lib/apiResponse";

// Body: { field: "isActive" | "isFeatured" | "isSponsored" | "isPinned", value: boolean }
export async function PATCH(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id))
      return badRequest("Invalid reel ID");

    const body = await request.json();
    const allowedFields = ["isActive", "isFeatured", "isSponsored", "isPinned", "allowComments", "allowSharing", "allowDownload", "ageRestriction"];

    if (!allowedFields.includes(body.field))
      return badRequest(`field must be one of: ${allowedFields.join(", ")}`);

    if (typeof body.value !== "boolean")
      return badRequest("value must be a boolean");

    const reel = await ReelsModel.findByIdAndUpdate(
      id,
      { $set: { [body.field]: body.value, updatedAt: new Date() } },
      { new: true, select: allowedFields }
    ).lean();

    if (!reel) return notFound("Reel not found");

    return ok({
      message: `${body.field} updated to ${body.value}`,
      reel,
    });
  } catch (error) {
    return serverError("Failed to update status", error);
  }
}