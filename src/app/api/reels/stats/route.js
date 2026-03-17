// app/api/reels/stats/route.js

import ReelsModel from "../../../../database/models/ReelsModel";
import connectToDatabase from "../../../../database/mongoose";
import { ok, serverError } from "../../../../lib/apiResponse";

export async function GET() {
  try {
    await connectToDatabase();

    const [overall, byCategory, topReels, recentReels] = await Promise.all([
      // Overall platform stats
      ReelsModel.aggregate([
        {
          $group: {
            _id: null,
            totalReels:    { $sum: 1 },
            activeReels:   { $sum: { $cond: ["$isActive", 1, 0] } },
            featuredReels: { $sum: { $cond: ["$isFeatured", 1, 0] } },
            sponsoredReels:{ $sum: { $cond: ["$isSponsored", 1, 0] } },
            totalViews:    { $sum: "$viewCount" },
            totalLikes:    { $sum: "$likeCount" },
            totalShares:   { $sum: "$shareCount" },
            totalComments: { $sum: "$commentCount" },
            totalSaves:    { $sum: "$saveCount" },
            avgPriority:   { $avg: "$priority" },
          },
        },
      ]),

      // By category
      ReelsModel.aggregate([
        { $match: { isActive: true } },
        {
          $group: {
            _id: "$category",
            count:      { $sum: 1 },
            totalViews: { $sum: "$viewCount" },
            totalLikes: { $sum: "$likeCount" },
          },
        },
        { $sort: { count: -1 } },
      ]),

      // Top 5 reels by engagement
      ReelsModel.find({ isActive: true })
        .sort({ viewCount: -1 })
        .limit(5)
        .select("title vendorName category viewCount likeCount shareCount thumbnailUrl")
        .lean(),

      // 5 most recent
      ReelsModel.find({})
        .sort({ createdAt: -1 })
        .limit(5)
        .select("title vendorName category isActive createdAt thumbnailUrl")
        .lean(),
    ]);

    return ok({
      overall: overall[0] || {},
      byCategory,
      topReels,
      recentReels,
    });
  } catch (error) {
    return serverError("Failed to fetch stats", error);
  }
}