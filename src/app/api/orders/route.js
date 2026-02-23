import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import crypto from "crypto";
import Order from "../../../database/models/Orders";
import { connectToDatabase } from "../../../database/mongoose";

export async function POST(req) {
  try {
    await connectToDatabase();

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_LIVE_KEY_ID,
      key_secret: process.env.RAZORPAY_LIVE_KEY_SECRET,
    });

    const body = await req.json();
    const { items, eventDetails, contactDetails, priceDetails, paymentMethod, userId } = body;

    if (!userId) {
      return NextResponse.json({ success: false, message: "User ID is required" }, { status: 400 });
    }

    // 1. Create Order on Razorpay
    const options = {
      amount: Math.round(priceDetails.total * 100), // Amount in paise
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
      payment_capture: 1,
    };

    let razorpayOrder = null;

    // Only create Razorpay order if method is ONLINE
    if (paymentMethod === "ONLINE") {
      razorpayOrder = await razorpay.orders.create(options);
    }

    // 2. Save Order to Database
    const newOrder = await Order.create({
      userId: userId,
      user: contactDetails,
      event: {
        name: eventDetails.eventName,
        type: eventDetails.eventType,
        date: eventDetails.eventDate,
        guests: eventDetails.guestCount,
        specialRequests: eventDetails.specialRequests,
      },
      items: items.map((item) => ({
        id: item.id || item._id, // Ensure ID is passed
        name: item.name,
        price: item.price,
        originalPrice: item.originalPrice,
        image: item.image,
        date: item.date,
        vendorId: item.vendorId,
        addons: item.addons,
      })),
      pricing: {
        subtotal: priceDetails.subtotal,
        tax: priceDetails.taxes,
        platformFee: priceDetails.platformFee,
        discount: priceDetails.vendorDiscount + priceDetails.couponDiscount,
        total: priceDetails.total,
      },
      paymentMethod: paymentMethod,
      razorpay: {
        orderId: razorpayOrder ? razorpayOrder.id : null,
        paymentId: "pending",
        signature: "pending",
      },
      paymentStatus: "PENDING",
    });

    return NextResponse.json({
      success: true,
      orderId: newOrder._id,
      razorpayOrderId: razorpayOrder ? razorpayOrder.id : null,
      amount: options.amount,
      currency: options.currency,
      key: process.env.RAZORPAY_LIVE_KEY_ID,
    });
  } catch (error) {
    console.error("Order Creation Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { orderId, razorpayPaymentId, razorpayOrderId, razorpaySignature } = body;

    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_LIVE_KEY_SECRET)
      .update(razorpayOrderId + "|" + razorpayPaymentId)
      .digest("hex");

    if (generated_signature === razorpaySignature) {
      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        {
          paymentStatus: "PAID",
          orderStatus: "CONFIRMED",
          "razorpay.paymentId": razorpayPaymentId,
          "razorpay.signature": razorpaySignature,
        },
        { new: true }
      );
      return NextResponse.json({ success: true, order: updatedOrder });
    } else {
      return NextResponse.json({ success: false, message: "Invalid Signature" }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    // If userId is provided, fetch just those orders natively
    if (userId) {
      const orders = await Order.find({ userId }).sort({ createdAt: -1 });
      return NextResponse.json({ success: true, data: orders });
    }

    // Otherwise fetch all orders (admin view)
    const allOrders = await Order.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: allOrders });

  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
