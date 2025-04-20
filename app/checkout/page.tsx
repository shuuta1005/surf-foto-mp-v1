"use client";

import { useCart } from "@/lib/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const CheckoutPage = () => {
  const { items, getTotal } = useCart();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      {items.length === 0 ? (
        <div className="text-center text-gray-500">
          Your cart is empty.{" "}
          <Link href="/" className="text-blue-600 underline">
            Go find some waves!
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {items.map((item) => (
            <div
              key={item.photoId}
              className="flex items-center gap-4 border-b pb-4"
            >
              <div className="w-24 h-24 relative">
                <Image
                  src={item.photoUrl}
                  alt="Photo"
                  fill
                  className="object-cover rounded-md"
                />
              </div>
              <div className="flex-1">
                <p className="font-semibold">Photo ID: {item.photoId}</p>
                <p>¥{item.price}</p>
              </div>
            </div>
          ))}

          {/* Summary */}
          <div className="border-t pt-4 text-right">
            <p className="text-lg font-semibold">Total: ¥{getTotal()}</p>
          </div>

          <div className="flex justify-between items-center">
            <Link href="/cart">
              <Button variant="outline">← Back to Cart</Button>
            </Link>
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              Proceed to Payment
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
