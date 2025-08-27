// app/api/checkout/route.ts

import Stripe from "stripe";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import type { CartItem } from "@/types/cart";
import { getDiscountedTotal } from "@/features/cart/cart-utils"; // ✅ import new util

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil",
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const items = body.items as CartItem[];
    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const discountedUnitPrice = getDiscountedTotal(items.length) / items.length;

    const lineItems = items.map((item) => ({
      price_data: {
        currency: "jpy",
        product_data: {
          name: "Surf Foto",
          images: item.photoUrl ? [item.photoUrl] : [],
        },
        unit_amount: Math.round(discountedUnitPrice), // Stripe expects integer
      },
      quantity: 1,
    }));

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
      locale: "en",
      customer_email: session.user.email ?? undefined,
      customer_creation: "always",
      metadata: {
        userId: session.user.id,
        cart: JSON.stringify(
          items.map((item) => ({
            photoId: item.photoId,
            location: item.location,
          }))
        ),
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
