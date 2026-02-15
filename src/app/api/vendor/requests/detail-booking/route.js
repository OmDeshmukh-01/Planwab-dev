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

    // Create new booking request with Clerk userId
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
    console.error("Error creating booking request:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to create booking request",
      },
      { status: 500 }
    );
  }
}

// GET - Fetch booking requests (optionally filtered by user)
export async function GET(request) {
  try {
    const { userId } = await auth();

    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const fetchAll = searchParams.get("all") === "true";

    // Fetch all requests or only user's requests
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
    console.error("Error fetching booking requests:", error);
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

       if (!userId) {
          return NextResponse.json(
            { success: false, message: "Unauthorized - Please sign in" },
            { status: 401 }
          );
        }

    await connectToDatabase();

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Booking request ID is required" },
        { status: 400 }
      );
    }

    // Find and update (only if it belongs to the user)
    const updatedRequest = await DetailsBookingRequest.findOneAndUpdate(
      { _id: id, userId },
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
    console.error("Error updating booking request:", error);
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
 
       if (!userId) {
          return NextResponse.json(
            { success: false, message: "Unauthorized - Please sign in" },
            { status: 401 }
          );
        }

    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Booking request ID is required" },
        { status: 400 }
      );
    }

    // Delete only if it belongs to the user
    const deletedRequest = await DetailsBookingRequest.findOneAndDelete({
      _id: id,
      userId,
    });

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
    console.error("Error deleting booking request:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to delete booking request",
      },
      { status: 500 }
    );
  }
}