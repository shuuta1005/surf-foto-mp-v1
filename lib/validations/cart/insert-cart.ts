import { z } from "zod";
import { cartItemSchema } from "./cart-item";

// ✅ Schema for entire cart
export const insertCartSchema = z.object({
  items: z.array(cartItemSchema).min(1, "Cart must contain items"),
  totalPrice: z.number().min(1, "Total price is required"),
  taxPrice: z.number().optional(),
  afterTaxPrice: z.number().optional(),
  sessionCartId: z.string().min(1, "Session cart ID is required"),
  userId: z.string().optional(),
});
