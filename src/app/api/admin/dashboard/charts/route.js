import Vendor from "@/database/models/VendorModel";
import Order from "@/database/models/Orders";
import PlannedEvent from "@/database/models/PlannedEvent";
import BirthdayBooking from "@/database/models/BirthdayBooking";
import DetailsBookingRequest from "@/database/models/DetailsBookingRequestModel";
import VendorRequest from "@/database/models/VendorRequestsModel";
import LeadsModel from "@/database/models/LeadsModel";
import connectToDatabase from "@/database/mongoose";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET() {
    try {
        await connectToDatabase();

        const categoriesCount = await Vendor.aggregate([
            {
                $group: {
                    _id: "$category",
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            }
        ]);

        const pieData = categoriesCount.map((item) => ({
            category: item._id || "Uncategorized",
            count: item.count
        }));

        const ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

        const ordersDataPromise = Order.aggregate([
            { $match: { createdAt: { $gte: ninetyDaysAgo } } },
            { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } }
        ]);

        const eventsDataPromise = PlannedEvent.aggregate([
            { $match: { createdAt: { $gte: ninetyDaysAgo } } },
            { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } }
        ]);

        const birthdayDataPromise = BirthdayBooking.aggregate([
            { $match: { createdAt: { $gte: ninetyDaysAgo } } },
            { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } }
        ]);

        const bookingDataPromise = DetailsBookingRequest.aggregate([
            { $match: { createdAt: { $gte: ninetyDaysAgo } } },
            { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } }
        ]);

        const leadsDataPromise = LeadsModel.aggregate([
            { $match: { createdAt: { $gte: ninetyDaysAgo } } },
            { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } }
        ]);

        const vendorRequestsDataPromise = VendorRequest.aggregate([
            { $match: { createdAt: { $gte: ninetyDaysAgo } } },
            { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } }
        ]);

        let ContactUs;
        try {
            ContactUs = mongoose.models.ContactForm || require("@/database/models/ContactUsModel").default;
        } catch (error) {
            console.error("Failed to load ContactUs model safely:", error);
            ContactUs = { aggregate: () => Promise.resolve([]) };
        }

        const contactDataPromise = ContactUs.aggregate([
            { $match: { createdAt: { $gte: ninetyDaysAgo } } },
            { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } }
        ]);

        const [
            ordersData,
            eventsData,
            birthdayData,
            bookingData,
            leadsData,
            vendorRequestsData,
            contactData
        ] = await Promise.all([
            ordersDataPromise,
            eventsDataPromise,
            birthdayDataPromise,
            bookingDataPromise,
            leadsDataPromise,
            vendorRequestsDataPromise,
            contactDataPromise
        ]);

        const barDateMap = {};
        const requestsDateMap = {};
        const vendorRequestsDateMap = {};

        for (let i = 0; i < 90; i++) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            barDateMap[dateStr] = { date: dateStr, orders: 0, events: 0 };
            requestsDateMap[dateStr] = { date: dateStr, birthday: 0, booking: 0, leads: 0, contact: 0 };
            vendorRequestsDateMap[dateStr] = { date: dateStr, requests: 0 };
        }

        ordersData.forEach(item => { if (barDateMap[item._id]) barDateMap[item._id].orders = item.count; });
        eventsData.forEach(item => { if (barDateMap[item._id]) barDateMap[item._id].events = item.count; });

        birthdayData.forEach(item => { if (requestsDateMap[item._id]) requestsDateMap[item._id].birthday = item.count; });
        bookingData.forEach(item => { if (requestsDateMap[item._id]) requestsDateMap[item._id].booking = item.count; });
        leadsData.forEach(item => { if (requestsDateMap[item._id]) requestsDateMap[item._id].leads = item.count; });
        contactData.forEach(item => { if (requestsDateMap[item._id]) requestsDateMap[item._id].contact = item.count; });

        vendorRequestsData.forEach(item => { if (vendorRequestsDateMap[item._id]) vendorRequestsDateMap[item._id].requests = item.count; });

        const barData = Object.values(barDateMap).sort((a, b) => new Date(a.date) - new Date(b.date));
        const requestsBarData = Object.values(requestsDateMap).sort((a, b) => new Date(a.date) - new Date(b.date));
        const vendorRequestsBarData = Object.values(vendorRequestsDateMap).sort((a, b) => new Date(a.date) - new Date(b.date));

        return NextResponse.json({
            success: true,
            data: {
                pieData,
                barData,
                requestsBarData,
                vendorRequestsBarData
            }
        });
    } catch (error) {
        console.error("Error fetching chart data:", error);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}
