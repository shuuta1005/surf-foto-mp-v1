// How Does auth.ts Work?
// 👉 It configures NextAuth.js with:

// Database Adapter → Connects authentication to Prisma database.
// Providers → Defines login methods (e.g., email/password).
// Session Handling → Stores session data in JWT tokens.
// Callbacks → Controls session behavior.
// Sign In/Out Handlers → Manages user login/logout.

//🔐 Potential Improvements
//Limit login attempts >> Prevent brute-force attacks
//Lowercase email >> Avoid case issues (e.g. A@A.com vs a@a.com)
//Error logging >> Track weird login issues

import NextAuth, { getServerSession, type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "./lib/db";

// Export reusable auth config
export const config: NextAuthOptions = {
  pages: {
    signIn: "/sign-in",
    error: "/sign-in", // Optional: redirect to sign-in on error
  },
  adapter: PrismaAdapter(prisma),
  session: {
    //🔐 Tip later: Rotate JWT secrets if you get fancy with security.‼️
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isValid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        session.user = {
          id: token.sub as string,
          name: session.user.name ?? null,
          email: session.user.email ?? null,
          image: session.user.image ?? null,
          role: token.role as string | undefined,
        };
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// Export helpers
export const {
  //auth, // to use getServerSession anywhere
  signIn,
  signOut,
  handlers,
} = NextAuth(config);

export const authOptions = config;
export const auth = () => getServerSession(authOptions);
