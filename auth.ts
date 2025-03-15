// How Does auth.ts Work?
// 👉 It configures NextAuth.js with:

// Database Adapter → Connects authentication to Prisma database.
// Providers → Defines login methods (e.g., email/password).
// Session Handling → Stores session data in JWT tokens.
// Callbacks → Controls session behavior.
// Sign In/Out Handlers → Manages user login/logout.

import NextAuth, { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "./db/db";
import CredentialsProvider from "next-auth/providers/credentials";
import { compareSync } from "bcrypt-ts-edge";

// ✅ Define the structure of session.user
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
    };
  }
}

export const config: NextAuthOptions = {
  pages: { signIn: "/sign-in", error: "/sign-in" },
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      credentials: { email: { type: "email" }, password: { type: "password" } },
      async authorize(credentials) {
        if (!credentials) return null;

        // ✅ Find user in database
        const user = await prisma.user.findFirst({
          where: { email: credentials.email as string },
        });

        // ✅ Check if user exists and password matches
        if (user && user.password) {
          const isMatch = compareSync(
            credentials.password as string,
            user.password
          );

          if (isMatch) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            };
          }
        }

        return null; // Invalid credentials
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      // ✅ Ensure session.user exists
      session.user = {
        id: token.sub as string,
        name: session.user?.name ?? null,
        email: session.user?.email ?? null,
        image: session.user?.image ?? null,
        role: token.role as string | undefined,
      };

      return session;
    },
  },
};

// ✅ Correct way to export NextAuth handlers in v4
export const { handlers, auth, signIn, signOut } = NextAuth(config);
