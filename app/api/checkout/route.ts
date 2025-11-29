// //app/api/checkout/route.ts

// import { CartItem } from "@/types/cart";
// import { NextResponse } from "next/server";
// import Stripe from "stripe";
// import { getDiscountedTotal } from "@/features/cart/cart-utils";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: "2025-07-30.basil",
// });

// type CheckoutRequest = {
//   userId: string;
//   orderId: string;
//   items: CartItem[];
//   userEmail?: string;
// };

// export async function POST(req: Request) {
//   try {
//     const body: CheckoutRequest = await req.json();
//     console.log("Received checkout request:", JSON.stringify(body, null, 2));

//     if (!body.items || body.items.length === 0) {
//       return NextResponse.json({ error: "No items in cart" }, { status: 400 });
//     }

//     // Calculate discounted total for bulk purchase
//     const photoCount = body.items.length;
//     const discountedTotal = getDiscountedTotal(photoCount); // 👈 USING getDiscountedTotal HERE
//     const originalTotal = photoCount * 1000;

//     console.log(`📊 Pricing calculation:`);
//     console.log(`  - Photo count: ${photoCount}`);
//     console.log(`  - Original total: ¥${originalTotal}`);
//     console.log(`  - Discounted total: ¥${discountedTotal}`);
//     console.log(`  - Discount applied: ¥${originalTotal - discountedTotal}`);

//     // Create ONE line item for the entire bundle with discounted price
//     const lineItems = [
//       {
//         price_data: {
//           currency: "jpy",
//           product_data: {
//             name:
//               photoCount === 1
//                 ? `Photo Bundle (1 photo)`
//                 : `Photo Bundle (${photoCount} photos)`,
//             description:
//               photoCount > 1
//                 ? `${photoCount} high-quality photos with bulk discount applied (Save ¥${
//                     originalTotal - discountedTotal
//                   })`
//                 : `1 high-quality photo`,
//             images: body.items.slice(0, 1).map((item) => item.photoUrl),
//           },
//           unit_amount: discountedTotal, // 👈 USING discountedTotal HERE (from getDiscountedTotal)
//         },
//         quantity: 1,
//       },
//     ];

//     console.log(`💰 Stripe line item amount: ¥${discountedTotal}`);

//     // Create minimal cart data for metadata (only photoIds to stay under 500 char limit)
//     const photoIds = body.items.map((item) => item.photoId);

//     const sessionConfig: Stripe.Checkout.SessionCreateParams = {
//       mode: "payment",
//       line_items: lineItems,
//       success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-success`,
//       cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
//       metadata: {
//         userId: body.userId || "guest",
//         orderId: body.orderId,
//         photoIds: JSON.stringify(photoIds),
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

//app/api/checkout/route.ts

import { CartItem } from "@/types/cart";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import {
  calculateCartPricing,
  GalleryPricingData,
} from "@/lib/pricing-calculator";

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

    // Group items by gallery
    const itemsByGallery = new Map<string, CartItem[]>();
    body.items.forEach((item) => {
      if (!itemsByGallery.has(item.galleryId)) {
        itemsByGallery.set(item.galleryId, []);
      }
      itemsByGallery.get(item.galleryId)!.push(item);
    });

    // Calculate pricing for each gallery
    const galleryData = new Map<string, GalleryPricingData>();

    for (const [galleryId, galleryItems] of itemsByGallery) {
      const firstItem = galleryItems[0];
      galleryData.set(galleryId, {
        items: galleryItems,
        basePrice: firstItem.galleryBasePrice,
        tiers: firstItem.galleryTiers || [],
      });
    }

    const { galleryPricing, grandTotal, totalSavings } =
      calculateCartPricing(galleryData);

    console.log(`📊 Pricing calculation:`);
    console.log(`  - Total photos: ${body.items.length}`);
    console.log(`  - Galleries: ${itemsByGallery.size}`);
    console.log(`  - Grand total: ¥${grandTotal}`);
    console.log(`  - Total savings: ¥${totalSavings}`);

    // Create line items per gallery
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    for (const [galleryId, galleryItems] of itemsByGallery) {
      const pricing = galleryPricing.get(galleryId);
      const galleryName = galleryItems[0]?.galleryName || "Unknown Gallery";
      const photoCount = galleryItems.length;

      if (!pricing) continue;

      // Create description from breakdown
      const breakdownText = pricing.breakdown
        .map((b) => `${b.quantity > 1 ? `${b.quantity}× ` : ""}${b.type}`)
        .join(", ");

      lineItems.push({
        price_data: {
          currency: "jpy",
          product_data: {
            name: `${galleryName} (${photoCount} photo${
              photoCount !== 1 ? "s" : ""
            })`,
            description:
              pricing.savings > 0
                ? `${breakdownText} • Save ¥${pricing.savings}`
                : breakdownText,
            images: galleryItems.slice(0, 1).map((item) => item.photoUrl),
          },
          unit_amount: pricing.totalPrice,
        },
        quantity: 1,
      });
    }

    console.log(`💰 Stripe line items:`, lineItems.length);

    // Create minimal cart data for metadata
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
