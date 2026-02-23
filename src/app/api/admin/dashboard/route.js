import { NextResponse } from "next/server";
import connectToDatabase from "@/database/mongoose";
import Vendor from "@/database/models/VendorModel";
import User from "@/database/models/userModel";
import VendorProfile from "@/database/models/VendorProfileModel";
import Order from "@/database/models/Orders";
import VendorRequest from "@/database/models/VendorRequestsModel";
import BirthdayBooking from "@/database/models/BirthdayBooking";
import DetailsBookingRequest from "@/database/models/DetailsBookingRequestModel";
import Lead from "@/database/models/LeadsModel";

export async function GET() {
    try {
        await connectToDatabase();

        const [
            totalVendors,
            featuredVendors,
            totalUsers,
            categories,
            totalVendorProfiles,
            totalOrders,
            vendorRequests,
            totalBirthdayRequests,
            totalBookingRequests,
            totalLeadsRequests
        ] = await Promise.all([
            Vendor.countDocuments(),
            Vendor.countDocuments({ isFeatured: true }),
            User.countDocuments(),
            Vendor.distinct("category"),
            VendorProfile.countDocuments(),
            Order.countDocuments(),
            VendorRequest.countDocuments(),
            BirthdayBooking.countDocuments(),
            DetailsBookingRequest.countDocuments(),
            Lead.countDocuments()
        ]);

        const totalCategories = categories.length;

        return NextResponse.json(
            {
                success: true,
                data: {
                    totalVendors,
                    featuredVendors,
                    totalUsers,
                    totalCategories,
                    totalVendorProfiles,
                    totalOrders,
                    vendorRequests,
                    totalBirthdayRequests,
                    totalBookingRequests,
                    totalLeadsRequests
                },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Dashboard stats fetch error:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Failed to fetch dashboard stats",
                details: error.message,
            },
            { status: 500 }
        );
    }
}
