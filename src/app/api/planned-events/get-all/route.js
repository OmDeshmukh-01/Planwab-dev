import { NextResponse } from "next/server";
import connectToDatabase from "../../../../database/mongoose";
import PlannedToolEvent from "../../../../database/models/PlannedToolEvent";

// GET - Fetch all events for a user
export async function GET(request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);

    const category = searchParams.get("category");
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    // Build query (no userId)
    const query = {};
    if (category && category !== "all") query.category = category;
    if (status && status !== "all") query.status = status;

    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === "desc" ? -1 : 1 };

    const [events, total] = await Promise.all([
      PlannedToolEvent.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      PlannedToolEvent.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      data: events,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch events" },
      { status: 500 }
    );
  }
}
