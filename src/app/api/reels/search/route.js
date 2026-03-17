// app/api/reels/search/route.js
import ReelsModel from "../../../../database/models/ReelsModel";
import connectToDatabase from "../../../../database/mongoose";
import { ok, badRequest, serverError } from "../../../../lib/apiResponse";

export async function GET(request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const q        = searchParams.get("q")?.trim();
    const page     = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit    = Math.min(50, parseInt(searchParams.get("limit") || "20"));
    const category = searchParams.get("category");
    const city     = searchParams.get("city");

    if (!q || q.length < 2)
      return badRequest("Search query must be at least 2 characters");

    const query = {
      isActive: true,
      $text: { $search: q },
      $or: [
        { expiresAt: { $exists: false } },
        { expiresAt: null },
        { expiresAt: { $gt: new Date() } },
      ],
    };

    if (category) query.category = category;
    if (city) query.city = new RegExp(city, "i");

    const skip = (page - 1) * limit;

    const [reels, total] = await Promise.all([
      ReelsModel.find(query, { score: { $meta: "textScore" } })
        .sort({ score: { $meta: "textScore" }, priority: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      ReelsModel.countDocuments(query),
    ]);

    return ok({
      reels,
      query: q,
      pagination: {
        page, limit, total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    return serverError("Search failed", error);
  }
}