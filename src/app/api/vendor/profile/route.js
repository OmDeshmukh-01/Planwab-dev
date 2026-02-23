import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectToDatabase from "../../../../database/mongoose";
import VendorProfile from "../../../../database/models/VendorProfileModel";
import Vendor from "../../../../database/models/VendorModel";

const verifyPassword = async (username, password) => {
  try {
    const profile = await VendorProfile.findOne({ username }).select("+password");
    if (!profile || !profile.password) return false;
    return await bcrypt.compare(password, profile.password);
  } catch (error) {
    return false;
  }
};

// Helper: Check vendor profile credibility
const checkCredibility = async (username) => {
  try {
    const profile = await VendorProfile.findOne({ username });
    if (!profile) return { valid: false, message: "Profile not found" };

    const hasMinimumPosts = profile.posts?.length >= 3;
    const hasValidTrust = profile.trust >= 50;
    const hasLocation = profile.location?.city && profile.location?.state;
    const hasCategory = !!profile.category;

    const credibilityScore = [hasMinimumPosts, hasValidTrust, hasLocation, hasCategory].filter(Boolean).length;

    return {
      valid: credibilityScore >= 3,
      score: credibilityScore,
      details: {
        hasMinimumPosts,
        hasValidTrust,
        hasLocation,
        hasCategory,
      },
    };
  } catch (error) {
    return { valid: false, message: "Error checking credibility" };
  }
};

// GET - Fetch vendor profile(s)
export async function GET(request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");

    // If username is provided, fetch a single profile natively 
    if (username) {
      const profile = await VendorProfile.findOne({ username }).select("-password");

      if (!profile) {
        return NextResponse.json({ success: false, message: "Vendor profile not found" }, { status: 404 });
      }

      const credibility = await checkCredibility(username);

      return NextResponse.json({
        success: true,
        data: profile,
        credibility,
      });
    }

    // Otherwise, fetch all vendor profiles for lists
    const profiles = await VendorProfile.find({}).sort({ createdAt: -1 }).select("-password");

    return NextResponse.json({
      success: true,
      data: profiles,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error", error: error.message }, { status: 500 });
  }
}

// POST - Create new vendor profile
export async function POST(request) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const {
      vendorBusinessName,
      username,
      vendorName,
      location,
      category,
      password,
      vendorAvatar,
      vendorCoverImage,
      bio,
    } = body;

    if (
      !vendorBusinessName ||
      !username ||
      !vendorName ||
      !category ||
      !password ||
      !vendorAvatar ||
      !bio
    ) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    // Check if username already exists
    const existingProfile = await VendorProfile.findOne({ username });
    if (existingProfile) {
      return NextResponse.json({ success: false, message: "Username already taken" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const profile = await VendorProfile.create({
      vendorBusinessName,
      vendorName,
      vendorAvatar,
      vendorCoverImage,
      bio,
      location,
      category,
      username,
      password: hashedPassword,
      trust: 0,
      highlights: [],
      posts: [],
      reels: [],
    });

    const profileData = profile.toObject();
    delete profileData.password;

    return NextResponse.json(
      {
        success: true,
        message: "Vendor profile created successfully",
        data: profileData,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error", error: error.message }, { status: 500 });
  }
}

// PUT - Update vendor profile (excluding highlights, reels, posts)
export async function PUT(request, { params }) {
  try {
    await connectToDatabase();

    const { id } = await params; // id here represents username
    const body = await request.json();

    const {
      vendorBusinessName,
      username,
      vendorName,
      category,
      bio,
      vendorAvatar,
      vendorCoverImage,
      location,
      newPassword,
    } = body;

    // Find existing profile by username (id parameter)
    const existingProfile = await VendorProfile.findOne({ username: id });

    if (!existingProfile) {
      return NextResponse.json(
        { success: false, error: "Profile not found" },
        { status: 404 }
      );
    }

    // If username is being changed, check if new username is available
    if (username && username !== id) {
      const usernameExists = await VendorProfile.findOne({ username });
      if (usernameExists) {
        return NextResponse.json(
          { success: false, error: "Username already taken" },
          { status: 409 }
        );
      }
    }

    // Build update object
    const updateData = {
      vendorBusinessName: vendorBusinessName || existingProfile.vendorBusinessName,
      username: username || existingProfile.username,
      vendorName: vendorName || existingProfile.vendorName,
      category: category || existingProfile.category,
      bio: bio !== undefined ? bio : existingProfile.bio,
      vendorAvatar: vendorAvatar || existingProfile.vendorAvatar,
      vendorCoverImage: vendorCoverImage !== undefined ? vendorCoverImage : existingProfile.vendorCoverImage,
      location: location || existingProfile.location,
      updatedAt: new Date(),
    };

    // Handle password change if requested
    if (newPassword) {
      // Validate new password
      if (newPassword.length < 6) {
        return NextResponse.json(
          { success: false, error: "New password must be at least 6 characters" },
          { status: 400 }
        );
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      updateData.password = hashedPassword;
    }

    // Update profile
    const updatedProfile = await VendorProfile.findOneAndUpdate(
      { username: id },
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password");

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      data: updatedProfile,
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update profile" },
      { status: 500 }
    );
  }
}

// DELETE - Delete vendor profile
export async function DELETE(request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");
    const password = searchParams.get("password");

    if (!username || !password) {
      return NextResponse.json({ success: false, message: "Username and password are required" }, { status: 400 });
    }

    const isPasswordValid = await verifyPassword(username, password);
    if (!isPasswordValid) {
      return NextResponse.json({ success: false, message: "Invalid password" }, { status: 401 });
    }

    const profile = await VendorProfile.findOneAndDelete({ username });

    if (!profile) {
      return NextResponse.json({ success: false, message: "Vendor profile not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Vendor profile deleted successfully",
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error", error: error.message }, { status: 500 });
  }
}