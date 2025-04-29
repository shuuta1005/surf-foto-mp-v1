import { z } from "zod";

// ✅ Schema for user sign-in form
export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
