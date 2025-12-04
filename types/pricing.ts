// types/pricing.ts

/**
 * PricingTier represents a bundle pricing option
 * Example: Buy 3 photos for ¥2,550 (instead of ¥3,000 individually)
 */
export type PricingTier = {
  id?: string; // Optional - only exists after saving to database
  quantity: number; // Number of photos in bundle (e.g., 2, 3, 5)
  price: number; // Total price for bundle in JPY
};

/**
 * Breakdown of a single pricing component
 * Used to show users how their total is calculated
 */
export type PricingBreakdown = {
  type: string; // e.g., "3-photo bundle" or "individual photo"
  quantity: number; // How many of this type (e.g., 2 bundles)
  unitPrice: number; // Price per unit
  totalPrice: number; // Total for this component
};

/**
 * Result of pricing calculation
 * Shows total, savings, and detailed breakdown
 */
export type PricingResult = {
  totalPrice: number; // Final price customer pays
  originalPrice: number; // Price without bundles
  savings: number; // How much customer saved
  breakdown: PricingBreakdown[]; // Itemized breakdown
};

/**
 * Gallery pricing data for calculations
 * Used when calculating cart totals
 */
export type GalleryPricingData = {
  items: { photoId: string }[];
  basePrice: number;
  tiers: PricingTier[];
};
