// app/api/reels/add/route.js
import { NextResponse } from "next/server";
import { created, badRequest, serverError } from "../../../../lib/apiResponse";
import ReelsModel from "../../../../database/models/ReelsModel";
import connectToDatabase from "../../../../database/mongoose";
import { type } from "os";

export async function POST(request) {
  try {
    await connectToDatabase();

    const body = await request.json();

    // ── Required field validation ──────────────────────────────────────
    const missing = [];
    if (!body.title?.trim()) missing.push("title");
    if (!body.category) missing.push("category");
    if (!body.videoUrl?.trim()) missing.push("videoUrl");

    if (missing.length > 0) {
      return badRequest(`Missing required fields: ${missing.join(", ")}`, {
        fields: missing,
      });
    }

    // ── Sanitize hashtags ──────────────────────────────────────────────
    const hashtags = (body.hashtags || []).map((h) =>
      h.startsWith("#") ? h : `#${h}`
    );

    // ── Build reel document ────────────────────────────────────────────
    const reelData = {
      title: body.title.trim(),
      caption: body.caption?.trim(),
      description: body.description?.trim(),
      vendorId: body.vendorId?.trim(),
      vendorName: body.vendorName?.trim(),
      vendorUsername: body.vendorUsername?.trim()?.toLowerCase(),
      category: body.category,
      subcategory: body.subcategory?.trim(),
      tags: (body.tags || []).map((t) => t.trim().toLowerCase()),
      hashtags,
      videoUrl: body.videoUrl.trim(),
      thumbnailUrl: body.thumbnailUrl?.trim(),
      duration: body.duration?.trim(),
      aspectRatio: body.aspectRatio || "9:16",
      resolution: body.resolution?.trim(),
      isActive: body.isActive !== false,
      isFeatured: body.isFeatured || false,
      isSponsored: body.isSponsored || false,
      isPinned: body.isPinned || false,
      allowComments: body.allowComments !== false,
      allowSharing: body.allowSharing !== false,
      allowDownload: body.allowDownload || false,
      ageRestriction: body.ageRestriction || false,
      viewCount: parseInt(body.viewCount) || 0,
      likeCount: parseInt(body.likeCount) || 0,
      shareCount: parseInt(body.shareCount) || 0,
      commentCount: parseInt(body.commentCount) || 0,
      saveCount: parseInt(body.saveCount) || 0,
      priority: Math.min(100, Math.max(0, parseInt(body.priority) || 0)),
      location: body.location?.trim(),
      city: body.city?.trim(),
      musicTitle: body.musicTitle?.trim(),
      musicArtist: body.musicArtist?.trim(),
      ctaText: body.ctaText?.trim(),
      ctaLink: body.ctaLink?.trim(),
      language: body.language || "Hindi",
      publishedAt: body.publishedAt ? new Date(body.publishedAt) : new Date(),
      expiresAt: body.expiresAt ? new Date(body.expiresAt) : undefined,
      socialLinks: {
        instagram: body.socialLinks?.instagram?.trim(),
        youtube: body.socialLinks?.youtube?.trim(),
      },
      addedBy: body.addedBy?.trim(),
      type: body.type,
      subtype: body.subtype,
      nestedType: body.nestedType,
    };

    const reel = await ReelsModel.create(reelData);

    return created({
      message: "Reel created successfully",
      reel,
    });
  } catch (error) {
    // Mongoose validation errors
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((e) => e.message);
      return badRequest("Validation failed", { errors });
    }
    return serverError("Failed to create reel", error);
  }
}