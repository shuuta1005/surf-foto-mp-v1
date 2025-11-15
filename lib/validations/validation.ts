//WILL NOT USE ANYMORE, better to decompose for easier control

//Zod is a runtime validator —
//meaning it actually checks the data while the app is running, not just during development.
//TypeScript only checks types while you're coding — it disappears when the app runs in the browser.

// But Zod does this:

// ✅ Validates data at runtime (e.g. before submitting to API)
// ✅ Tells you what’s wrong (like "invalid email" or "too short")
// ✅ Helps you create clean TS types automatically (z.infer)

import { z } from "zod";

//SCHEMAS FOR SIGN IN AND UP
//‼️Add stricter password rules in the future (e.g., require numbers/symbols)
//‼️Add max length limits (e.g., max 255 chars for name, email)

// ✅ Schema for user sign-in form
export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// ✅ Schema for user sign-up form
export const signUpSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Confirm password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"], // ✅ This ensures the error message is shown next to the confirm password field
  });

//Cart Item schema
export const cartItemSchema = z.object({
  photoId: z.string().min(1, "Photo ID is required"),
  // photoUrl: z.string().url("Invalid photo URL"),
  photoUrl: z.string().min(1, "Photo URL is required"),
  price: z.number().min(1, "Price is required"),
  location: z.string().optional(), // e.g., beach or surf spot
  takenAt: z.string().datetime().optional(), // ISO date
  photographerId: z.string().optional(),
  photographerName: z.string().optional(), // useful for showing in UI or storing
  slug: z.string().optional(), // optional identifier used in URLs
});

//Cart schema
export const insertCartSchema = z.object({
  items: z.array(cartItemSchema).min(1, "Cart must contain items"),
  totalPrice: z.number().min(1, "Total price is required"),
  taxPrice: z.number().optional(),
  afterTaxPrice: z.number().optional(),
  sessionCartId: z.string().min(1, "Session cart ID is required"),
  userId: z.string().optional(), // only if user is logged in
});

// ✅ Gallery upload validation

export const uploadGallerySchema = z.object({
  prefecture: z.string().min(1, "Prefecture is required"),
  area: z.string().min(1, "Area is required"),
  surfSpot: z.string().min(1, "Surf spot is required"),
  date: z.string().min(1, "Date is required"),
  sessionTime: z.string().min(1, "Session time is required"),
  price: z
    .union([z.string(), z.number()])
    .transform((v) => Number(v))
    .refine((n) => Number.isFinite(n) && n >= 100, {
      message: "Price must be a number >= 100",
    }),
  tiers: z.string().optional(), // JSON string, parsed later
});
