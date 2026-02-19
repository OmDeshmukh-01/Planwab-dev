import { NextResponse } from "next/server";
import connectToDatabase from "@/database/mongoose";
import PlannedEvent from "@/database/models/PlannedEvent";
import Vendor from "@/database/models/VendorModel";
import User from "@/database/models/userModel";

export async function GET() {
    try {
        await connectToDatabase();
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const [totalEvents, activeVendors, newUsers] = await Promise.all([
            PlannedEvent.countDocuments(),
            Vendor.countDocuments({ isActive: true, isVerified: true }),
            User.countDocuments({ createdAt: { $gte: startOfMonth } }),
        ]);

        return NextResponse.json(
            {
                success: true,
                data: {
                    totalEvents,
                    activeVendors,
                    newUsers,
                    
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
