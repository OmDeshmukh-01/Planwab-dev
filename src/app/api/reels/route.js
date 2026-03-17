// app/api/reels/route.js

import ReelsModel from "../../../database/models/ReelsModel";
import connectToDatabase from "../../../database/mongoose";
import { ok, serverError, badRequest } from "../../../lib/apiResponse";

export async function GET(request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);

    // ── Pagination ─────────────────────────────────────────────────────
    const page  = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20")));
    const skip  = (page - 1) * limit;

    // ── Filters ────────────────────────────────────────────────────────
    const query = {};

    const category   = searchParams.get("category");
    const vendorId   = searchParams.get("vendorId");
    const city       = searchParams.get("city");
    const language   = searchParams.get("language");
    const isFeatured = searchParams.get("isFeatured");
    const isActive   = searchParams.get("isActive");
    const isSponsored = searchParams.get("isSponsored");
    const isPinned   = searchParams.get("isPinned");
    const tag        = searchParams.get("tag");
    const hashtag    = searchParams.get("hashtag");
    const search     = searchParams.get("search");
    const minPriority = searchParams.get("minPriority");

    if (category)  query.category   = category;
    if (vendorId)  query.vendorId   = vendorId;
    if (city)      query.city       = new RegExp(city, "i");
    if (language)  query.language   = language;
    if (isFeatured !== null && isFeatured !== undefined)
      query.isFeatured = isFeatured === "true";
    if (isActive !== null && isActive !== undefined)
      query.isActive = isActive === "true";
    else
      query.isActive = true; // default: only active reels
    if (isSponsored !== null && isSponsored !== undefined)
      query.isSponsored = isSponsored === "true";
    if (isPinned !== null && isPinned !== undefined)
      query.isPinned = isPinned === "true";
    if (tag)     query.tags     = { $in: [tag.toLowerCase()] };
    if (hashtag) query.hashtags = { $in: [hashtag] };
    if (minPriority) query.priority = { $gte: parseInt(minPriority) };

    // Text search
    if (search?.trim()) {
      query.$text = { $search: search.trim() };
    }

    // Expiry filter
    query.$or = [
      { expiresAt: { $exists: false } },
      { expiresAt: null },
      { expiresAt: { $gt: new Date() } },
    ];

    // ── Sort ───────────────────────────────────────────────────────────
    const sortField = searchParams.get("sortBy") || "priority";
    const sortOrder = searchParams.get("sortOrder") === "asc" ? 1 : -1;

    const allowedSortFields = [
      "priority", "createdAt", "updatedAt", "publishedAt",
      "viewCount", "likeCount", "shareCount", "title",
    ];
    const sort = {
      [allowedSortFields.includes(sortField) ? sortField : "priority"]: sortOrder,
      createdAt: -1,
    };

    // ── Execute ────────────────────────────────────────────────────────
    const [reels, total] = await Promise.all([
      ReelsModel.find(query).sort(sort).skip(skip).limit(limit).lean(),
      ReelsModel.countDocuments(query),
    ]);

    return ok({
      data: reels,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    return serverError("Failed to fetch reels", error);
  }
}