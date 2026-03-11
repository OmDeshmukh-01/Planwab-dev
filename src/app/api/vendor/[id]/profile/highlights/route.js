import { NextResponse } from "next/server";
import { connectToDatabase } from '../../../../../../database/mongoose';
import VendorProfile from "../../../../../../database/models/VendorProfileModel";

export async function GET(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = params;
    const profile = await VendorProfile.findOne({ vendorId: id }).select("highlights").lean();
    if (!profile) {
      return NextResponse.json({ success: false, error: "Profile not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: profile.highlights || [] });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = params;
    const body = await request.json();
    const { title, description, eventDate, category, subcategory, coverImage, images, videos, testimonials, content } = body;

    if (!title) {
      return NextResponse.json({ success: false, error: "Title is required" }, { status: 400 });
    }

    const highlight = {
      title,
      description: description || "",
      eventDate: eventDate ? new Date(eventDate) : undefined,
      category: category || "",
      subcategory: subcategory || "",
      coverImage: coverImage || "",
      images: images || [],
      videos: videos || [],
      testimonials: testimonials || [],
      content: content || {},
      createdAt: new Date(),
    };

    const profile = await VendorProfile.findOneAndUpdate(
      { vendorId: id },
      { $push: { highlights: highlight } },
      { new: true, runValidators: true }
    ).select("highlights");

    if (!profile) {
      return NextResponse.json({ success: false, error: "Profile not found" }, { status: 404 });
    }

    const newHighlight = profile.highlights[profile.highlights.length - 1];
    return NextResponse.json({ success: true, data: newHighlight });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const highlightId = searchParams.get("highlightId");

    if (!highlightId) {
      return NextResponse.json({ success: false, error: "highlightId is required" }, { status: 400 });
    }

    const body = await request.json();
    const updateFields = {};
    const allowedFields = ["title", "description", "eventDate", "category", "subcategory", "coverImage", "images", "videos", "testimonials", "content"];

    allowedFields.forEach((field) => {
      if (body[field] !== undefined) {
        if (field === "eventDate") {
          updateFields[`highlights.$.${field}`] = body[field] ? new Date(body[field]) : null;
        } else {
          updateFields[`highlights.$.${field}`] = body[field];
        }
      }
    });

    const profile = await VendorProfile.findOneAndUpdate(
      { vendorId: id, "highlights._id": highlightId },
      { $set: updateFields },
      { new: true, runValidators: true }
    ).select("highlights");

    if (!profile) {
      return NextResponse.json({ success: false, error: "Profile or highlight not found" }, { status: 404 });
    }

    const updated = profile.highlights.find((h) => h._id.toString() === highlightId);
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const highlightId = searchParams.get("highlightId");

    if (!highlightId) {
      return NextResponse.json({ success: false, error: "highlightId is required" }, { status: 400 });
    }

    const profile = await VendorProfile.findOneAndUpdate(
      { vendorId: id },
      { $pull: { highlights: { _id: highlightId } } },
      { new: true }
    ).select("highlights");

    if (!profile) {
      return NextResponse.json({ success: false, error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: { deleted: highlightId } });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}