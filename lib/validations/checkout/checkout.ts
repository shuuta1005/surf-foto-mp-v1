// lib/validations/checkout/checkout.ts

import { z } from "zod";

export const PhotoItemSchema = z.object({
  name: z.string().optional(),
  photoId: z.string(),
  photoUrl: z.string().optional(),
  price: z.number(),
});

export const CheckoutSchema = z.object({
  userId: z.string(),
  orderId: z.string(),
  items: z.array(PhotoItemSchema),
});

export type CheckoutPayload = z.infer<typeof CheckoutSchema>;
export type PhotoItem = z.infer<typeof PhotoItemSchema>;
