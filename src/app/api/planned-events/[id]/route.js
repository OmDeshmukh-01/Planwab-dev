import { NextResponse } from "next/server";
import connectToDatabase from "../../../../database/mongoose";
import mongoose from "mongoose";
import PlannedToolEvent from "../../../../database/models/PlannedToolEvent";

// GET - Fetch single event by ID
export async function GET(request, { params }) {
  try {
    await connectToDatabase();

    const { id } = await params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Valid event ID is required" }, { status: 400 });
    }

    const event = await PlannedToolEvent.findById(id).lean();

    if (!event) {
      return NextResponse.json({ success: false, message: "Event not found" }, { status: 404 });
    }

    // Add computed fields
    const eventWithComputed = {
      ...event,
      _id: event._id.toString(),
      tasksCompleted: event.checklist?.filter((item) => item.completed).length || 0,
      totalTasks: event.checklist?.length || 0,
      totalBudgetAllocated: event.budgetCategories?.reduce((sum, cat) => sum + cat.allocated, 0) || 0,
      totalBudgetSpent: event.budgetCategories?.reduce((sum, cat) => sum + cat.spent, 0) || 0,
      confirmedGuests: event.guests?.filter((g) => g.status === "confirmed").length || 0,
    };

    return NextResponse.json({ success: true, data: eventWithComputed });
  } catch (error) {
    console.error("Error fetching planned event:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch event", error: error.message }, { status: 500 });
  }
}

// PUT - Update event
export async function PUT(request, { params }) {
  try {
    await connectToDatabase();

    const { id } = await params;
    const body = await request.json();

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Valid event ID is required" }, { status: 400 });
    }

    // Remove _id from body if present to avoid MongoDB error
    const { _id, ...updateData } = body;

    const updatedEvent = await PlannedToolEvent.findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: true }).lean();

    if (!updatedEvent) {
      return NextResponse.json({ success: false, message: "Event not found" }, { status: 404 });
    }

    // Add computed fields
    const eventWithComputed = {
      ...updatedEvent,
      _id: updatedEvent._id.toString(),
      tasksCompleted: updatedEvent.checklist?.filter((item) => item.completed).length || 0,
      totalTasks: updatedEvent.checklist?.length || 0,
      totalBudgetAllocated: updatedEvent.budgetCategories?.reduce((sum, cat) => sum + cat.allocated, 0) || 0,
      totalBudgetSpent: updatedEvent.budgetCategories?.reduce((sum, cat) => sum + cat.spent, 0) || 0,
      confirmedGuests: updatedEvent.guests?.filter((g) => g.status === "confirmed").length || 0,
    };

    return NextResponse.json({ success: true, data: eventWithComputed });
  } catch (error) {
    console.error("Error updating planned event:", error);
    return NextResponse.json({ success: false, message: "Failed to update event", error: error.message }, { status: 500 });
  }
}

