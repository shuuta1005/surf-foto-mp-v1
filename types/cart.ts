// types/cart.ts

import { PricingTier } from "./pricing";

export type CartItem = {
  // Photo info
  photoId: string;
  photoUrl: string;

  // Gallery pricing info (for bundle calculations)
  galleryId: string;
  galleryName?: string; // For display ("Chiba Beach")
  galleryBasePrice: number; // Base price per photo
  galleryTiers?: PricingTier[]; // Bundle pricing

  // Photographer info (for display)
  photographerId?: string;
  photographerName?: string;
};
