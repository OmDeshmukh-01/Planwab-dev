// app/api/vendor/[id]/profile/interactions/route.js

import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../../../../database/mongoose";
import VendorProfile from "../../../../../../database/models/VendorProfileModel";

// POST - Handle trust and like interactions
export async function POST(request, context) {
  try {
    await connectToDatabase();

    const params = await context.params;
    const vendorId = params.id;

    if (!vendorId) {
      return NextResponse.json(
        { success: false, error: "Vendor ID is required" },
        { status: 400 }
      );
    }

    let body;
    try {
      body = await request.json();
    } catch (e) {
      return NextResponse.json(
        { success: false, error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const { action, value, userId } = body;

    if (!action || value === undefined) {
      return NextResponse.json(
        { success: false, error: "Action and value are required" },
        { status: 400 }
      );
    }

    // Require userId (Clerk user ID) for all interactions
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const profile = await VendorProfile.findOne({ vendorId });

    if (!profile) {
      return NextResponse.json(
        { success: false, error: "Profile not found" },
        { status: 404 }
      );
    }

    // Initialize arrays if they don't exist
    if (!profile.likes) profile.likes = [];
    if (!profile.trustedBy) profile.trustedBy = [];

    switch (action) {
      case "trust": {
        const alreadyTrusted = profile.trustedBy.includes(userId);
        let newTrust = profile.trust || 0;

        if (value && !alreadyTrusted) {
          // Adding trust
          newTrust = Math.max(0, newTrust + 10);
          profile.trustedBy.push(userId);
        } else if (!value && alreadyTrusted) {
          // Removing trust
          newTrust = Math.max(0, newTrust - 10);
          const index = profile.trustedBy.indexOf(userId);
          if (index > -1) profile.trustedBy.splice(index, 1);
        } else if (value && alreadyTrusted) {
          // Already trusted, return current value
          return NextResponse.json({
            success: true,
            data: {
              trust: Math.max(0, profile.trust || 0),
              action: "trust",
              changed: "none",
              message: "Already trusted"
            },
          });
        } else if (!value && !alreadyTrusted) {
          // Not trusted, can't remove
          return NextResponse.json({
            success: true,
            data: {
              trust: Math.max(0, profile.trust || 0),
              action: "trust",
              changed: "none",
              message: "Not previously trusted"
            },
          });
        }

        profile.trust = newTrust;
        await profile.save();

        return NextResponse.json({
          success: true,
          data: {
            trust: Math.max(0, profile.trust),
            action: "trust",
            changed: value ? "added" : "removed",
          },
        });
      }

      case "like": {
        const alreadyLiked = profile.likes.includes(userId);

        if (value && !alreadyLiked) {
          // Adding like
          profile.likes.push(userId);
        } else if (!value && alreadyLiked) {
          // Removing like
          const index = profile.likes.indexOf(userId);
          if (index > -1) profile.likes.splice(index, 1);
        } else if (value && alreadyLiked) {
          // Already liked
          return NextResponse.json({
            success: true,
            data: {
              likesCount: Math.max(0, profile.likes.length),
              action: "like",
              changed: "none",
              message: "Already liked"
            },
          });
        } else if (!value && !alreadyLiked) {
          // Not liked, can't remove
          return NextResponse.json({
            success: true,
            data: {
              likesCount: Math.max(0, profile.likes.length),
              action: "like",
              changed: "none",
              message: "Not previously liked"
            },
          });
        }

        await profile.save();

        return NextResponse.json({
          success: true,
          data: {
            likesCount: Math.max(0, profile.likes.length),
            action: "like",
            changed: value ? "added" : "removed",
          },
        });
      }

      default:
        return NextResponse.json(
          { success: false, error: "Invalid action. Use 'trust' or 'like'" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Interactions API error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Server error" },
      { status: 500 }
    );
  }
}

// GET - Get current interaction stats
export async function GET(request, context) {
  try {
    await connectToDatabase();

    const params = await context.params;
    const vendorId = params.id;
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!vendorId) {
      return NextResponse.json(
        { success: false, error: "Vendor ID is required" },
        { status: 400 }
      );
    }

    const profile = await VendorProfile.findOne({ vendorId })
      .select("trust likes trustedBy")
      .lean();

    if (!profile) {
      return NextResponse.json(
        { success: false, error: "Profile not found" },
        { status: 404 }
      );
    }

    // Check if specific user has interacted
    let userHasLiked = false;
    let userHasTrusted = false;
    
    if (userId) {
      userHasLiked = profile.likes?.includes(userId) || false;
      userHasTrusted = profile.trustedBy?.includes(userId) || false;
    }

    return NextResponse.json({
      success: true,
      data: {
        trust: Math.max(0, profile.trust || 0),
        likesCount: Math.max(0, profile.likes?.length || 0),
        trustedByCount: profile.trustedBy?.length || 0,
        userHasLiked,
        userHasTrusted,
      },
    });
  } catch (error) {
    console.error("GET interactions error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}