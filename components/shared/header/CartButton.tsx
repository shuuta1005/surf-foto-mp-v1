// components/shared/header/CartButton.tsx
"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/context/CartContext";

const CartButton = () => {
  const { items } = useCart();

  return (
    <Link
      href="/cart"
      className="relative text-gray-600 hover:text-black transition"
    >
      <ShoppingCart size={28} />
      {items.length > 0 && (
        <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs font-bold rounded-full px-1.5">
          {items.length}
        </span>
      )}
    </Link>
  );
};

export default CartButton;
