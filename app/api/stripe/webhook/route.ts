// app/api/stripe/webhook/route.ts

import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil",
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

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      const cart = session.metadata?.cart;
      const paymentIntentId = session.payment_intent as string;

      if (!userId || !cart || !paymentIntentId) {
        console.error("❌ Missing metadata or paymentIntentId");
        return NextResponse.json({ error: "Missing data" }, { status: 400 });
      }

      const cartItems: { photoId: string }[] = JSON.parse(cart);

      try {
        await Promise.all(
          cartItems.map((item) =>
            prisma.purchase.create({
              data: {
                userId,
                photoId: item.photoId,
                paymentIntentId: paymentIntentId,
                refunded: false,
              },
            })
          )
        );
        console.log("✅ Purchases saved");
      } catch (err) {
        console.error("❌ Failed to save purchases:", err);
        return NextResponse.json({ error: "Database error" }, { status: 500 });
      }

      break;
    }

    case "payment_intent.payment_failed": {
      const intent = event.data.object as Stripe.PaymentIntent;
      const email = intent.receipt_email || "unknown";
      console.warn(
        `❌ Payment failed for intent ${intent.id}, email: ${email}`
      );
      break;
    }

    case "charge.refunded": {
      const charge = event.data.object as Stripe.Charge;
      const intentId = charge.payment_intent as string;

      console.log(`💸 Refund received for payment intent: ${intentId}`);

      try {
        await prisma.purchase.updateMany({
          where: { paymentIntentId: intentId },
          data: { refunded: true },
        });

        console.log("✅ Marked purchases as refunded");
      } catch (err) {
        console.error("❌ Failed to mark refunded purchases:", err);
      }

      break;
    }

    default:
      console.log(`ℹ️ Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
