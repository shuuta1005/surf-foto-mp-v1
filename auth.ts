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
//Do protected paths


import NextAuth, { getServerSession, type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";

export const config: NextAuthOptions = {
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  adapter: PrismaAdapter(prisma),
  session: {
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
        try {
          if (!credentials?.email || !credentials?.password) return null;

          const user = await prisma.user.findUnique({
            where: { email: credentials.email.toLowerCase() }, // ✅ lowercase email
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
        } catch (error) {
          console.error("LOGIN ERROR:", error);
          throw new Error("Invalid login credentials");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // ✅ Attach user info to JWT when logging in
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        if ("role" in user) {
          token.role = user.role;
        }
      }
      return token;
    },
    async session({ session, token }) {
      // ✅ Populate session.user from token
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.name = (token.name as string) ?? null;
        session.user.email = (token.email as string) ?? null;
        session.user.image = session.user.image ?? null;
        session.user.role = (token.role as string) ?? undefined;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// Export auth helpers
export const { signIn, signOut, handlers } = NextAuth(config);

export const authOptions = config;
export const auth = () => getServerSession(authOptions);
