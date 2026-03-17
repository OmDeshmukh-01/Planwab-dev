// app/api/reels/trending/route.js

import ReelsModel from "../../../../database/models/ReelsModel";
import connectToDatabase from "../../../../database/mongoose";
import { ok, serverError } from "../../../../lib/apiResponse";

export async function GET(request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const limit    = Math.min(50, parseInt(searchParams.get("limit") || "12"));
    const category = searchParams.get("category");
    const days     = parseInt(searchParams.get("days") || "30");

    const since = new Date();
    since.setDate(since.getDate() - days);

    const query = {
      isActive: true,
      publishedAt: { $gte: since },
      $or: [
        { expiresAt: { $exists: false } },
        { expiresAt: null },
        { expiresAt: { $gt: new Date() } },
      ],
    };

    if (category) query.category = category;

    // Score = viewCount * 1 + likeCount * 3 + shareCount * 5 + commentCount * 2
    const reels = await ReelsModel.aggregate([
      { $match: query },
      {
        $addFields: {
          trendScore: {
            $add: [
              "$viewCount",
              { $multiply: ["$likeCount",    3] },
              { $multiply: ["$shareCount",   5] },
              { $multiply: ["$commentCount", 2] },
              { $multiply: ["$priority",     10] },
            ],
          },
        },
      },
      { $sort: { trendScore: -1 } },
      { $limit: limit },
      {
        $project: {
          title: 1, vendorName: 1, vendorUsername: 1, category: 1,
          thumbnailUrl: 1, videoUrl: 1, viewCount: 1, likeCount: 1,
          shareCount: 1, commentCount: 1, saveCount: 1, publishedAt: 1,
          priority: 1, isFeatured: 1, trendScore: 1,
        },
      },
    ]);

    return ok({ reels, count: reels.length, period: `${days} days` });
  } catch (error) {
    return serverError("Failed to fetch trending reels", error);
  }
}