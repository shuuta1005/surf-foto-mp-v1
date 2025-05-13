//app/(root)/cart/cart-table.tsx

"use client";

import { useCart } from "@/lib/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, ShoppingCart } from "lucide-react";

const formatYen = (price: number) => `¥${price.toLocaleString("ja-JP")}`;

const CartTable = () => {
  const { items, removeFromCart, getOriginalPrice, getDiscount, getTotal } =
    useCart();

  const isEmpty = items.length === 0;
  const basePrice = getOriginalPrice();
  const discount = getDiscount();
  const finalPrice = getTotal();

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="border-b pb-4 mb-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
          🛒 Your Shopping Cart
        </h1>
      </div>

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center gap-4 text-center text-gray-600 py-20">
          <div className="border rounded-full p-6">
            <ShoppingCart
              size={64}
              strokeWidth={1.5}
              className="text-gray-400"
            />
          </div>
          <h2 className="text-2xl font-bold text-gray-700">
            Your cart is empty.
          </h2>
          <p className="text-sm text-gray-500">
            You can find your surf shots in the{" "}
            <Link href="/galleries" className="text-blue-600 hover:underline">
              BraFotos Gallery
            </Link>
            .
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-6">
          {/* Cart Items */}
          <div className="overflow-x-auto md:col-span-3">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-black">Photo</TableHead>
                  <TableHead className="text-black">Price</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.photoId}>
                    <TableCell className="w-32 h-20 relative bg-white shadow-sm rounded-md">
                      <Image
                        src={item.photoUrl}
                        alt="Surf Photo"
                        fill
                        className="object-cover rounded-md shadow-sm"
                      />
                    </TableCell>
                    <TableCell className="font-semibold text-sm">
                      {formatYen(item.price)}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFromCart(item.photoId)}
                      >
                        <Trash2 size={18} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* 💰 Summary Section */}
          <Card className="bg-stone-100 border w-full md:w-80 shadow-lg">
            <CardContent className="p-4 flex flex-col gap-4 text-sm">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Base Total</span>
                  <span>{formatYen(basePrice)}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-{formatYen(discount)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg mt-2">
                  <span>Total</span>
                  <span>{formatYen(finalPrice)}</span>
                </div>
              </div>

              <div>
                <Button
                  className="w-full"
                  onClick={async () => {
                    try {
                      const res = await fetch("/api/checkout", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ items }),
                      });

                      const data = await res.json();

                      if (data.url) {
                        window.location.href = data.url;
                      } else {
                        alert("Failed to redirect to checkout.");
                        console.error(data.error || "Unknown error");
                      }
                    } catch (err) {
                      console.error("Checkout error:", err);
                      alert("Something went wrong during checkout.");
                    }
                  }}
                >
                  Go To Checkout
                </Button>
              </div>

              <div className="mt-4 text-xs text-gray-600 border-t pt-3 leading-relaxed">
                <p className="font-semibold">Chuck our pricing logic here</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CartTable;
