// lib/db
// 📌 Optional (Later): Use Neon Adapter
// When you’re ready for production with Neon, we’ll:

// Keep the singleton pattern

// But inject the Neon adapter into the PrismaClient inside lib/db.ts

// You're not there yet, but we’ll handle it when the time comes 🔧

import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  //globalThis is the global object (like a universal variable shared across modules in dev)
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// 🧠 In short: What is this file doing?
// It gives you a safe, shared, and singleton Prisma instance that:

// Won’t crash with too many connections

// Won’t get recreated every time you refresh the app in dev

// Works great in both development and production
