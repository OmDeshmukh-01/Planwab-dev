// app/api/reels/related/[id]/route.js
import mongoose from "mongoose";
import { ok, badRequest, notFound, serverError } from "../../../../../lib/apiResponse";
import connectToDatabase from "../../../../../database/mongoose";
import ReelsModel from "../../../../../database/models/ReelsModel";

export async function GET(request, { params }) {
  try {
    await connectToDatabase();

    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return badRequest("Invalid reel ID");

    const { searchParams } = new URL(request.url);
    const limit = Math.min(20, parseInt(searchParams.get("limit") || "6"));

    // Find the source reel
    const source = await ReelsModel.findById(id)
      .select("category tags vendorId city")
      .lean();

    if (!source) return notFound("Source reel not found");

    const query = {
      _id: { $ne: new mongoose.Types.ObjectId(id) },
      isActive: true,
      $or: [
        { expiresAt: { $exists: false } },
        { expiresAt: null },
        { expiresAt: { $gt: new Date() } },
      ],
    };

    // Score related: same category preferred, same tags, same vendor, same city
    const reels = await ReelsModel.aggregate([
      { $match: query },
      {
        $addFields: {
          relevanceScore: {
            $add: [
              { $cond: [{ $eq: ["$category", source.category] }, 10, 0] },
              { $cond: [{ $eq: ["$vendorId",  source.vendorId]  }, 8,  0] },
              { $cond: [{ $eq: ["$city",      source.city]      }, 3,  0] },
              {
                $size: {
                  $ifNull: [
                    { $setIntersection: ["$tags", source.tags || []] },
                    [],
                  ],
                },
              },
              "$priority",
            ],
          },
        },
      },
      { $sort: { relevanceScore: -1, publishedAt: -1 } },
      { $limit: limit },
      {
        $project: {
          title: 1, vendorName: 1, category: 1, thumbnailUrl: 1,
          videoUrl: 1, viewCount: 1, likeCount: 1, isFeatured: 1, relevanceScore: 1,
        },
      },
    ]);

    return ok({ reels, count: reels.length });
  } catch (error) {
    return serverError("Failed to fetch related reels", error);
  }
}