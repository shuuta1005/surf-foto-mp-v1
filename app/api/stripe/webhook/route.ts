// app/api/stripe/webhook/route.ts

// import { NextResponse } from "next/server";
// import Stripe from "stripe";
// import { prisma } from "@/lib/db";

// export const runtime = "nodejs";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: "2025-07-30.basil",
// });

// const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// export async function POST(req: Request) {
//   const sig = req.headers.get("stripe-signature");
//   if (!sig) {
//     console.error("❌ Missing Stripe signature");
//     return NextResponse.json({ error: "Missing signature" }, { status: 400 });
//   }

//   const rawBody = await req.text();

//   let event: Stripe.Event;
//   try {
//     event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
//     console.log("✅ Webhook verified:", event.type);
//   } catch (err) {
//     console.error("❌ Invalid Stripe signature", err);
//     return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
//   }

//   switch (event.type) {
//     case "checkout.session.completed": {
//       const session = event.data.object as Stripe.Checkout.Session;
//       const metadata = session.metadata;
//       const paymentIntentId = session.payment_intent as string;

//       console.log("📦 Metadata received:", metadata);
//       console.log("💳 PaymentIntent ID:", paymentIntentId);

//       if (!metadata?.userId || !metadata?.cart || !paymentIntentId) {
//         console.error("❌ Missing metadata or paymentIntentId");
//         return NextResponse.json({ error: "Missing data" }, { status: 400 });
//       }

//       let cartItems: { photoId: string; location?: string }[] = [];

//       try {
//         cartItems = JSON.parse(metadata.cart);
//         console.log("🛒 Parsed cart items:", cartItems);
//       } catch (err) {
//         console.error("❌ Failed to parse cart metadata:", metadata.cart, err);
//         return NextResponse.json(
//           { error: "Invalid cart metadata" },
//           { status: 400 }
//         );
//       }

//       try {
//         await Promise.all(
//           cartItems.map(async (item) => {
//             if (!item.photoId || typeof item.photoId !== "string") {
//               console.warn("⚠️ Skipping invalid photoId:", item.photoId);
//               return;
//             }

//             try {
//               await prisma.purchase.create({
//                 data: {
//                   userId: metadata.userId,
//                   photoId: item.photoId,
//                   paymentIntentId,
//                   refunded: false,
//                 },
//               });
//               console.log(`✅ Saved purchase for photoId: ${item.photoId}`);
//             } catch (err) {
//               console.error(
//                 `❌ Failed to save purchase for photoId: ${item.photoId}`,
//                 err
//               );
//             }
//           })
//         );
//       } catch (err) {
//         console.error("❌ Unexpected error during purchase saving:", err);
//         return NextResponse.json({ error: "Database error" }, { status: 500 });
//       }

//       break;
//     }

//     case "payment_intent.payment_failed": {
//       const intent = event.data.object as Stripe.PaymentIntent;
//       const email = intent.receipt_email || "unknown";
//       console.warn(
//         `❌ Payment failed for intent ${intent.id}, email: ${email}`
//       );
//       break;
//     }

//     case "charge.refunded": {
//       const charge = event.data.object as Stripe.Charge;
//       const intentId = charge.payment_intent as string;

//       console.log(`💸 Refund received for payment intent: ${intentId}`);

//       try {
//         await prisma.purchase.updateMany({
//           where: { paymentIntentId: intentId },
//           data: { refunded: true },
//         });
//         console.log("✅ Marked purchases as refunded");
//       } catch (err) {
//         console.error("❌ Failed to mark refunded purchases:", err);
//       }

//       break;
//     }

//     default:
//       console.log(`ℹ️ Unhandled event type: ${event.type}`);
//   }

