// components/shared/header/CartButton.tsx
"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/features/cart/CartContext";

const CartButton = () => {
  const { items } = useCart();

  return (
    <Link
      href="/cart"
      className="relative text-gray-600 hover:text-black transition"
    >
      <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
      {items.length > 0 && (
        <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs font-bold rounded-full px-1.5">
          {items.length}
        </span>
      )}
    </Link>
  );
};

export default CartButton;
