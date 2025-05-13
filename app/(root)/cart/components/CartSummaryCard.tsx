"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useCart } from "@/lib/context/CartContext";

const formatYen = (price: number) => `¥${price.toLocaleString("ja-JP")}`;

interface Props {
  isSignedIn: boolean;
  agreed: boolean;
  setAgreed: (value: boolean) => void;
  isLoading: boolean;
  onCheckout: () => void;
}

const CartSummaryCard = ({
  isSignedIn,
  agreed,
  setAgreed,
  isLoading,
  onCheckout,
}: Props) => {
  const { getOriginalPrice, getDiscount, getTotal } = useCart();

  const basePrice = getOriginalPrice();
  const discount = getDiscount();
  const finalPrice = getTotal();

  return (
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

        {/* Checkbox for Terms */}
        <div className="flex items-start gap-2 text-xs mt-4">
          <Checkbox
            id="agree"
            checked={agreed}
            onCheckedChange={(checked) => setAgreed(!!checked)}
          />
          <label htmlFor="agree" className="leading-snug text-gray-700">
            I agree to the{" "}
            <Link href="/terms" className="text-blue-600 hover:underline">
              Terms and Conditions
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-blue-600 hover:underline">
              Privacy Policy
            </Link>
            .
          </label>
        </div>

        {!isSignedIn && (
          <p className="text-xs text-red-500 mt-1">
            You must{" "}
            <Link href="/sign-in" className="underline">
              sign in
            </Link>{" "}
            to checkout.
          </p>
        )}

        {(!isSignedIn || !agreed) && (
          <p className="text-xs text-gray-500 text-center">
            Please sign in and agree to the terms before proceeding.
          </p>
        )}

        <Button
          className="w-full mt-2"
          disabled={!isSignedIn || !agreed || isLoading}
          onClick={onCheckout}
        >
          {isLoading ? "Processing..." : "Go To Checkout"}
        </Button>

        <div className="mt-4 text-xs text-gray-600 border-t pt-3 leading-relaxed">
          <p className="font-semibold">Chuck our pricing logic here</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CartSummaryCard;
