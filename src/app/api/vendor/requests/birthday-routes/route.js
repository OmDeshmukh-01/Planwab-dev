import { NextResponse } from "next/server";
import connectToDatabase from "../../../../../database/mongoose";
import BirthdayBooking from "../../../../../database/models/BirthdayBooking";

export async function POST(request) {
    try {
        await connectToDatabase();

        const body = await request.json();

        if (!body.sessionId) {
            return NextResponse.json(
                { success: false, error: "Session ID is required" },
                { status: 400 }
            );
        }

        const existingBooking = await BirthdayBooking.findOne({
            sessionId: body.sessionId,
        });

        if (existingBooking) {
            // If booking exists, update the user details instead of erroring
            if (body.userDetails) {
                existingBooking.userDetails = {
                    ...existingBooking.userDetails,
                    ...body.userDetails
                };
                await existingBooking.save();
            }

            return NextResponse.json(
                {
                    success: true,
                    data: existingBooking,
                    message: "Booking details updated successfully",
                },
                { status: 200 }
            );
        }

        // Generate a readable Booking ID (e.g., BDAY-123456)
        const generateBookingId = () => {
            const timestamp = Date.now().toString().slice(-4);
            const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
            return `BDAY-${timestamp}${random}`;
        };

        const booking = new BirthdayBooking({
            sessionId: body.sessionId,
            bookingId: generateBookingId(),
            userDetails: body.userDetails || {},
            status: "draft",
        });

        await booking.save();

        return NextResponse.json(
            {
                success: true,
                data: booking,
                message: "Booking created successfully",
            },
            { status: 201 }
        );
    } catch (error) {
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
                error: "Failed to create booking",
                details: error.message,
            },
            { status: 500 }
        );
    }
}

export async function PATCH(request) {
    try {
        await connectToDatabase();

        const body = await request.json();

        if (!body.sessionId) {
            return NextResponse.json(
                { success: false, error: "Session ID is required" },
                { status: 400 }
            );
        }

        const updateData = {};

        if (body.userDetails) {
            updateData.userDetails = body.userDetails;
        }

        if (body.venueId) {
            updateData.venueId = body.venueId;
            updateData.venueName = body.venueName;
            updateData.venueLocation = body.venueLocation;
            updateData.venuePrice = body.venuePrice;
            updateData.status = "details_added";
        }

        if (body.bookingDetails) {
            updateData.bookingDetails = body.bookingDetails;
            updateData.status = "completed";
            updateData.submittedAt = new Date();
        }

        const booking = await BirthdayBooking.findOneAndUpdate(
            { sessionId: body.sessionId },
            updateData,
            { new: true, runValidators: true }
        );

        if (!booking) {
            return NextResponse.json(
                { success: false, error: "Booking not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: booking,
            message: "Booking updated successfully",
        });
    } catch (error) {
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
                error: "Failed to update booking",
                details: error.message,
            },
            { status: 500 }
        );
    }
}

// PUT - Update booking
export async function PUT(request) {
    try {
        await connectToDatabase();

        const { searchParams } = new URL(request.url);
        const adminPassword = searchParams.get("adminPassword");
        const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "PlanWAB@12345";
        const VENDOR_REQ_EDIT_ADMIN_PASSWORD = process.env.VENDOR_REQ_EDIT_ADMIN_PASSWORD || "EDit@PlanWAB@12345";

        if (adminPassword !== ADMIN_PASSWORD && adminPassword !== VENDOR_REQ_EDIT_ADMIN_PASSWORD) {
            return NextResponse.json({ success: false, error: "Unauthorized: Invalid admin password" }, { status: 401 });
        }

        const body = await request.json();
        const { id, _id, ...updateData } = body;
        const requestId = id || _id || searchParams.get("id");

        if (!requestId) {
            return NextResponse.json({ success: false, error: "Booking ID is required" }, { status: 400 });
        }

        const booking = await BirthdayBooking.findByIdAndUpdate(
            requestId,
            updateData,
            { new: true, runValidators: true }
        );

        if (!booking) {
            return NextResponse.json(
                { success: false, error: "Booking not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: booking,
            message: "Booking updated successfully",
        });
    } catch (error) {
        console.error("PUT /api/birthday-routes error:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Failed to update booking",
                details: error.message,
            },
            { status: 500 }
        );
    }
}

// DELETE - Delete booking
export async function DELETE(request) {
    try {
        await connectToDatabase();

        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");
        const adminPassword = searchParams.get("adminPassword");
        const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "PlanWAB@12345";

        if (adminPassword !== ADMIN_PASSWORD) {
            return NextResponse.json({ success: false, error: "Unauthorized: Invalid admin password" }, { status: 401 });
        }

        if (!id) {
            return NextResponse.json({ success: false, error: "Booking ID is required" }, { status: 400 });
        }

        const deletedBooking = await BirthdayBooking.findByIdAndDelete(id);

        if (!deletedBooking) {
            return NextResponse.json(
                { success: false, error: "Booking not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Booking deleted successfully",
        });
    } catch (error) {
        console.error("DELETE /api/birthday-routes error:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Failed to delete booking",
                details: error.message,
            },
            { status: 500 }
        );
    }
}

export async function GET(request) {
    try {
        await connectToDatabase();

        const { searchParams } = new URL(request.url);
        const sessionId = searchParams.get("sessionId");

        if (sessionId) {
            const booking = await BirthdayBooking.findOne({ sessionId }).lean();

            if (!booking) {
                return NextResponse.json(
                    { success: false, error: "Booking not found" },
                    { status: 404 }
                );
            }

            return NextResponse.json({
                success: true,
                data: booking,
            });
        }

        const page = parseInt(searchParams.get("page")) || 1;
        const limit = parseInt(searchParams.get("limit")) || 10;
        const status = searchParams.get("status");

        const filter = {};
        if (status && status !== "all") {
            filter.status = status;
        }

        const skip = (page - 1) * limit;

        const [bookings, totalCount] = await Promise.all([
            BirthdayBooking.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            BirthdayBooking.countDocuments(filter),
        ]);

        const totalPages = Math.ceil(totalCount / limit);

        return NextResponse.json({
            success: true,
            data: {
                bookings,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalCount,
                    hasNextPage: page < totalPages,
                    hasPrevPage: page > 1,
                    limit,
                },
            },
        });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                error: "Failed to fetch bookings",
                details: error.message,
            },
            { status: 500 }
        );
    }
}