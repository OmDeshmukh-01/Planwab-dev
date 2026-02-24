import { NextResponse } from "next/server";
import { connectToDatabase } from '../../../../../database/mongoose';
import VendorProfile from "../../../../../database/models/VendorProfileModel";

export async function PATCH(request) {
  try {
    const body = await request.json();
    const { profileId, content, postNumber, postId } = body;

    // Validation
    if (!profileId) {
      return NextResponse.json(
        { success: false, error: "Profile ID is required" },
        { status: 400 }
      );
    }

    if (!content || typeof content !== 'object') {
      return NextResponse.json(
        { success: false, error: "Content object is required" },
        { status: 400 }
      );
    }

    if (!postId && !postNumber) {
      return NextResponse.json(
        { success: false, error: "Either postId or postNumber is required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const profile = await VendorProfile.findById(profileId);
    if (!profile) {
      return NextResponse.json(
        { success: false, error: "Vendor profile not found" },
        { status: 404 }
      );
    }

    let postIndex = -1;

    // Find the post by postId or postNumber
    if (postId) {
      postIndex = profile.posts.findIndex(
        (post) => post._id.toString() === postId
      );
    } else if (postNumber) {
      // postNumber is 1-based (1, 2, 3, 4), convert to 0-based index
      postIndex = postNumber - 1;
    }

    // Validate post exists
    if (postIndex < 0 || postIndex >= profile.posts.length) {
      return NextResponse.json(
        { success: false, error: "Post not found" },
        { status: 404 }
      );
    }

    // Update only the content field of the specific post
    const updatePath = `posts.${postIndex}.content`;

    const updatedProfile = await VendorProfile.findByIdAndUpdate(
      profileId,
      { $set: { [updatePath]: content } },
      { new: true }
    );

    // Return the updated post
    const updatedPost = updatedProfile.posts[postIndex];

    return NextResponse.json({
      success: true,
      data: {
        post: updatedPost,
        content: updatedPost.content,
      },
    });

  } catch (error) {
    console.error("Error updating post content:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}