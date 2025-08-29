//validations/cart/cart-Item.ts
import { z } from "zod";

// ✅ Schema for individual cart item
export const cartItemSchema = z.object({
  photoId: z.string().min(1, "Photo ID is required"),
  photoUrl: z.string().min(1, "Photo URL is required"),
  price: z.number().min(1, "Price is required"),
  location: z.string().optional(),
  takenAt: z.string().datetime().optional(),
  photographerId: z.string().optional(),
  photographerName: z.string().optional(),
  slug: z.string().optional(),
});
