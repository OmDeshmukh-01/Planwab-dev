import { NextResponse } from "next/server";
import connectToDatabase from "../../../database/mongoose";
import PlannedEvent from "../../../database/models/PlannedEvent";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "PlanWAB@12345";
const EVENT_EDIT_ADMIN_PASSWORD = process.env.EVENT_EDIT_ADMIN_PASSWORD || "EDit@PlanWAB@12345";

const verifyAdminPassword = (password) => {
  return password === ADMIN_PASSWORD;
};

const verifyEventEditPassword = (password) => {
  return password === EVENT_EDIT_ADMIN_PASSWORD;
};

export async function GET(request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 100;
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "all";
    const type = searchParams.get("type") || "all";
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    const skip = (page - 1) * limit;

    let query = {};

    if (search) {
      query.$or = [
        { eventName: { $regex: search, $options: "i" } },
        { clientName: { $regex: search, $options: "i" } },
        { venue: { $regex: search, $options: "i" } },
        { eventType: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (status !== "all") {
      query.status = status;
    }

    if (type !== "all") {
      query.eventType = type;
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;

    const [events, totalCount] = await Promise.all([
      PlannedEvent.find(query).sort(sortOptions).skip(skip).limit(limit).lean(),
      PlannedEvent.countDocuments(query),
    ]);

    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    const statsAggregation = await PlannedEvent.aggregate([
      { $match: {} },
      {
        $group: {
          _id: null,
          totalEvents: { $sum: 1 },
          totalBudget: { $sum: { $toDouble: "$budget" } },
          avgBudget: { $avg: { $toDouble: "$budget" } },
          upcomingCount: {
            $sum: { $cond: [{ $eq: ["$status", "Upcoming"] }, 1, 0] },
          },
          completedCount: {
            $sum: { $cond: [{ $eq: ["$status", "Completed"] }, 1, 0] },
          },
          planningCount: {
            $sum: { $cond: [{ $eq: ["$status", "Planning"] }, 1, 0] },
          },
          cancelledCount: {
            $sum: { $cond: [{ $eq: ["$status", "Cancelled"] }, 1, 0] },
          },
          ongoingCount: {
            $sum: { $cond: [{ $eq: ["$status", "Ongoing"] }, 1, 0] },
          },
        },
      },
    ]);

    const eventTypeStats = await PlannedEvent.aggregate([
      { $match: {} },
      {
        $group: {
          _id: "$eventType",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

    const [thisMonthCount, lastMonthCount] = await Promise.all([
      PlannedEvent.countDocuments({
        createdAt: { $gte: thisMonthStart },
      }),
      PlannedEvent.countDocuments({
        createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd },
      }),
    ]);

    const stats = statsAggregation[0] || {
      totalEvents: 0,
      totalBudget: 0,
      avgBudget: 0,
      upcomingCount: 0,
      completedCount: 0,
      planningCount: 0,
      cancelledCount: 0,
      ongoingCount: 0,
    };

    const eventTypes = eventTypeStats.reduce((acc, item) => {
      if (item._id) {
        acc[item._id] = item.count;
      }
      return acc;
    }, {});

    const topEventType = eventTypeStats[0]?._id || "N/A";

    const growthRate =
      lastMonthCount > 0
        ? Math.round(((thisMonthCount - lastMonthCount) / lastMonthCount) * 100)
        : thisMonthCount > 0
          ? 100
          : 0;

    return NextResponse.json(
      {
        success: true,
        data: events,
        pagination: {
          total: totalCount,
          page,
          limit,
          totalPages,
          hasNextPage,
          hasPrevPage,
          skip,
        },
        stats: {
          total: stats.totalEvents,
          upcoming: stats.upcomingCount,
          completed: stats.completedCount,
          planning: stats.planningCount,
          cancelled: stats.cancelledCount,
          ongoing: stats.ongoingCount,
          totalBudget: stats.totalBudget || 0,
          avgBudget: Math.round(stats.avgBudget || 0),
          thisMonth: thisMonthCount,
          lastMonth: lastMonthCount,
          growthRate,
          eventTypes,
          topEventType,
        },
        filters: {
          search,
          status,
          type,
          sortBy,
          sortOrder,
        },
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("❌ GET_ALL_EVENTS_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch events",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const { eventId, password: adminPassword, ...updateData } = body;

    if (!verifyEventEditPassword(adminPassword) && !verifyAdminPassword(adminPassword)) {
      return NextResponse.json({ success: false, message: "Invalid admin password" }, { status: 401 });
    }

    if (!eventId) {
      return NextResponse.json(
        {
          success: false,
          message: "Event ID is required",
        },
        { status: 400 }
      );
    }

    const { password: _, ...cleanUpdateData } = updateData;

    if (cleanUpdateData.eventDate) {
      cleanUpdateData.eventDate = new Date(cleanUpdateData.eventDate);
    }

    const updatedEvent = await PlannedEvent.findByIdAndUpdate(eventId, cleanUpdateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedEvent) {
      return NextResponse.json(
        {
          success: false,
          message: "Event not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Event updated successfully",
        data: updatedEvent,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ UPDATE_EVENT_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update event",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get("id"); // Changed from "eventId" to "id"
    const password = searchParams.get("password"); // Add password extraction

    if (!verifyAdminPassword(password)) {
      return NextResponse.json({ success: false, message: "Invalid admin password" }, { status: 401 });
    }

    if (!eventId) {
      return NextResponse.json(
        {
          success: false,
          message: "Event ID is required",
        },
        { status: 400 }
      );
    }

    const deletedEvent = await PlannedEvent.findByIdAndDelete(eventId);

    if (!deletedEvent) {
      return NextResponse.json(
        {
          success: false,
          message: "Event not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Event deleted successfully",
        data: deletedEvent,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ DELETE_EVENT_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete event",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
