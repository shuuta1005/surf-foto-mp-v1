// app/api/stripe/webhook/route.ts

import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/db";

export const runtime = "nodejs"; // 🧠 Required to access raw body in App Router

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    console.error("❌ Missing Stripe signature");
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
    console.log("✅ Webhook verified:", event.type);
  } catch (err) {
    console.error("❌ Invalid Stripe signature", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    const cart = session.metadata?.cart;

    if (!userId || !cart) {
      console.error("❌ Missing metadata");
      return NextResponse.json(
        { error: "Missing userId or cart" },
        { status: 400 }
      );
    }

    const cartItems: { photoId: string }[] = JSON.parse(cart);

    try {
      await Promise.all(
        cartItems.map((item) =>
          prisma.purchase.create({
            data: {
              userId,
              photoId: item.photoId,
            },
          })
        )
      );
      console.log("✅ Purchases saved");
    } catch (err) {
      console.error("❌ Failed to save purchases:", err);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
