// app/api/reels/vendor/[vendorId]/route.js

import ReelsModel from "../../../../../database/models/ReelsModel";
import connectToDatabase from "../../../../../database/mongoose";
import { ok, serverError, badRequest } from "../../../../../lib/apiResponse";

export async function GET(request, { params }) {
  try {
    await connectToDatabase();

    const { vendorId } = await params;
    if (!vendorId) return badRequest("vendorId is required");

    const { searchParams } = new URL(request.url);
    const page     = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit    = Math.min(50, parseInt(searchParams.get("limit") || "12"));
    const skip     = (page - 1) * limit;
    const activeOnly = searchParams.get("activeOnly") !== "false";

    const query = {
      vendorId,
      $or: [
        { expiresAt: { $exists: false } },
        { expiresAt: null },
        { expiresAt: { $gt: new Date() } },
      ],
    };
    if (activeOnly) query.isActive = true;

    const [reels, total] = await Promise.all([
      ReelsModel.find(query)
        .sort({ isPinned: -1, priority: -1, publishedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      ReelsModel.countDocuments(query),
    ]);

    // Aggregate stats for this vendor's reels
    const stats = await ReelsModel.aggregate([
      { $match: { vendorId } },
      {
        $group: {
          _id: null,
          totalViews:    { $sum: "$viewCount" },
          totalLikes:    { $sum: "$likeCount" },
          totalShares:   { $sum: "$shareCount" },
          totalComments: { $sum: "$commentCount" },
          totalSaves:    { $sum: "$saveCount" },
          reelCount:     { $sum: 1 },
        },
      },
    ]);

    return ok({
      reels,
      stats: stats[0] || {
        totalViews: 0, totalLikes: 0, totalShares: 0,
        totalComments: 0, totalSaves: 0, reelCount: 0,
      },
      pagination: {
        page, limit, total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    return serverError("Failed to fetch vendor reels", error);
  }
}