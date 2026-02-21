import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../database/mongoose';
import ContactForm from '../../../database/models/ContactUsModel';

export async function GET(request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const userType = searchParams.get('userType');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') === 'asc' ? 1 : -1;

    // Build filter
    const filter = {};
    if (status) filter.status = status;
    if (userType) filter.userType = userType;

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute query
    const [submissions, total] = await Promise.all([
      ContactForm.find(filter)
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit)
        .lean(),
      ContactForm.countDocuments(filter),
    ]);

    return NextResponse.json({
      success: true,
      data: submissions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('GET /api/contact error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch contact submissions',
        message: error.message,
      },
      { status: 500 }
    );
  }
}

// POST - Create new contact form submission
export async function POST(request) {
  try {
    await connectToDatabase();

    const body = await request.json();

    // Validate required fields
    const { name, email, phone, subject, message, userType } = body;

    if (!name || !email || !phone || !subject || !message) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
        },
        { status: 400 }
      );
    }

    // Get client info
    const ipAddress = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Create submission
    const submission = await ContactForm.create({
      name,
      email,
      phone,
      subject,
      message,
      userType: userType || 'customer',
      ipAddress,
      userAgent,
    });

    // Optional: Send email notification to admin
    // await sendEmailNotification(submission);

    return NextResponse.json(
      {
        success: true,
        message: 'Contact form submitted successfully',
        data: submission,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/contact error:', error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err) => err.message);
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to submit contact form',
        message: error.message,
      },
      { status: 500 }
    );
  }
}