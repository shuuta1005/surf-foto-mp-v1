// lib/pricing-calculator.ts

import {
  PricingTier,
  PricingBreakdown,
  PricingResult,
  GalleryPricingData,
} from "@/types/pricing";

/**
 * Calculate the best price for a given quantity using gallery-specific bundles
 * Uses a greedy algorithm to find the optimal combination of bundles
 */
export function calculateBestPrice(
  quantity: number,
  basePrice: number,
  tiers: PricingTier[] = []
): PricingResult {
  if (quantity === 0) {
    return {
      totalPrice: 0,
      originalPrice: 0,
      savings: 0,
      breakdown: [],
    };
  }

  const originalPrice = basePrice * quantity;

  // Check if exact bundle exists
  const exactBundle = tiers.find((t) => t.quantity === quantity);
  if (exactBundle) {
    return {
      totalPrice: exactBundle.price,
      originalPrice,
      savings: originalPrice - exactBundle.price,
      breakdown: [
        {
          type: `${quantity}-photo bundle`,
          quantity: 1,
          unitPrice: exactBundle.price,
          totalPrice: exactBundle.price,
        },
      ],
    };
  }

  // Sort tiers by best value (lowest per-photo price) first
  const sortedTiers = [...tiers].sort((a, b) => {
    const aPerPhoto = a.price / a.quantity;
    const bPerPhoto = b.price / b.quantity;
    return aPerPhoto - bPerPhoto;
  });

  let remaining = quantity;
  let totalPrice = 0;
  const breakdown: PricingBreakdown[] = [];

  // Greedy approach: use best-value bundles first
  for (const tier of sortedTiers) {
    if (remaining >= tier.quantity) {
      const count = Math.floor(remaining / tier.quantity);
      const tierTotal = count * tier.price;

      totalPrice += tierTotal;
      breakdown.push({
        type: `${tier.quantity}-photo bundle`,
        quantity: count,
        unitPrice: tier.price,
        totalPrice: tierTotal,
      });

      remaining -= count * tier.quantity;
    }
  }

  // Add remaining photos at base price
  if (remaining > 0) {
    const remainingTotal = remaining * basePrice;
    totalPrice += remainingTotal;
    breakdown.push({
      type: "individual photo",
      quantity: remaining,
      unitPrice: basePrice,
      totalPrice: remainingTotal,
    });
  }

  return {
    totalPrice,
    originalPrice,
    savings: originalPrice - totalPrice,
    breakdown,
  };
}

/**
 * Calculate pricing for items grouped by gallery
 */
export function calculateCartPricing(
  itemsByGallery: Map<string, GalleryPricingData>
): {
  galleryPricing: Map<string, PricingResult>;
  grandTotal: number;
  totalSavings: number;
} {
  const galleryPricing = new Map<string, PricingResult>();
  let grandTotal = 0;
  let totalSavings = 0;

  for (const [galleryId, data] of itemsByGallery) {
    const result = calculateBestPrice(
      data.items.length,
      data.basePrice,
      data.tiers
    );

    galleryPricing.set(galleryId, result);
    grandTotal += result.totalPrice;
    totalSavings += result.savings;
  }

  return {
    galleryPricing,
    grandTotal,
    totalSavings,
  };
}
