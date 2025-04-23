import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Serif_JP } from "next/font/google";
import "@/assets/styles/globals.css";
import { APP_DESCRIPTION, APP_NAME, SERVER_URL } from "@/lib/constants";
import { CartProvider } from "@/lib/context/CartContext";
import NextAuthProvider from "@/components/providers/session-provider";

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
  weight: ["400", "700"],
  subsets: ["latin-ext"],
  variable: "--font-noto-serif-jp",
});

// Metadata configuration
export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
  icons: { icon: "/logo.svg" },
  metadataBase: new URL(SERVER_URL),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${notoSerifJP.variable} antialiased`}
      >
        <NextAuthProvider>
          <CartProvider>{children}</CartProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
