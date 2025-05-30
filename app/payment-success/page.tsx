"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { useCart } from "@/features/cart/CartContext";

export default function PaymentSuccessPage() {
  const { clearCart } = useCart();
  const [hasCleared, setHasCleared] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && !hasCleared) {
      try {
        clearCart();
        setHasCleared(true); // ✅ avoid repeated calls
      } catch (err) {
        console.error("❌ Failed to clear cart on success page:", err);
      }
    }
  }, [clearCart, hasCleared]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <CheckCircle className="text-green-500 w-16 h-16 mb-4" />
      <h1 className="text-3xl sm:text-4xl font-bold mb-4">
        Payment Successful! 🎉
      </h1>
      <p className="text-gray-600 mb-6 max-w-md">
        Thank you for your purchase. You can now download your photos from the{" "}
        <Link
          href="/purchases"
          className="text-blue-600 underline hover:text-blue-800"
        >
          My Purchased Photos
        </Link>{" "}
        page.
      </p>
      <Link
        href="/purchases"
        className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm font-medium"
      >
        Go to My Purchased Photos
      </Link>
    </div>
  );
}
