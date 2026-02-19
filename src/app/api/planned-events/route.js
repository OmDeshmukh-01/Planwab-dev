import { NextResponse } from "next/server";
import connectToDatabase from "../../../database/mongoose";
import PlannedToolEvent from "../../../database/models/PlannedToolEvent";

function generateShareCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

// GET - Fetch all events for a user
export async function GET(request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const category = searchParams.get("category");
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 20;
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const shareCode = searchParams.get("shareCode");

    // If shareCode is provided, find by share code
    if (shareCode) {
      const event = await PlannedToolEvent.findOne({ shareCode, isPublic: true });
      if (!event) {
        return NextResponse.json({ success: false, message: "Event not found or not public" }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: event });
    }

    const query = { userId };
    if (category && category !== "all") query.category = category;
    if (status && status !== "all") query.status = status;

    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === "desc" ? -1 : 1 };

    const [events, total] = await Promise.all([
      PlannedToolEvent.find(query).sort(sort).skip(skip).limit(limit).lean(),
      PlannedToolEvent.countDocuments(query),
    ]);

    // Add computed fields
    const eventsWithComputed = events.map((event) => ({
      ...event,
      _id: event._id.toString(),
      tasksCompleted: event.checklist?.filter((item) => item.completed).length || 0,
      totalTasks: event.checklist?.length || 0,
      totalBudgetAllocated: event.budgetCategories?.reduce((sum, cat) => sum + cat.allocated, 0) || 0,
      totalBudgetSpent: event.budgetCategories?.reduce((sum, cat) => sum + cat.spent, 0) || 0,
      confirmedGuests: event.guests?.filter((g) => g.status === "confirmed").length || 0,
    }));

    return NextResponse.json({
      success: true,
      data: eventsWithComputed,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching planned events:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch events", error: error.message }, { status: 500 });
  }
}

// POST - Create a new event
export async function POST(request) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const { userId, name, category, date, time, venue, guestCount, budget, image, description } = body;

    if (!userId || !name || !date) {
      return NextResponse.json({ success: false, message: "User ID, name, and date are required" }, { status: 400 });
    }

    // Default budget categories based on event type
    const defaultBudgetCategories = {
      wedding: [
        { name: "Venue", allocated: 400000, spent: 0, color: "#7c3aed" },
        { name: "Catering", allocated: 300000, spent: 0, color: "#ea580c" },
        { name: "Photography", allocated: 150000, spent: 0, color: "#db2777" },
        { name: "Decor", allocated: 200000, spent: 0, color: "#0d9488" },
        { name: "Clothing", allocated: 250000, spent: 0, color: "#9333ea" },
        { name: "Others", allocated: 200000, spent: 0, color: "#64748b" },
      ],
      birthday: [
        { name: "Venue", allocated: 15000, spent: 0, color: "#7c3aed" },
        { name: "Catering", allocated: 12000, spent: 0, color: "#ea580c" },
        { name: "Cake", allocated: 5000, spent: 0, color: "#f472b6" },
        { name: "Decor", allocated: 8000, spent: 0, color: "#0d9488" },
        { name: "Entertainment", allocated: 5000, spent: 0, color: "#2563eb" },
        { name: "Others", allocated: 5000, spent: 0, color: "#64748b" },
      ],
      conference: [
        { name: "Venue", allocated: 50000, spent: 0, color: "#7c3aed" },
        { name: "Catering", allocated: 30000, spent: 0, color: "#ea580c" },
        { name: "AV Equipment", allocated: 20000, spent: 0, color: "#2563eb" },
        { name: "Marketing", allocated: 15000, spent: 0, color: "#db2777" },
        { name: "Others", allocated: 5000, spent: 0, color: "#64748b" },
      ],
      default: [
        { name: "Venue", allocated: 30000, spent: 0, color: "#7c3aed" },
        { name: "Catering", allocated: 25000, spent: 0, color: "#ea580c" },
        { name: "Decor", allocated: 20000, spent: 0, color: "#0d9488" },
        { name: "Entertainment", allocated: 15000, spent: 0, color: "#2563eb" },
        { name: "Others", allocated: 10000, spent: 0, color: "#64748b" },
      ],
    };

    // Default checklist based on event type
    const defaultChecklist = {
      wedding: [
        { id: generateId(), text: "Set wedding date", completed: false, priority: "high", dueIn: "12 months", category: "planning" },
        { id: generateId(), text: "Create budget", completed: false, priority: "high", dueIn: "12 months", category: "finance" },
        { id: generateId(), text: "Book venue", completed: false, priority: "high", dueIn: "10 months", category: "venue" },
        { id: generateId(), text: "Hire photographer", completed: false, priority: "medium", dueIn: "8 months", category: "vendor" },
        { id: generateId(), text: "Choose catering", completed: false, priority: "medium", dueIn: "6 months", category: "vendor" },
        { id: generateId(), text: "Send invitations", completed: false, priority: "medium", dueIn: "3 months", category: "planning" },
      ],
      birthday: [
        { id: generateId(), text: "Set party date & time", completed: false, priority: "high", dueIn: "1 month", category: "planning" },
        { id: generateId(), text: "Create guest list", completed: false, priority: "high", dueIn: "3 weeks", category: "planning" },
        { id: generateId(), text: "Book venue", completed: false, priority: "high", dueIn: "3 weeks", category: "venue" },
        { id: generateId(), text: "Order cake", completed: false, priority: "medium", dueIn: "1 week", category: "food" },
        { id: generateId(), text: "Plan decorations", completed: false, priority: "medium", dueIn: "1 week", category: "decor" },
      ],
      default: [
        { id: generateId(), text: "Set event date", completed: false, priority: "high", dueIn: "1 month", category: "planning" },
        { id: generateId(), text: "Create budget", completed: false, priority: "high", dueIn: "1 month", category: "finance" },
        { id: generateId(), text: "Book venue", completed: false, priority: "high", dueIn: "3 weeks", category: "venue" },
        { id: generateId(), text: "Send invitations", completed: false, priority: "medium", dueIn: "2 weeks", category: "planning" },
      ],
    };

    const eventCategory = category || "other";
    const budgetCats = defaultBudgetCategories[eventCategory] || defaultBudgetCategories.default;
    const checklistItems = defaultChecklist[eventCategory] || defaultChecklist.default;

    const newEvent = new PlannedToolEvent({
      userId,
      name,
      category: eventCategory,
      date,
      time: time || "",
      venue: venue || "",
      guestCount: parseInt(guestCount) || 0,
      budget: parseFloat(budget) || 0,
      image: image || "",
      description: description || "",
      budgetCategories: budgetCats,
      checklist: checklistItems,
      guests: [],
      timeline: [],
      savedVendors: [],
      bookedVendors: [],
      shareCode: generateShareCode(),
    });

    await newEvent.save();

    const savedEvent = newEvent.toObject();
    savedEvent._id = savedEvent._id.toString();
    savedEvent.tasksCompleted = savedEvent.checklist.filter((item) => item.completed).length;
    savedEvent.totalTasks = savedEvent.checklist.length;

    return NextResponse.json({ success: true, data: savedEvent }, { status: 201 });
  } catch (error) {
    console.error("Error creating planned event:", error);
    return NextResponse.json({ success: false, message: "Failed to create event", error: error.message }, { status: 500 });
  }
}