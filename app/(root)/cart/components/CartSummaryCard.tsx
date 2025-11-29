// app/(root)/cart/components/CartSummaryCard.tsx

"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useCart } from "@/features/cart/CartContext";

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
  const {
    getOriginalPrice,
    getDiscount,
    getTotal,
    getGalleryPricing,
    getItemsByGallery,
  } = useCart();

  const basePrice = getOriginalPrice();
  const discount = getDiscount();
  const finalPrice = getTotal();
  const galleryPricing = getGalleryPricing();
  const itemsByGallery = getItemsByGallery();

  return (
    <Card className="bg-stone-100 border w-full md:w-80 shadow-lg">
      <CardContent className="p-4 flex flex-col gap-4 text-sm">
        {/* Gallery-by-Gallery Breakdown */}
        {itemsByGallery.size > 1 && (
          <div className="space-y-2 pb-3 border-b border-gray-300">
            <p className="font-semibold text-gray-700">Pricing by Gallery:</p>
            {Array.from(itemsByGallery.entries()).map(
              ([galleryId, galleryItems]) => {
                const pricing = galleryPricing.get(galleryId);
                const galleryName =
                  galleryItems[0]?.galleryName || "Unknown Gallery";

                return (
                  <div key={galleryId} className="text-xs space-y-1">
                    <p className="font-medium text-gray-800">{galleryName}</p>
                    <p className="text-gray-600 pl-2">
                      {galleryItems.length} photo
                      {galleryItems.length !== 1 ? "s" : ""} →{" "}
                      {formatYen(pricing?.totalPrice || 0)}
                    </p>
                    {pricing && pricing.savings > 0 && (
                      <p className="text-green-600 text-xs pl-2">
                        Saved {formatYen(pricing.savings)}
                      </p>
                    )}
                    {pricing && pricing.breakdown.length > 0 && (
                      <div className="pl-2 text-xs text-gray-500">
                        {pricing.breakdown.map((item, idx) => (
                          <p key={idx}>
                            {item.quantity > 1 ? `${item.quantity} × ` : ""}
                            {item.type}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }
            )}
          </div>
        )}

        {/* Total Summary */}
        <div className="space-y-1">
          <div className="flex justify-between">
            <span>Base Total</span>
            <span>{formatYen(basePrice)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Bundle Discount</span>
              <span>-{formatYen(discount)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t border-gray-300">
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

        {discount > 0 && (
          <div className="mt-4 text-xs text-green-700 bg-green-50 border border-green-200 rounded p-2 text-center">
            🎉 You&apos;re saving {formatYen(discount)} with bundle pricing!
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CartSummaryCard;
