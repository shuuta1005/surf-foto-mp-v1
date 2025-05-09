//api/stripe/webhook/route.ts

import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  // 🧾 Get raw body & signature
  const body = await req.text();
  const sig = (await headers()).get("stripe-signature");

  console.log("📦 Raw body received:", body.slice(0, 200));
  console.log("🧾 Signature header:", sig);

  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    console.log("✅ Webhook verified:", event.type);
  } catch (err) {
    console.error("❌ Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // 🧠 Handle checkout session completion
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    console.log("💳 Session metadata:", session.metadata);

    try {
      const userId = session.metadata?.userId;
      const cartItems = JSON.parse(session.metadata?.cart || "[]");

      if (!userId || cartItems.length === 0) {
        console.error("❌ Missing userId or cart items");
        return NextResponse.json(
          { error: "Invalid metadata" },
          { status: 400 }
        );
      }

      // ✅ Create purchase records
      await Promise.all(
        cartItems.map((item: { photoId: string }) => {
          return prisma.purchase.create({
            data: {
              userId,
              photoId: item.photoId,
            },
          });
        })
      );

      console.log("✅ Purchase records created");
    } catch (err) {
      console.error("❌ Error saving purchase:", err);
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
  } else {
    console.log(`ℹ️ Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
