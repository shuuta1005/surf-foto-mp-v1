// app/admin/upload/components/BundlePricingSetup.tsx

"use client";

import React, { useState, useEffect } from "react";
import { PricingTier } from "@/types/pricing";
import {
  ALLOWED_BUNDLE_SIZES,
  AllowedBundleSize,
  validatePricingTier,
  calculateSuggestedPrice,
} from "@/lib/pricing-rules";
import BundleTierCard from "./BundleTierCard";
import BasePriceWarning from "./BasePriceWarning";

interface BundlePricingSetupProps {
  tiers: PricingTier[];
  setTiers: React.Dispatch<React.SetStateAction<PricingTier[]>>;
  basePrice: number;
}

export default function BundlePricingSetup({
  tiers,
  setTiers,
  basePrice,
}: BundlePricingSetupProps) {
  const [activeBundles, setActiveBundles] = useState<Set<AllowedBundleSize>>(
    new Set()
  );
  const [prices, setPrices] = useState<
    Partial<Record<AllowedBundleSize, number>>
  >({});
  const [errors, setErrors] = useState<
    Partial<Record<AllowedBundleSize, string>>
  >({});
  const [showBasePriceWarning, setShowBasePriceWarning] = useState(false);
  const [previousBasePrice, setPreviousBasePrice] = useState(basePrice);

  // Initialize from existing tiers
  useEffect(() => {
    const active = new Set<AllowedBundleSize>();
    const priceMap: Partial<Record<AllowedBundleSize, number>> = {};

    tiers.forEach((t) => {
      if (ALLOWED_BUNDLE_SIZES.includes(t.quantity as AllowedBundleSize)) {
        active.add(t.quantity as AllowedBundleSize);
        priceMap[t.quantity as AllowedBundleSize] = t.price;
      }
    });

    setActiveBundles(active);
    setPrices(priceMap);
  }, [tiers]);

  // Detect base price changes and re-validate
  useEffect(() => {
    if (basePrice !== previousBasePrice && activeBundles.size > 0) {
      const newErrors: Partial<Record<AllowedBundleSize, string>> = {};
      let hasNewErrors = false;

      activeBundles.forEach((quantity) => {
        const price = prices[quantity];
        if (!price) return;

        const otherTiers = Array.from(activeBundles)
          .filter((q) => q !== quantity)
          .map((q) => ({ quantity: q, price: prices[q] || 0 }))
          .filter((t) => t.price > 0);

        const error = validatePricingTier({
          quantity,
          price,
          basePrice,
          existingTiers: otherTiers,
        });

        if (error) {
          newErrors[quantity] = error;
          hasNewErrors = true;
        }
      });

      setErrors(newErrors);

      if (hasNewErrors && previousBasePrice > 0) {
        setShowBasePriceWarning(true);
      }

      setPreviousBasePrice(basePrice);
    }
  }, [basePrice, activeBundles, prices, previousBasePrice]);

  const toggleBundle = (quantity: AllowedBundleSize) => {
    const newActive = new Set(activeBundles);
    const newPrices = { ...prices };
    const newErrors = { ...errors };

    if (newActive.has(quantity)) {
      newActive.delete(quantity);
      delete newPrices[quantity];
      delete newErrors[quantity];
    } else {
      newActive.add(quantity);
      newPrices[quantity] = calculateSuggestedPrice(quantity, basePrice);
      delete newErrors[quantity];
    }

    setActiveBundles(newActive);
    setPrices(newPrices);
    setErrors(newErrors);
    updateTiers(newActive, newPrices);
  };

  const updatePrice = (quantity: AllowedBundleSize, price: number) => {
    const newPrices = { ...prices, [quantity]: price };
    setPrices(newPrices);

    const otherTiers = Array.from(activeBundles)
      .filter((q) => q !== quantity)
      .map((q) => ({ quantity: q, price: newPrices[q] || 0 }))
      .filter((t) => t.price > 0);

    const error = validatePricingTier({
      quantity,
      price,
      basePrice,
      existingTiers: otherTiers,
    });

    const newErrors = { ...errors };
    if (error) {
      newErrors[quantity] = error;
    } else {
      delete newErrors[quantity];
    }
    setErrors(newErrors);

    updateTiers(activeBundles, newPrices);
  };

  const updateTiers = (
    active: Set<AllowedBundleSize>,
    priceMap: Partial<Record<AllowedBundleSize, number>>
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

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <div className="bg-white p-4 sm:p-6 border rounded-lg shadow-sm space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">
          📦 Bundle Pricing
        </h2>
        <p className="text-xs sm:text-sm text-gray-600">
          Offer discounts for multiple photo purchases (2, 3, 4, or 5 photos)
        </p>
      </div>

      {!basePrice || basePrice <= 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4 text-xs sm:text-sm text-yellow-800">
          ⚠️ Please set a base price first to configure bundles
        </div>
      ) : (
        <>
          <BasePriceWarning
            show={showBasePriceWarning && hasErrors}
            oldPrice={previousBasePrice}
            newPrice={basePrice}
            onDismiss={() => setShowBasePriceWarning(false)}
          />

          <div className="space-y-3 sm:space-y-4">
            {ALLOWED_BUNDLE_SIZES.map((quantity) => (
              <BundleTierCard
                key={quantity}
                quantity={quantity}
                isActive={activeBundles.has(quantity)}
                price={prices[quantity] || 0}
                basePrice={basePrice}
                error={errors[quantity] || null}
                onToggle={() => toggleBundle(quantity)}
                onPriceChange={(value) => updatePrice(quantity, value)}
              />
            ))}
          </div>
        </>
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
