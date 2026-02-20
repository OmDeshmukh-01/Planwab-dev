import { NextResponse } from "next/server";
import connectToDatabase from "../../../../../database/mongoose";
import { auth } from "@clerk/nextjs/server";
import DetailsBookingRequest from "../../../../../database/models/DetailsBookingRequestModel";

// POST - Create a new booking request
export async function POST(request) {
  try {
    // Get authenticated user from Clerk
    const { userId } = await auth();

    await connectToDatabase();

    const body = await request.json();

    const newBookingRequest = await DetailsBookingRequest.create({
      ...body,
      userId, // Clerk user ID
      createdAt: new Date(),
    });

    return NextResponse.json(
      {
        success: true,
        data: newBookingRequest,
        message: "Booking request created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to create booking request",
      },
      { status: 500 }
    );
  }
}

// GET - Fetch booking requests
export async function GET(request) {
  try {
    const { userId } = await auth();

    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const fetchAll = searchParams.get("all") === "true";

    const query = fetchAll ? {} : { userId };
    const bookingRequests = await DetailsBookingRequest.find(query).sort({
      createdAt: -1,
    });

    return NextResponse.json(
      {
        success: true,
        data: bookingRequests,
        count: bookingRequests.length,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch booking requests",
      },
      { status: 500 }
    );
  }
}

// PUT - Update a booking request
export async function PUT(request) {
  try {
    const { userId } = await auth();
    const body = await request.json();
    const { searchParams } = new URL(request.url);
    const adminPassword = searchParams.get("adminPassword");

    const MAIN_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "PlanWAB@12345";
    const EDIT_ADMIN_PASSWORD = process.env.VENDOR_REQ_EDIT_ADMIN_PASSWORD || "EDit@PlanWAB@12345";

    const isAdmin = adminPassword === MAIN_ADMIN_PASSWORD || adminPassword === EDIT_ADMIN_PASSWORD;

    if (!userId && !isAdmin) {
      return NextResponse.json(
        { success: false, message: "Unauthorized - Please sign in" },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const { id, ...updateData } = body;
    // Support ID from query param
    const requestId = id || searchParams.get("id");

    if (!requestId) {
      return NextResponse.json(
        { error: "Booking request ID is required" },
        { status: 400 }
      );
    }

    // Build query
    const query = { _id: requestId };
    if (!isAdmin) {
      query.userId = userId;
    }

    // Find and update
    const updatedRequest = await DetailsBookingRequest.findOneAndUpdate(
      query,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!updatedRequest) {
      return NextResponse.json(
        { error: "Booking request not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: updatedRequest,
        message: "Booking request updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to update booking request",
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete a booking request
export async function DELETE(request) {
  try {
    const { userId } = await auth();
    const { searchParams } = new URL(request.url);
    const adminPassword = searchParams.get("adminPassword");

    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "PlanWAB@12345";
    const isAdmin = adminPassword === ADMIN_PASSWORD;

    if (!userId && !isAdmin) {
      return NextResponse.json(
        { success: false, message: "Unauthorized - Please sign in" },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Booking request ID is required" },
        { status: 400 }
      );
    }

    // Build query
    const query = { _id: id };
    if (!isAdmin) {
      query.userId = userId;
    }

    // Delete
    const deletedRequest = await DetailsBookingRequest.findOneAndDelete(query);

    if (!deletedRequest) {
      return NextResponse.json(
        { error: "Booking request not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Booking request deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to delete booking request",
      },
      { status: 500 }
    );
  }
}