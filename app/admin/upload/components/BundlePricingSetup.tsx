//app/admin/upload/components/BundlePricingSetup.tsx
"use client";
import React, { useState, useEffect } from "react";
import { PricingTier } from "@/types/pricing";

interface BundlePricingSetupProps {
  tiers: PricingTier[];
  setTiers: React.Dispatch<React.SetStateAction<PricingTier[]>>;
  basePrice: number;
}

const BUNDLE_SIZES = [2, 3, 4, 5];
const MIN_DISCOUNT = 0.05; // 5%
const MAX_DISCOUNT = 0.5; // 50%

// Auto-suggest discount rates for each bundle size
const SUGGESTED_DISCOUNTS = {
  2: 0.1, // 10% off
  3: 0.15, // 15% off
  4: 0.2, // 20% off
  5: 0.25, // 25% off
};

export default function BundlePricingSetup({
  tiers,
  setTiers,
  basePrice,
}: BundlePricingSetupProps) {
  const [activeBundles, setActiveBundles] = useState<Set<number>>(new Set());
  const [prices, setPrices] = useState<Record<number, number>>({});
  const [errors, setErrors] = useState<Record<number, string>>({});

  // Initialize from existing tiers
  useEffect(() => {
    const active = new Set(tiers.map((t) => t.quantity));
    const priceMap: Record<number, number> = {};
    tiers.forEach((t) => {
      priceMap[t.quantity] = t.price;
    });
    setActiveBundles(active);
    setPrices(priceMap);
  }, [tiers]);

  // Auto-fill suggested price when toggling a bundle on
  const toggleBundle = (quantity: number) => {
    const newActive = new Set(activeBundles);
    const newPrices = { ...prices };
    const newErrors = { ...errors };

    if (newActive.has(quantity)) {
      // Remove bundle
      newActive.delete(quantity);
      delete newPrices[quantity];
      delete newErrors[quantity];
    } else {
      // Add bundle with suggested price
      newActive.add(quantity);
      const suggestedPrice = Math.floor(
        basePrice *
          quantity *
          (1 -
            SUGGESTED_DISCOUNTS[quantity as keyof typeof SUGGESTED_DISCOUNTS])
      );
      newPrices[quantity] = suggestedPrice;
      delete newErrors[quantity]; // Clear any previous errors
    }

    setActiveBundles(newActive);
    setPrices(newPrices);
    setErrors(newErrors);
    updateTiers(newActive, newPrices);
  };

  const updatePrice = (quantity: number, price: number) => {
    const newPrices = { ...prices, [quantity]: price };
    setPrices(newPrices);

    // Validate immediately
    const error = validatePrice(quantity, price);
    const newErrors = { ...errors };
    if (error) {
      newErrors[quantity] = error;
    } else {
      delete newErrors[quantity];
    }
    setErrors(newErrors);

    updateTiers(activeBundles, newPrices);
  };

  const validatePrice = (quantity: number, price: number): string | null => {
    if (!basePrice || basePrice <= 0) return null;
    if (!price || price <= 0) return "Price must be greater than 0";

    const fullPrice = basePrice * quantity;
    const minPrice = Math.ceil(fullPrice * (1 - MAX_DISCOUNT));
    const maxPrice = Math.floor(fullPrice * (1 - MIN_DISCOUNT));

    // Rule 1: Must be cheaper than buying individually
    if (price >= fullPrice) {
      return `Must be less than ¥${fullPrice.toLocaleString()} (individual price)`;
    }

    // Rule 2: Minimum discount
    if (price > maxPrice) {
      return `Must be ≤ ¥${maxPrice.toLocaleString()} (min ${
        MIN_DISCOUNT * 100
      }% discount)`;
    }

    // Rule 3: Maximum discount
    if (price < minPrice) {
      return `Must be ≥ ¥${minPrice.toLocaleString()} (max ${
        MAX_DISCOUNT * 100
      }% discount)`;
    }

    // Rule 4: Monotonic per-photo pricing
    const perPhoto = price / quantity;
    const activeQuantities = Array.from(activeBundles).sort((a, b) => a - b);

    for (const otherQty of activeQuantities) {
      if (otherQty >= quantity) continue; // Only check smaller bundles
      const otherPrice = prices[otherQty];
      if (!otherPrice) continue;

      const otherPerPhoto = otherPrice / otherQty;
      if (perPhoto > otherPerPhoto + 0.01) {
        // Small epsilon for rounding
        return `Per-photo price (¥${Math.floor(
          perPhoto
        )}) must be ≤ smaller bundles`;
      }
    }

    return null;
  };

  const updateTiers = (
    active: Set<number>,
    priceMap: Record<number, number>
  ) => {
    const newTiers: PricingTier[] = Array.from(active)
      .map((quantity) => ({
        quantity,
        price: priceMap[quantity] || 0,
      }))
      .filter((t) => t.price > 0)
      .sort((a, b) => a.quantity - b.quantity);

    setTiers(newTiers);
  };

  const calculateDiscount = (quantity: number, price: number) => {
    if (!price || !basePrice) return 0;
    const fullPrice = basePrice * quantity;
    return Math.round(((fullPrice - price) / fullPrice) * 100);
  };

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <div className="bg-white p-4 sm:p-6 border rounded-lg shadow-sm space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">
          📦 Bundle Pricing
        </h2>
        <p className="text-xs sm:text-sm text-gray-600">
          Offer discounts for multiple photo purchases
        </p>
      </div>

      {!basePrice || basePrice <= 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4 text-xs sm:text-sm text-yellow-800">
          ⚠️ Please set a base price first to configure bundles
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {BUNDLE_SIZES.map((quantity) => {
            const isActive = activeBundles.has(quantity);
            const price = prices[quantity] || 0;
            const error = errors[quantity];
            const discount = calculateDiscount(quantity, price);
            const perPhoto = price > 0 ? Math.floor(price / quantity) : 0;
            const earnings = Math.floor(price * 0.9);

            return (
              <div
                key={quantity}
                className={`border rounded-lg p-3 sm:p-4 transition-all ${
                  isActive
                    ? "border-blue-300 bg-blue-50"
                    : "border-gray-200 bg-gray-50"
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Checkbox */}
                  <div className="pt-0.5 sm:pt-1 flex-shrink-0">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={() => toggleBundle(quantity)}
                      className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 space-y-2 sm:space-y-3">
                    {/* Title and discount badge */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm sm:text-base text-gray-900">
                          {quantity} Photos Bundle
                        </span>
                        {isActive && discount > 0 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700">
                            {discount}% off
                          </span>
                        )}
                      </div>

                      {/* Price input - responsive sizing */}
                      {isActive && (
                        <div className="flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto">
                          <span className="text-xs sm:text-sm text-gray-600 flex-shrink-0">
                            ¥
                          </span>
                          <input
                            type="number"
                            value={price}
                            onChange={(e) =>
                              updatePrice(quantity, Number(e.target.value))
                            }
                            className={`flex-1 sm:flex-none w-full sm:w-28 px-2 sm:px-3 py-1.5 sm:py-2 border rounded-lg text-right font-medium text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                              error
                                ? "border-red-300 bg-red-50"
                                : "border-gray-300"
                            }`}
                            step={100}
                            min={0}
                          />
                        </div>
                      )}
                    </div>

                    {isActive && (
                      <>
                        {/* Error message */}
                        {error && (
                          <div className="text-xs sm:text-sm text-red-600 bg-red-50 border border-red-200 rounded px-2 sm:px-3 py-1.5 sm:py-2">
                            {error}
                          </div>
                        )}

                        {/* Price breakdown - stacked on mobile */}
                        {!error && price > 0 && (
                          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                            <div>
                              <span className="text-gray-500">Per photo:</span>{" "}
                              <span className="font-medium text-gray-900">
                                ¥{perPhoto.toLocaleString()}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">You earn:</span>{" "}
                              <span className="font-medium text-green-600">
                                ¥{earnings.toLocaleString()}
                              </span>
                            </div>
                            <div className="text-gray-400">
                              (vs. ¥{(basePrice * quantity).toLocaleString()}{" "}
                              individually)
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Summary */}
      {activeBundles.size > 0 && (
        <div
          className={`rounded-lg p-3 sm:p-4 ${
            hasErrors
              ? "bg-red-50 border border-red-200"
              : "bg-green-50 border border-green-200"
          }`}
        >
          <div className="flex items-center gap-2">
            {hasErrors ? (
              <>
                <span className="text-red-600 flex-shrink-0">⚠️</span>
                <span className="text-xs sm:text-sm font-medium text-red-900">
                  Please fix the errors above before uploading
                </span>
              </>
            ) : (
              <>
                <span className="text-green-600 flex-shrink-0">✓</span>
                <span className="text-xs sm:text-sm font-medium text-green-900">
                  {activeBundles.size} bundle
                  {activeBundles.size !== 1 ? "s" : ""} configured
                </span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
