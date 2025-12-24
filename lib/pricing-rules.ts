// lib/pricing-rules.ts

/**
 * Centralized pricing rules and validation for the photo gallery platform
 * Used in both upload and edit flows to ensure consistency
 */

// ============================================================================
// CONSTANTS
// ============================================================================

export const MIN_PHOTO_PRICE = 500; // Minimum base price in JPY
export const MIN_DISCOUNT = 0.05; // 5% minimum discount for bundles
export const MAX_DISCOUNT = 0.5; // 50% maximum discount for bundles

// Fixed bundle sizes allowed in the system
export const ALLOWED_BUNDLE_SIZES = [2, 3, 4, 5] as const;
export type AllowedBundleSize = (typeof ALLOWED_BUNDLE_SIZES)[number];

// Suggested discount rates for each bundle size (used for auto-fill)
export const SUGGESTED_DISCOUNTS: Record<AllowedBundleSize, number> = {
  2: 0.1, // 10% off
  3: 0.15, // 15% off
  4: 0.2, // 20% off
  5: 0.25, // 25% off
};

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

/**
 * Validate base price
 */
export function validateBasePrice(price: number): string | null {
  if (!price || price <= 0) {
    return "Price must be greater than 0";
  }

  if (price < MIN_PHOTO_PRICE) {
    return `Base price must be at least ¥${MIN_PHOTO_PRICE.toLocaleString()}`;
  }

  return null;
}

/**
 * Validate a pricing tier against all rules
 */
export interface TierValidationContext {
  quantity: number;
  price: number;
  basePrice: number;
  existingTiers: Array<{ quantity: number; price: number }>;
  excludeTierId?: string; // When editing, exclude current tier from monotonic check
}

export function validatePricingTier(
  context: TierValidationContext
): string | null {
  const { quantity, price, basePrice, existingTiers } = context;

  // Check if quantity is allowed
  if (!ALLOWED_BUNDLE_SIZES.includes(quantity as AllowedBundleSize)) {
    return `Bundle size must be one of: ${ALLOWED_BUNDLE_SIZES.join(
      ", "
    )} photos`;
  }

  // Basic validation
  if (!price || price <= 0) {
    return "Price must be greater than 0";
  }

  if (!basePrice || basePrice <= 0) {
    return "Base price must be set first";
  }

  const fullPrice = basePrice * quantity;
  const minPrice = Math.ceil(fullPrice * (1 - MAX_DISCOUNT));
  const maxPrice = Math.floor(fullPrice * (1 - MIN_DISCOUNT));

  // Rule 1: Must be cheaper than buying individually
  if (price >= fullPrice) {
    return `Must be less than ¥${fullPrice.toLocaleString()} (individual price)`;
  }

  // Rule 2: Minimum discount (must save at least 5%)
  if (price > maxPrice) {
    return `Must be ≤ ¥${maxPrice.toLocaleString()} (min ${
      MIN_DISCOUNT * 100
    }% discount)`;
  }

  // Rule 3: Maximum discount (can't save more than 50%)
  if (price < minPrice) {
    return `Must be ≥ ¥${minPrice.toLocaleString()} (max ${
      MAX_DISCOUNT * 100
    }% discount)`;
  }

  // Rule 4: Monotonic per-photo pricing
  // Larger bundles must have equal or lower per-photo price than smaller bundles
  const perPhoto = price / quantity;
  const EPSILON = 0.01; // Small epsilon for rounding tolerance

  for (const tier of existingTiers) {
    // Only check smaller bundles (larger bundles can have any per-photo price)
    if (tier.quantity >= quantity) continue;

    const otherPerPhoto = tier.price / tier.quantity;
    if (perPhoto > otherPerPhoto + EPSILON) {
      return `Per-photo price (¥${Math.floor(
        perPhoto
      )}) must be ≤ smaller bundles (¥${Math.floor(otherPerPhoto)})`;
    }
  }

  return null;
}

/**
 * Calculate suggested price for a bundle quantity
 */
export function calculateSuggestedPrice(
  quantity: AllowedBundleSize,
  basePrice: number
): number {
  const discount = SUGGESTED_DISCOUNTS[quantity] || 0.15;
  return Math.floor(basePrice * quantity * (1 - discount));
}

/**
 * Calculate discount percentage
 */
export function calculateDiscount(
  quantity: number,
  price: number,
  basePrice: number
): number {
  if (!price || !basePrice || price <= 0 || basePrice <= 0) return 0;
  const fullPrice = basePrice * quantity;
  return Math.round(((fullPrice - price) / fullPrice) * 100);
}

/**
 * Calculate per-photo price
 */
export function calculatePerPhotoPrice(
  price: number,
  quantity: number
): number {
  if (quantity <= 0) return 0;
  return Math.floor(price / quantity);
}

/**
 * Calculate photographer earnings (90% after 10% platform fee)
 */
export function calculateEarnings(price: number): number {
  return Math.floor(price * 0.9);
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get the allowed price range for a bundle
 */
export function getAllowedPriceRange(
  quantity: number,
  basePrice: number
): { min: number; max: number; full: number } {
  const fullPrice = basePrice * quantity;
  const min = Math.ceil(fullPrice * (1 - MAX_DISCOUNT));
  const max = Math.floor(fullPrice * (1 - MIN_DISCOUNT));

  return { min, max, full: fullPrice };
}

/**
 * Check if a bundle size is allowed
 */
export function isAllowedBundleSize(
  quantity: number
): quantity is AllowedBundleSize {
  return ALLOWED_BUNDLE_SIZES.includes(quantity as AllowedBundleSize);
}

/**
 * Validate all tiers together (check for duplicates, etc.)
 */
export function validateTierCollection(
  tiers: Array<{ quantity: number; price: number }>,
  basePrice: number
): string | null {
  // Check for duplicate quantities
  const quantities = tiers.map((t) => t.quantity);
  const uniqueQuantities = new Set(quantities);

  if (quantities.length !== uniqueQuantities.size) {
    return "Duplicate bundle sizes are not allowed";
  }

  // Validate each tier
  for (const tier of tiers) {
    const error = validatePricingTier({
      quantity: tier.quantity,
      price: tier.price,
      basePrice,
      existingTiers: tiers.filter((t) => t.quantity !== tier.quantity),
    });

    if (error) {
      return `${tier.quantity}-photo bundle: ${error}`;
    }
  }

  return null;
}
