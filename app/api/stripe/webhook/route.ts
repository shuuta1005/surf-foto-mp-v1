// app/api/stripe/webhook/route.ts

import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/db";

export const runtime = "nodejs"; // ✅ Must be nodejs to access raw body

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json(
      { error: "Missing Stripe signature" },
      { status: 400 }
    );
  }

  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
    console.log("✅ Webhook verified:", event.type);
  } catch {
    console.error("❌ Invalid signature");
    return NextResponse.json(
      { error: "Invalid Stripe signature" },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    const cartItems = JSON.parse(session.metadata?.cart || "[]");

    if (!userId || cartItems.length === 0) {
      console.error("❌ Missing metadata");
      return NextResponse.json(
        { error: "Missing userId or cart" },
        { status: 400 }
      );
    }

    try {
      await Promise.all(
        cartItems.map((item: { photoId: string }) =>
          prisma.purchase.create({
            data: {
              userId,
              photoId: item.photoId,
            },
          })
        )
      );
      console.log("✅ Purchase records created");
    } catch (err) {
      console.error("❌ DB error:", err);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
