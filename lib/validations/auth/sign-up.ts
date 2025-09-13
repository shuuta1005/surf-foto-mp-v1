//validations/auth/sign-up.ts

import { z } from "zod";

const passwordPolicyRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

export const signUpSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .regex(
        passwordPolicyRegex,
        "Password must be at least 8 characters and include both letters and numbers"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const isStrongPassword = (password: string): boolean => {
  const regex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
  return regex.test(password);
};

export const validatePassword = (password: string): string[] => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long.");
  }

  if (!/[A-Za-z]/.test(password)) {
    errors.push("Password must include at least one letter.");
  }

  if (!/\d/.test(password)) {
    errors.push("Password must include at least one number.");
  }

  return errors;
};
