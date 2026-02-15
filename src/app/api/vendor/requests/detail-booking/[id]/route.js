import { NextResponse } from "next/server";
import connectToDatabase from "../../../../../../database/mongoose";
import DetailsBookingRequest from "../../../../../../database/models/DetailsBookingRequestModel";
import { auth } from "@clerk/nextjs/server";

export async function GET(request, { params }) {
  try {
    await connectToDatabase();

    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Booking request ID is required" },
        { status: 400 }
      );
    }

    const bookingRequest = await DetailsBookingRequest.findById(id)
      .populate("vendorId", "name category address phoneNo images defaultImage")
      .populate("userId", "name email")
      .lean();

    if (!bookingRequest) {
      return NextResponse.json(
        { success: false, message: "Booking request not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: bookingRequest,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get booking request error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch booking request",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// PATCH - Update booking request status
export async function PATCH(request, { params }) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized - Please sign in" },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const { id } = params;
    const body = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Booking request ID is required" },
        { status: 400 }
      );
    }

    const { status, vendorResponse } = body;

    const updateData = {};

    if (status) {
      if (!["pending", "confirmed", "rejected", "completed", "cancelled"].includes(status)) {
        return NextResponse.json(
          { success: false, message: "Invalid status value" },
          { status: 400 }
        );
      }
      updateData.status = status;
    }

    if (vendorResponse) {
      updateData.vendorResponse = vendorResponse;
      updateData.respondedAt = new Date();
    }

    const bookingRequest = await DetailsBookingRequest.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate("vendorId", "name category address phoneNo images defaultImage")
      .populate("userId", "name email");

    if (!bookingRequest) {
      return NextResponse.json(
        { success: false, message: "Booking request not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Booking request updated successfully",
        data: bookingRequest,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update booking request error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update booking request",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete booking request
export async function DELETE(request, { params }) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized - Please sign in" },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Booking request ID is required" },
        { status: 400 }
      );
    }

    const bookingRequest = await DetailsBookingRequest.findById(id);

    if (!bookingRequest) {
      return NextResponse.json(
        { success: false, message: "Booking request not found" },
        { status: 404 }
      );
    }

    // Check if user owns this booking request
    if (bookingRequest.userId?.toString() !== userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized to delete this booking request" },
        { status: 403 }
      );
    }

    await DetailsBookingRequest.findByIdAndDelete(id);

    return NextResponse.json(
      {
        success: true,
        message: "Booking request deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete booking request error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete booking request",
        error: error.message,
      },
      { status: 500 }
    );
  }
}