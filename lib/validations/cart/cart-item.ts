// //validations/cart/cart-Item.ts
// import { z } from "zod";

// // ✅ Schema for individual cart item
// export const cartItemSchema = z.object({
//   photoId: z.string().min(1, "Photo ID is required"),
//   photoUrl: z.string().min(1, "Photo URL is required"),
//   price: z.number().min(1, "Price is required"),
//   location: z.string().optional(),
//   takenAt: z.string().datetime().optional(),
//   photographerId: z.string().optional(),
//   photographerName: z.string().optional(),
//   slug: z.string().optional(),
// });

//validations/cart/cart-item.ts
import { z } from "zod";

// Pricing tier schema
const pricingTierSchema = z.object({
  id: z.string().optional(),
  quantity: z.number().min(1),
  price: z.number().min(1),
});

// ✅ Schema for individual cart item
export const cartItemSchema = z.object({
  photoId: z.string().min(1, "Photo ID is required"),
  photoUrl: z.string().min(1, "Photo URL is required"),
  price: z.number().min(1, "Price is required"),

  // Gallery information (required for bundle pricing)
  galleryId: z.string().min(1, "Gallery ID is required"),
  galleryName: z.string().optional(),
  galleryBasePrice: z.number().min(1, "Gallery base price is required"),
  galleryTiers: z.array(pricingTierSchema).optional(),

  // Optional metadata
  location: z.string().optional(),
  takenAt: z.string().datetime().optional(),
  photographerId: z.string().optional(),
  photographerName: z.string().optional(),
  slug: z.string().optional(),
});
