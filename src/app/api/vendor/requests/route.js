import { NextResponse } from "next/server";
import connectToDatabase from "../../../../database/mongoose"; // Adjust path as needed
import VendorRequest from "../../../../database/models/VendorRequestsModel";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "PlanWAB@12345";
const VENDOR_REQ_EDIT_ADMIN_PASSWORD = process.env.VENDOR_REQ_EDIT_ADMIN_PASSWORD || "EDit@PlanWAB@12345";

const verifyAdminPassword = (password) => {
  return password === ADMIN_PASSWORD;
};

const verifyVendorReqEditPassword = (password) => {
  return password === VENDOR_REQ_EDIT_ADMIN_PASSWORD || password === ADMIN_PASSWORD;
};

// GET - Fetch single vendor request by ID OR list with filtering and pagination
export async function GET(request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);

    // Handle single request fetching by ID
    const requestId = searchParams.get("id");
    if (requestId) {
      try {
        const singleRequest = await VendorRequest.findById(requestId)
          .select("-password") // Exclude password from response
          .lean();

        if (!singleRequest) {
          return NextResponse.json(
            {
              success: false,
              error: "Vendor request not found",
            },
            { status: 404 }
          );
        }

        return NextResponse.json({
          success: true,
          data: singleRequest,
        });
      } catch (error) {
        // Handle invalid ObjectId format
        if (error.name === "CastError") {
          return NextResponse.json(
            {
              success: false,
              error: "Invalid request ID format",
            },
            { status: 400 }
          );
        }
        throw error; // Re-throw other errors to be handled below
      }
    }


    // Query parameters for listing
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const status = searchParams.get("status");
    const category = searchParams.get("category");
    const city = searchParams.get("city");
    const registrationType = searchParams.get("registrationType");
    const sortBy = searchParams.get("sortBy") || "submittedAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    // Build filter object
    const filter = {};

    if (status && status !== "all") {
      filter.status = status;
    }

    if (category && category !== "all") {
      filter.category = category;
    }

    if (city && city !== "all") {
      filter.city = new RegExp(city, "i"); // Case-insensitive search
    }

    if (registrationType && registrationType !== "all") {
      filter.registrationType = registrationType;
    }

    // Calculate skip for pagination
    const skip = (page - 1) * limit;

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === "asc" ? 1 : -1;

    // Execute queries
    const [requests, totalCount] = await Promise.all([
      VendorRequest.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .select("-password") // Exclude password from response
        .lean(),
      VendorRequest.countDocuments(filter),
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    // Get status counts for dashboard
    const statusCounts = await VendorRequest.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const statusStats = statusCounts.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});

    return NextResponse.json({
      success: true,
      data: {
        requests,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          hasNextPage,
          hasPrevPage,
          limit,
        },
        statusStats,
        filters: {
          status,
          category,
          city,
          registrationType,
        },
      },
    });
  } catch (error) {
    console.error("GET /api/vendor-requests error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch vendor requests",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// POST - Create new vendor request (from both forms)
export async function POST(request) {
  try {
    await connectToDatabase();

    const body = await request.json();

    // Check if email already exists
    const existingRequest = await VendorRequest.findOne({
      email: body.email,
    });

    if (existingRequest) {
      return NextResponse.json(
        {
          success: false,
          error: "A request with this email already exists",
          requestId: existingRequest._id,
        },
        { status: 409 }
      );
    }

    // Create new vendor request
    const vendorRequest = new VendorRequest({
      ...body,
      submittedAt: new Date(),
    });

    await vendorRequest.save();

    // Remove password from response
    const responseData = vendorRequest.toObject();
    delete responseData.password;

    return NextResponse.json(
      {
        success: true,
        data: responseData,
        message: "Vendor request submitted successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/vendor-requests error:", error);

    // Handle validation errors
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to submit vendor request",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// PUT - Update vendor request (for admin panel)
export async function PUT(request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    const password = searchParams.get("adminPassword");

    if (!verifyVendorReqEditPassword(password)) {
      return NextResponse.json({ success: false, error: "Unauthorized: Invalid admin password" }, { status: 401 });
    }

    if (!id) {
      return NextResponse.json({ success: false, error: "Request ID is required" }, { status: 400 });
    }

    const body = await request.json();

    // Remove fields that shouldn't be updated via this endpoint
    const updateData = { ...body };
    delete updateData._id;
    delete updateData.createdAt;
    delete updateData.submittedAt;

    // If status is being updated, set reviewedAt
    if (updateData.status) {
      updateData.reviewedAt = new Date();
    }

    const updatedRequest = await VendorRequest.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
      select: "-password", // Exclude password from response
    });

    if (!updatedRequest) {
      return NextResponse.json({ success: false, error: "Vendor request not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: updatedRequest,
      message: "Vendor request updated successfully",
    });
  } catch (error) {
    console.error("PUT /api/vendor-requests error:", error);

    // Handle validation errors
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: errors,
        },
        { status: 400 }
      );
    }

    if (error.name === "CastError") {
      return NextResponse.json({ success: false, error: "Invalid request ID format" }, { status: 400 });
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to update vendor request",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete vendor request
export async function DELETE(request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const password = searchParams.get("adminPassword");

    if (!verifyAdminPassword(password)) {
      return NextResponse.json({ success: false, error: "Unauthorized: Invalid admin password" }, { status: 401 });
    }

    if (!id) {
      return NextResponse.json({ success: false, error: "Request ID is required" }, { status: 400 });
    }

    const deletedRequest = await VendorRequest.findByIdAndDelete(id);

    if (!deletedRequest) {
      return NextResponse.json({ success: false, error: "Vendor request not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: { id: deletedRequest._id },
      message: "Vendor request deleted successfully",
    });
  } catch (error) {
    console.error("DELETE /api/vendor-requests error:", error);

    if (error.name === "CastError") {
      return NextResponse.json({ success: false, error: "Invalid request ID format" }, { status: 400 });
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete vendor request",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
