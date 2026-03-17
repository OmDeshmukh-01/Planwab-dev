// app/api/reels/featured/route.js
import connectToDatabase from "../../../../database/mongoose";
import ReelsModel from "../../../../database/models/ReelsModel";
import { ok, serverError } from "../../../../lib/apiResponse";

export async function GET(request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const limit    = Math.min(50, parseInt(searchParams.get("limit") || "12"));
    const category = searchParams.get("category");

    const query = {
      isActive: true,
      isFeatured: true,
      $or: [
        { expiresAt: { $exists: false } },
        { expiresAt: null },
        { expiresAt: { $gt: new Date() } },
      ],
    };

    if (category) query.category = category;

    const reels = await ReelsModel.find(query)
      .sort({ priority: -1, publishedAt: -1 })
      .limit(limit)
      .lean();

    return ok({ reels, count: reels.length });
  } catch (error) {
    return serverError("Failed to fetch featured reels", error);
  }
}