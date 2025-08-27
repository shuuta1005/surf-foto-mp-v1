// app/api/checkout/route.ts

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil",
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Dynamically detect origin from headers
    const origin =
      req.headers.get("origin") ?? "https://www.surfphotosjapan.com";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: body.items,
      success_url: `${origin}/payment-success`,
      cancel_url: `${origin}/cart`,
      metadata: {
        userId: body.userId,
        orderId: body.orderId,
      },
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json(
      { error: "Failed to create Stripe session" },
      { status: 500 }
    );
  }
}
