// types/cart.ts
import { z } from "zod";
import { cartItemSchema } from "@/lib/validations/validation";

export interface Cart {
  id: string;
  userId?: string;
  sessionCartId: string;
  items: CartItem[];
  totalPrice: number;
  taxPrice?: number;
  afterTaxPrice?: number;
  createdAt: string;
}

//💡 This makes sure that your CartItem type automatically stays in sync
// with your Zod validation schema. You don’t have to update two places anymore
// — it’s one source of truth now.
export type CartItem = z.infer<typeof cartItemSchema>;
