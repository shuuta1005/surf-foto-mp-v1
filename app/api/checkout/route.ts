// app/api/checkout/route.ts

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { CheckoutSchema, PhotoItem } from "@/lib/validations/checkout/checkout";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil",
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = CheckoutSchema.parse(body);

    const origin =
      req.headers.get("origin") ?? "https://www.surfphotosjapan.com";

    const lineItems = parsed.items.map((item: PhotoItem) => ({
      price_data: {
        currency: "jpy",
        product_data: {
          name: item.name ?? "Surf Photo",
          images: item.photoUrl ? [item.photoUrl] : [],
          metadata: {
            photoId: item.photoId,
          },
        },
        unit_amount: item.price,
      },
      quantity: 1,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
      success_url: `${origin}/payment-success`,
      cancel_url: `${origin}/cart`,
      metadata: {
        userId: parsed.userId,
        orderId: parsed.orderId,
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
