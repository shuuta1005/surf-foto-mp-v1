export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "BRA FOTOS";
export const APP_DESCRIPTION =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION || "Find Yourself";
export const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";

export const signInDefaultValues = {
  email: "",
  password: "",
};

export const signUpDefaultValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

// lib/constants.ts
export const ADMIN_EMAILS = ["adminbra1@email.com", "adminbra2@email.com"];
