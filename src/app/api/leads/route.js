import { NextResponse } from "next/server";
import { headers } from "next/headers";
import connectToDatabase from "../../../database/mongoose";
import LeadsModel from "../../../database/models/LeadsModel";

const PHONE_REGEX = /^[6-9]\d{9}$/;
const NAME_REGEX = /^[a-zA-Z\s]+$/;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "PlanWAB@12345";
const VENDOR_REQ_EDIT_ADMIN_PASSWORD = process.env.VENDOR_REQ_EDIT_ADMIN_PASSWORD || "EDit@PlanWAB@12345";

const verifyAdminPassword = (password) => {
  return password === ADMIN_PASSWORD;
};

const verifyVendorReqEditPassword = (password) => {
  return password === VENDOR_REQ_EDIT_ADMIN_PASSWORD || password === ADMIN_PASSWORD;
};

// Valid action types for validation
const VALID_ACTION_TYPES = [
  "revealWhatsapp",
  "revealEmail",
  "revealPhone",
  "downloadBrochure",
  "bookDemo",
  "auto-popup",
  "general",
];

// Validation helper
function validateLead(name, phone, actionType) {
  const errors = [];

  if (!name || !phone) {
    return { valid: false, error: "Name and phone are required" };
  }

  const trimmedName = name.trim();
  const cleanPhone = phone.replace(/\D/g, "");

  if (trimmedName.length < 2 || trimmedName.length > 100) {
    errors.push("Name must be between 2 and 100 characters");
  }

  if (!NAME_REGEX.test(trimmedName)) {
    errors.push("Name can only contain letters and spaces");
  }

  if (!PHONE_REGEX.test(cleanPhone)) {
    errors.push("Invalid phone number. Must be a valid 10-digit Indian number");
  }

  if (actionType && !VALID_ACTION_TYPES.includes(actionType)) {
    errors.push(`Invalid actionType. Must be one of: ${VALID_ACTION_TYPES.join(", ")}`);
  }

  if (errors.length > 0) {
    return { valid: false, error: errors.join(". ") };
  }

  return { valid: true, name: trimmedName, phone: cleanPhone };
}

// Validate and sanitize URL
function validateUrl(url) {
  if (!url) return null;
  try {
    const trimmedUrl = url.trim();
    if (trimmedUrl.length > 500) return null;
    const urlObj = new URL(trimmedUrl);
    // Only allow http and https protocols
    if (urlObj.protocol !== "http:" && urlObj.protocol !== "https:") {
      return null;
    }
    return trimmedUrl;
  } catch {
    return null;
  }
}

export async function POST(request) {
  try {
    const [_, body, headersList] = await Promise.all([
      connectToDatabase(),
      request.json(),
      headers(),
    ]);

    const {
      name,
      phone,
      actionType = "general",
      currentUrl,
      metadata
    } = body;

    // Validation
    const validation = validateLead(name, phone, actionType);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const { name: validName, phone: validPhone } = validation;

    // Validate and sanitize currentUrl
    const validCurrentUrl = validateUrl(currentUrl);

    // Extract IP address
    const ipAddress =
      headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      headersList.get("x-real-ip") ||
      "unknown";

    const userAgent = headersList.get("user-agent") || "unknown";

    const twentyFourHoursAgo = new Date(Date.now() - 86400000); // 24 hours ago

    const existingLead = await LeadsModel.findOne({
      phone: validPhone,
      actionType,
      createdAt: { $gte: twentyFourHoursAgo },
    })
      .select("_id name phone actionType currentUrl createdAt")
      .lean()
      .exec();

    if (existingLead) {
      return NextResponse.json(
        {
          success: true,
          message: "You've already submitted this request. We'll contact you soon!",
          lead: {
            id: existingLead._id,
            name: existingLead.name,
            phone: existingLead.phone,
            actionType: existingLead.actionType,
            currentUrl: existingLead.currentUrl,
          },
          isExisting: true,
        },
        { status: 200 }
      );
    }

    // Prepare lead data
    const leadData = {
      name: validName,
      phone: validPhone,
      actionType,
      currentUrl: validCurrentUrl,
      ipAddress,
      userAgent,
      source: "website",
      status: "new",
    };

    // Add metadata if provided
    if (metadata && typeof metadata === "object") {
      leadData.metadata = new Map(Object.entries(metadata));
    }

    // Create lead
    const lead = await LeadsModel.create(leadData);

    return NextResponse.json(
      {
        success: true,
        message: "Thank you! We'll contact you shortly.",
        lead: {
          id: lead._id,
          name: lead.name,
          phone: lead.phone,
          actionType: lead.actionType,
          currentUrl: lead.currentUrl,
          createdAt: lead.createdAt,
        },
        isExisting: false,
      },
      { status: 201 }
    );
  } catch (error) {
    // Handle validation errors
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map((e) => e.message);
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validationErrors,
        },
        { status: 400 }
      );
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "A lead with this information already exists" },
        { status: 409 }
      );
    }

    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON format in request body" },
        { status: 400 }
      );
    }

    if (error.name === "MongoNetworkError" || error.name === "MongoTimeoutError") {
      return NextResponse.json(
        { error: "Database connection issue. Please try again." },
        { status: 503 }
      );
    }

    // Generic error handler
    return NextResponse.json(
      {
        error: "Something went wrong. Please try again.",
        message: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    // Pagination parameters
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20")));
    // Filter parameters
    const status = searchParams.get("status");
    const actionType = searchParams.get("actionType");
    const search = searchParams.get("search");
    const url = searchParams.get("url");

    // Build query
    const query = {};
    if (status) query.status = status;
    if (actionType) query.actionType = actionType;
    if (url) query.currentUrl = { $regex: url, $options: "i" };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const [leads, total] = await Promise.all([
      LeadsModel.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select("-__v -userAgent -ipAddress -metadata")
        .lean()
        .exec(),
      LeadsModel.countDocuments(query),
    ]);

    return NextResponse.json(
      {
        success: true,
        leads,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to fetch leads",
        message: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

// PUT - Update lead status (for admin panel)
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
      return NextResponse.json({ success: false, error: "Lead ID is required" }, { status: 400 });
    }

    const body = await request.json();
    const updateData = { ...body };
    delete updateData._id;
    delete updateData.createdAt;

    const updatedLead = await LeadsModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedLead) {
      return NextResponse.json({ success: false, error: "Lead not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: updatedLead,
      message: "Lead updated successfully",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update lead",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete lead
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
      return NextResponse.json({ success: false, error: "Lead ID is required" }, { status: 400 });
    }

    const deletedLead = await LeadsModel.findByIdAndDelete(id);

    if (!deletedLead) {
      return NextResponse.json({ success: false, error: "Lead not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: { id: deletedLead._id },
      message: "Lead deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete lead",
        details: error.message,
      },
      { status: 500 }
    );
  }
}