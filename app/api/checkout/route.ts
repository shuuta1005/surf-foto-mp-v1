//app/api/checkout/route.ts

// import { CartItem } from "@/types/cart";
// import { NextResponse } from "next/server";
// import Stripe from "stripe";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: "2025-07-30.basil",
// });

// type CheckoutRequest = {
//   userId: string;
//   orderId: string;
//   items: CartItem[];
//   userEmail?: string; // Add email to the request type
// };

// export async function POST(req: Request) {
//   try {
//     const body: CheckoutRequest = await req.json();
//     console.log("Received checkout request:", JSON.stringify(body, null, 2));

//     // Handle the cart structure your frontend is sending
//     if (!body.items || body.items.length === 0) {
//       return NextResponse.json({ error: "No items in cart" }, { status: 400 });
//     }

//     // Create line items using the price from your cart items
//     const lineItems = body.items.map((item: CartItem) => ({
//       price_data: {
//         currency: "jpy", // Changed to Japanese Yen
//         product_data: {
//           name: `Photo ${item.photoId}`,
//           description: item.location ? `Taken at ${item.location}` : undefined,
//           images: [item.photoUrl],
//         },
//         unit_amount: Math.round(item.price), // JPY doesn't use decimals, so no *100
//       },
//       quantity: 1,
//     }));

//     // Create minimal cart data for metadata (only photoIds to stay under 500 char limit)
//     const photoIds = body.items.map((item) => item.photoId);

//     // Create checkout session with email prefilled
//     const sessionConfig: Stripe.Checkout.SessionCreateParams = {
//       mode: "payment",
//       line_items: lineItems,
//       success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-success`,
//       cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
//       metadata: {
//         userId: body.userId || "guest",
//         orderId: body.orderId,
//         photoIds: JSON.stringify(photoIds), // Only store photoIds, much shorter
//       },
//     };

//     // If user email is provided, prefill it
//     if (body.userEmail) {
//       sessionConfig.customer_email = body.userEmail;
//     }

//     const session = await stripe.checkout.sessions.create(sessionConfig);

//     return NextResponse.json({ url: session.url });
//   } catch (error) {
//     console.error("Stripe Checkout Error:", error);
//     return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
//   }
// }

import { CartItem } from "@/types/cart";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getDiscountedTotal } from "@/features/cart/cart-utils";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil",
});

type CheckoutRequest = {
  userId: string;
  orderId: string;
  items: CartItem[];
  userEmail?: string;
};

export async function POST(req: Request) {
  try {
    const body: CheckoutRequest = await req.json();
    console.log("Received checkout request:", JSON.stringify(body, null, 2));

    if (!body.items || body.items.length === 0) {
      return NextResponse.json({ error: "No items in cart" }, { status: 400 });
    }

    // Calculate discounted total for bulk purchase
    const photoCount = body.items.length;
    const discountedTotal = getDiscountedTotal(photoCount); // 👈 USING getDiscountedTotal HERE
    const originalTotal = photoCount * 1000;

    console.log(`📊 Pricing calculation:`);
    console.log(`  - Photo count: ${photoCount}`);
    console.log(`  - Original total: ¥${originalTotal}`);
    console.log(`  - Discounted total: ¥${discountedTotal}`);
    console.log(`  - Discount applied: ¥${originalTotal - discountedTotal}`);

    // Create ONE line item for the entire bundle with discounted price
    const lineItems = [
      {
        price_data: {
          currency: "jpy",
          product_data: {
            name:
              photoCount === 1
                ? `Photo Bundle (1 photo)`
                : `Photo Bundle (${photoCount} photos)`,
            description:
              photoCount > 1
                ? `${photoCount} high-quality photos with bulk discount applied (Save ¥${
                    originalTotal - discountedTotal
                  })`
                : `1 high-quality photo`,
            images: body.items.slice(0, 1).map((item) => item.photoUrl),
          },
          unit_amount: discountedTotal, // 👈 USING discountedTotal HERE (from getDiscountedTotal)
        },
        quantity: 1,
      },
    ];

    console.log(`💰 Stripe line item amount: ¥${discountedTotal}`);

    // Create minimal cart data for metadata (only photoIds to stay under 500 char limit)
    const photoIds = body.items.map((item) => item.photoId);

    const sessionConfig: Stripe.Checkout.SessionCreateParams = {
      mode: "payment",
      line_items: lineItems,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
      metadata: {
        userId: body.userId || "guest",
        orderId: body.orderId,
        photoIds: JSON.stringify(photoIds),
      },
    };

    // If user email is provided, prefill it
    if (body.userEmail) {
      sessionConfig.customer_email = body.userEmail;
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe Checkout Error:", error);
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}