// PATCH - Partial update (for specific fields like guests, checklist, budget)
export async function PATCH(request, { params }) {
  try {
    await connectToDatabase();

    const { id } = await params;
    const body = await request.json();
    const { action, data } = body;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Valid event ID is required" }, { status: 400 });
    }

    let updateOperation = {};

    switch (action) {
      case "addGuest":
        updateOperation = { $push: { guests: data } };
        break;
      case "updateGuest":
        updateOperation = {
          $set: { "guests.$[elem]": data },
        };
        break;
      case "removeGuest":
        updateOperation = { $pull: { guests: { id: data.id } } };
        break;
      case "addChecklistItem":
        updateOperation = { $push: { checklist: data } };
        break;
      case "updateChecklistItem":
        updateOperation = {
          $set: { "checklist.$[elem]": data },
        };
        break;
      case "removeChecklistItem":
        updateOperation = { $pull: { checklist: { id: data.id } } };
        break;
      case "toggleChecklistItem":
        const event = await PlannedToolEvent.findById(id);
        const item = event.checklist.find((c) => c.id === data.id);
        if (item) {
          updateOperation = {
            $set: { "checklist.$[elem].completed": !item.completed },
          };
        }
        break;
      case "addBudgetCategory":
        updateOperation = { $push: { budgetCategories: data } };
        break;
      case "updateBudgetCategory":
        updateOperation = {
          $set: { "budgetCategories.$[elem]": data },
        };
        break;
      case "removeBudgetCategory":
        updateOperation = { $pull: { budgetCategories: { name: data.name } } };
        break;
      case "addTimelineEvent":
        updateOperation = { $push: { timeline: data } };
        break;
      case "updateTimelineEvent":
        updateOperation = {
          $set: { "timeline.$[elem]": data },
        };
        break;
      case "removeTimelineEvent":
        updateOperation = { $pull: { timeline: { id: data.id } } };
        break;
      case "saveVendor":
        updateOperation = { $addToSet: { savedVendors: data.vendorId } };
        break;
      case "unsaveVendor":
        updateOperation = { $pull: { savedVendors: data.vendorId } };
        break;
      case "bookVendor":
        updateOperation = { $push: { bookedVendors: data } };
        break;
      case "updateBookedVendor":
        updateOperation = {
          $set: { "bookedVendors.$[elem]": data },
        };
        break;
      case "cancelBooking":
        updateOperation = { $pull: { bookedVendors: { vendorId: data.vendorId } } };
        break;
      case "updateBudgetSpent":
        updateOperation = {
          $set: { "budgetCategories.$[elem].spent": data.spent },
        };
        break;
      case "updateBudgetAllocated":
        updateOperation = {
          $set: { "budgetCategories.$[elem].allocated": data.allocated },
        };
        break;
      default:
        return NextResponse.json({ success: false, message: "Invalid action" }, { status: 400 });
    }

    const arrayFilters = [];
    if (
      ["updateGuest", "updateChecklistItem", "toggleChecklistItem", "updateBudgetCategory", "updateTimelineEvent", "updateBookedVendor", "updateBudgetSpent", "updateBudgetAllocated"].includes(
        action
      )
    ) {
      const filterField =
        action === "updateGuest"
          ? "id"
          : action === "updateChecklistItem" || action === "toggleChecklistItem"
          ? "id"
          : action === "updateBudgetCategory" || action === "updateBudgetSpent" || action === "updateBudgetAllocated"
          ? "name"
          : action === "updateTimelineEvent"
          ? "id"
          : "vendorId";

      const filterValue = data[filterField] || data.id || data.name || data.vendorId;
      arrayFilters.push({ [`elem.${filterField}`]: filterValue });
    }

    const updatedEvent = await PlannedToolEvent.findByIdAndUpdate(id, updateOperation, {
      new: true,
      runValidators: true,
      arrayFilters: arrayFilters.length > 0 ? arrayFilters : undefined,
    }).lean();

    if (!updatedEvent) {
      return NextResponse.json({ success: false, message: "Event not found" }, { status: 404 });
    }

    // Add computed fields
    const eventWithComputed = {
      ...updatedEvent,
      _id: updatedEvent._id.toString(),
      tasksCompleted: updatedEvent.checklist?.filter((item) => item.completed).length || 0,
      totalTasks: updatedEvent.checklist?.length || 0,
      totalBudgetAllocated: updatedEvent.budgetCategories?.reduce((sum, cat) => sum + cat.allocated, 0) || 0,
      totalBudgetSpent: updatedEvent.budgetCategories?.reduce((sum, cat) => sum + cat.spent, 0) || 0,
      confirmedGuests: updatedEvent.guests?.filter((g) => g.status === "confirmed").length || 0,
    };

    return NextResponse.json({ success: true, data: eventWithComputed });
  } catch (error) {
    console.error("Error patching planned event:", error);
    return NextResponse.json({ success: false, message: "Failed to update event", error: error.message }, { status: 500 });
  }
}

// DELETE - Delete event
export async function DELETE(request, { params }) {
  try {
    await connectToDatabase();

    const { id } = await params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Valid event ID is required" }, { status: 400 });
    }

    const deletedEvent = await PlannedToolEvent.findByIdAndDelete(id);

    if (!deletedEvent) {
      return NextResponse.json({ success: false, message: "Event not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting planned event:", error);
    return NextResponse.json({ success: false, message: "Failed to delete event", error: error.message }, { status: 500 });
  }
}