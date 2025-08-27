// app/(root)/cart/components/EmptyCartMessage.tsx

"use client";

import { ShoppingCart } from "lucide-react";
import Link from "next/link";

const EmptyCartMessage = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 text-center text-gray-600 py-20">
      <div className="border rounded-full p-6">
        <ShoppingCart size={64} strokeWidth={1.5} className="text-gray-400" />
      </div>
      <h2 className="text-2xl font-bold text-gray-700">Your cart is empty.</h2>
      <p className="text-sm text-gray-500">
        You can find your surf shots in the{" "}
        <Link href="/galleries" className="text-blue-600 hover:underline">
          BraFotos Gallery
        </Link>
        .
      </p>
    </div>
  );
};

export default EmptyCartMessage;
