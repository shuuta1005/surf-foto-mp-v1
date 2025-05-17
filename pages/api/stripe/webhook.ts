//app/pages/api/stripe/webhook.ts

import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { buffer } from "micro";
import { prisma } from "@/lib/db";

export const config = {
  api: {
    bodyParser: false, // 🚨 Required for Stripe raw body
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).end("Method Not Allowed");
  }

  const sig = req.headers["stripe-signature"];
  if (!sig || Array.isArray(sig)) {
    return res.status(400).send("Missing or invalid signature");
  }

  let event: Stripe.Event;

  try {
    const buf = await buffer(req);
    event = stripe.webhooks.constructEvent(buf.toString(), sig, endpointSecret);
    console.log("✅ Webhook verified:", event.type);
  } catch (err) {
    console.error("❌ Webhook error:", err);
    return res.status(400).send("Webhook Error");
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    const cartItems = JSON.parse(session.metadata?.cart || "[]");

    if (!userId || cartItems.length === 0) {
      console.error("❌ Missing userId or cart in metadata");
      return res.status(400).send("Invalid metadata");
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
      console.log("✅ Purchase records saved for user:", userId);
    } catch (dbErr) {
      console.error("❌ Failed to create purchases:", dbErr);
      return res.status(500).send("Database Error");
    }
  } else {
    console.log(`ℹ️ Unhandled event type: ${event.type}`);
  }

  return res.status(200).send("Received");
}
