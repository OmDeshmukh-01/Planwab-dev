// app/api/reels/[id]/like/route.js
import mongoose from "mongoose";
import ReelsModel from "../../../../../database/models/ReelsModel";
import { ok, notFound, badRequest, serverError } from "./../../../../../lib/apiResponse";
import connectToDatabase from "../../../../../database/mongoose";

// Body: { action: "like" | "unlike" }
export async function POST(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id))
      return badRequest("Invalid reel ID");

    const body = await request.json().catch(() => ({}));
    const action = body.action === "unlike" ? -1 : 1;

    const reel = await ReelsModel.findByIdAndUpdate(
      id,
      { $inc: { likeCount: action } },
      { new: true, select: "likeCount" }
    ).lean();

    if (!reel) return notFound("Reel not found");

    return ok({
      liked: action === 1,
      likeCount: Math.max(0, reel.likeCount),
    });
  } catch (error) {
    return serverError("Failed to update like", error);
  }
}