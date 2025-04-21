import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Serif_JP } from "next/font/google";
import "@/assets/styles/globals.css";
import { APP_DESCRIPTION, APP_NAME, SERVER_URL } from "@/lib/constants";
import { CartProvider } from "@/lib/context/CartContext";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";

// Importing Google Fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoSerifJP = Noto_Serif_JP({
  weight: ["400", "700"], // Regular and Bold
  subsets: ["latin-ext"],
  variable: "--font-noto-serif-jp", // Create a CSS variable for usage
});

// Metadata configuration
export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
  metadataBase: new URL(SERVER_URL),
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${notoSerifJP.variable} antialiased`}
      >
        <SessionProvider session={session}>
          <CartProvider>{children}</CartProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
