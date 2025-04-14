"use client";

import { useCart } from "@/lib/hooks/useCart";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import Link from "next/link";

export default function CartPage() {
  const { items, removeFromCart, getTotalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto mt-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Your Cart is Empty 🫤</h1>
        <Link href="/" className="text-blue-500 hover:underline">
          ← Go find some surf photos
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

      <div className="space-y-6">
        {items.map((item) => (
          <div
            key={item.photoId}
            className="flex items-center gap-4 border-b pb-4"
          >
            <div className="relative w-32 h-20">
              <Image
                src={item.photoUrl}
                alt={"Surf Photo"}
                fill
                className="object-cover rounded-md shadow-sm"
              />
            </div>

            <div className="flex-1">
              <p className="font-semibold">{"Untitled Photo"}</p>
              <p className="text-sm text-gray-500">{item.photoId}</p>
            </div>

            <div className="flex items-center gap-4">
              <p className="font-semibold">¥{item.price}</p>
              <Button
                variant="ghost"
                onClick={() => removeFromCart(item.photoId)}
                className="text-red-500 hover:bg-red-100"
              >
                <Trash2 size={18} />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Total + Checkout */}
      <div className="flex justify-between items-center mt-10 border-t pt-6">
        <p className="text-lg font-bold">
          Total: ¥{getTotalPrice().toLocaleString()}
        </p>
        <Button className="px-6 py-2 text-lg font-semibold">
          Proceed to Checkout
        </Button>
      </div>
    </div>
  );
}
