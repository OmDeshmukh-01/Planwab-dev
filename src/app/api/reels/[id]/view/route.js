// app/api/reels/[id]/view/route.js
import mongoose from "mongoose";
import ReelsModel from "../../../../../database/models/ReelsModel";
import connectToDatabase from "../../../../../database/mongoose";
import { ok, notFound, badRequest, serverError } from "../../../../../lib/apiResponse";

export async function POST(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id))
      return badRequest("Invalid reel ID");

    const reel = await ReelsModel.findByIdAndUpdate(
      id,
      { $inc: { viewCount: 1 } },
      { new: true, select: "viewCount" }
    ).lean();

    if (!reel) return notFound("Reel not found");

    return ok({ viewCount: reel.viewCount });
  } catch (error) {
    return serverError("Failed to record view", error);
  }
}