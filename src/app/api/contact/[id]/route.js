import { NextResponse } from 'next/server';

import mongoose from 'mongoose';
import { connectToDatabase } from '../../../../database/mongoose';
import ContactForm from '../../../../database/models/ContactUsModel';

// GET - Fetch single submission by ID
export async function GET(request, { params }) {
  try {
    await connectToDatabase();

    const { id } = params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid submission ID',
        },
        { status: 400 }
      );
    }

    const submission = await ContactForm.findById(id);

    if (!submission) {
      return NextResponse.json(
        {
          success: false,
          error: 'Submission not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: submission,
    });
  } catch (error) {
    console.error('GET /api/contact/[id] error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch submission',
        message: error.message,
      },
      { status: 500 }
    );
  }
}

// PUT - Update submission (admin use)
export async function PUT(request, { params }) {
  try {
    await connectToDatabase();

    const { id } = params;
    const body = await request.json();

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid submission ID',
        },
        { status: 400 }
      );
    }

    // Fields that can be updated (admin only)
    const allowedUpdates = ['status', 'priority', 'adminNotes', 'respondedAt'];
    const updates = {};

    Object.keys(body).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        updates[key] = body[key];
      }
    });

    // If status is being changed to resolved/closed, set respondedAt
    if (
      (updates.status === 'resolved' || updates.status === 'closed') &&
      !updates.respondedAt
    ) {
      updates.respondedAt = new Date();
    }

    const submission = await ContactForm.findByIdAndUpdate(
      id,
      { $set: updates },
      {
        new: true, // Return updated document
        runValidators: true, // Run model validators
      }
    );

    if (!submission) {
      return NextResponse.json(
        {
          success: false,
          error: 'Submission not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Submission updated successfully',
      data: submission,
    });
  } catch (error) {
    console.error('PUT /api/contact/[id] error:', error);

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
        error: 'Failed to update submission',
        message: error.message,
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete submission (admin use)
export async function DELETE(request, { params }) {
  try {
    await connectToDatabase();

    const { id } = params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid submission ID',
        },
        { status: 400 }
      );
    }

    const submission = await ContactForm.findByIdAndDelete(id);

    if (!submission) {
      return NextResponse.json(
        {
          success: false,
          error: 'Submission not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Submission deleted successfully',
      data: submission,
    });
  } catch (error) {
    console.error('DELETE /api/contact/[id] error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete submission',
        message: error.message,
      },
      { status: 500 }
    );
  }
}