// // types/cart.ts
// import { z } from "zod";
// import { cartItemSchema } from "@/lib/validations/validation";

// export interface Cart {
//   id: string;
//   userId?: string;
//   sessionCartId: string;
//   items: CartItem[];
//   totalPrice: number;
//   taxPrice?: number;
//   afterTaxPrice?: number;
//   createdAt: string;
// }

// //💡 This makes sure that your CartItem type automatically stays in sync
// // with your Zod validation schema. You don’t have to update two places anymore
// // — it’s one source of truth now.
// export type CartItem = z.infer<typeof cartItemSchema>;

// types/cart.ts

import { PricingTier } from "@/lib/pricing-calculator";

export type CartItem = {
  photoId: string;
  photoUrl: string;
  price: number; // Individual base price from gallery

  // Gallery information (needed for bundle pricing)
  galleryId: string;
  galleryName?: string; // Optional: for display purposes
  galleryBasePrice: number; // Gallery's base price
  galleryTiers?: PricingTier[]; // Gallery's bundle pricing tiers

  // Optional metadata
  location?: string;
  takenAt?: Date | string;
  photographerId?: string;
  photographerName?: string;
  slug?: string;
};
