// app/(root)/cart/components/cart-table.tsx
"use client";

import { useCart } from "@/features/cart/CartContext";
import { useSession } from "next-auth/react";
import { useState } from "react";
import CartItemsTable from "./CartItemsTable";
import CartSummaryCard from "./CartSummaryCard";
import EmptyCartMessage from "./EmptyCartMessage";

const CartTable = () => {
  const { data: session } = useSession();
  const isSignedIn = !!session?.user;

  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { items } = useCart();

  const isEmpty = items.length === 0;

  const handleCheckout = async () => {
    if (!isSignedIn || !agreed) return;
    setIsLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Checkout failed. Please try again.");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Something went wrong during checkout.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="border-b pb-4 mb-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
          🛒 Your Shopping Cart
        </h1>
      </div>

      {isEmpty ? (
        <EmptyCartMessage />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-6">
          <CartItemsTable />
          <CartSummaryCard
            isSignedIn={isSignedIn}
            agreed={agreed}
            setAgreed={setAgreed}
            isLoading={isLoading}
            onCheckout={handleCheckout}
          />
        </div>
      )}
    </div>
  );
};

export default CartTable;
