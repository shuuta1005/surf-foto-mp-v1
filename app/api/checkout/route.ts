// app/api/checkout/route.ts

import { CartItem } from "@/types/cart";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil",
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Received checkout request:", JSON.stringify(body, null, 2));

    // Handle the cart structure your frontend is sending
    if (!body.items || body.items.length === 0) {
      return NextResponse.json({ error: "No items in cart" }, { status: 400 });
    }

    // Create line items using the price from your cart items
    const lineItems = body.items.map((item: CartItem) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: `Photo ${item.photoId}`,
          description: item.location ? `Taken at ${item.location}` : undefined,
          images: [item.photoUrl],
        },
        unit_amount: Math.round(item.price * 100), // Convert dollars to cents
      },
      quantity: 1,
    }));

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
      metadata: {
        userId: body.userId || "guest",
        orderId: body.orderId,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe Checkout Error:", error);
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}