//   return NextResponse.json({ received: true });
// }

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
      const metadata = session.metadata;
      const paymentIntentId = session.payment_intent as string;

      // 🐛 ENHANCED DEBUG: Let's see exactly what we're receiving
      console.log("=== WEBHOOK DEBUG START ===");
      console.log("📦 Raw metadata:", JSON.stringify(metadata, null, 2));
      console.log("💳 PaymentIntent ID:", paymentIntentId);
      console.log("🔍 Available metadata keys:", Object.keys(metadata || {}));
      console.log("🛒 Raw cart data:", metadata?.cart);
      console.log("👤 User ID:", metadata?.userId);
      console.log("📋 Order ID:", metadata?.orderId);

      // Check if cart data looks like JSON
      if (metadata?.cart) {
        console.log("🔍 Cart data type:", typeof metadata.cart);
        console.log("🔍 Cart data length:", metadata.cart.length);
        console.log("🔍 First 100 chars:", metadata.cart.substring(0, 100));
      }
      console.log("=== WEBHOOK DEBUG END ===");

      if (!metadata?.userId || !metadata?.cart || !paymentIntentId) {
        console.error("❌ Missing required data:");
        console.error("  - Missing userId:", !metadata?.userId);
        console.error("  - Missing cart:", !metadata?.cart);
        console.error("  - Missing paymentIntentId:", !paymentIntentId);
        return NextResponse.json({ error: "Missing data" }, { status: 400 });
      }

      let cartItems: { photoId: string; location?: string }[] = [];

      try {
        cartItems = JSON.parse(metadata.cart);
        console.log(
          "🛒 Successfully parsed cart items:",
          cartItems.length,
          "items"
        );

        // Debug each item structure
        cartItems.forEach((item, index) => {
          console.log(`📷 Item ${index + 1}:`, {
            photoId: item.photoId,
            hasPhotoId: !!item.photoId,
            photoIdType: typeof item.photoId,
            location: item.location,
            allKeys: Object.keys(item),
          });
        });
      } catch (err) {
        console.error("❌ Failed to parse cart metadata:");
        console.error("  - Raw cart data:", metadata.cart);
        console.error("  - Parse error:", err);
        return NextResponse.json(
          { error: "Invalid cart metadata" },
          { status: 400 }
        );
      }

      // Database operations with enhanced error handling
      try {
        console.log(`📝 Attempting to save ${cartItems.length} purchases...`);

        const results = await Promise.allSettled(
          cartItems.map(async (item, index) => {
            console.log(`💾 Processing item ${index + 1}: ${item.photoId}`);

            if (!item.photoId || typeof item.photoId !== "string") {
              console.warn(
                `⚠️ Skipping invalid photoId at index ${index}:`,
                item.photoId
              );
              return { success: false, reason: "Invalid photoId" };
            }

            try {
              const purchase = await prisma.purchase.create({
                data: {
                  userId: metadata.userId!,
                  photoId: item.photoId,
                  paymentIntentId,
                  refunded: false,
                },
              });
              console.log(
                `✅ Successfully saved purchase for photoId: ${item.photoId}`,
                {
                  id: purchase.id,
                  createdAt: purchase.createdAt,
                }
              );
              return { success: true, purchaseId: purchase.id };
            } catch (err) {
              console.error(
                `❌ Database error for photoId ${item.photoId}:`,
                err
              );
              return { success: false, error: err, photoId: item.photoId };
            }
          })
        );

        // Summary of results
        const successful = results.filter(
          (r) => r.status === "fulfilled" && r.value.success
        ).length;
        const failed = results.length - successful;

        console.log(
          `📊 Purchase creation summary: ${successful} successful, ${failed} failed`
        );

        if (failed > 0) {
          console.error("❌ Some purchases failed:");
          results.forEach((result, index) => {
            if (result.status === "rejected" || !result.value.success) {
              console.error(`  - Item ${index + 1}:`, result);
            }
          });
        }
      } catch (err) {
        console.error("❌ Unexpected error during purchase saving:", err);
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
        const result = await prisma.purchase.updateMany({
          where: { paymentIntentId: intentId },
          data: { refunded: true },
        });
        console.log(`✅ Marked ${result.count} purchases as refunded`);
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
