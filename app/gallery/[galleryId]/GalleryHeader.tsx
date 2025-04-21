"use client";

import Link from "next/link";
import { useCart } from "@/lib/context/CartContext";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";

export default function GalleryHeader({
  name,
  location,
}: {
  name: string;
  location?: string;
}) {
  const { items } = useCart();
  const router = useRouter();

  return (
    <header className="w-full bg-stone-100 border-b shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="text-4xl font-extrabold text-gray-700 hover:text-black hover:bg-gray-200 transition rounded px-3 py-1"
        >
          ←
        </Button>

        {/* Title */}
        <div className="text-center flex-1">
          <h1 className="text-4xl sm:text-4xl font-bold text-gray-900 leading-tight mb-3">
            {name}
          </h1>
          <p className="text-3xl text-gray-600">{location || "Unknown Spot"}</p>
        </div>

        {/* Cart */}

        <Link href="/cart" className="relative">
          <Button
            variant="ghost"
            className="relative p-0 flex items-center justify-center"
          >
            <ShoppingCart
              size={40}
              strokeWidth={1.5}
              style={{ minWidth: "40px", minHeight: "40px" }}
            />
            {items.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-sm px-2 py-0.5 rounded-full font-bold">
                {items.length}
              </span>
            )}
          </Button>
        </Link>
      </div>
    </header>
  );
}
