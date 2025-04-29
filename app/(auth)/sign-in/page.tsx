//(auth)/sign-in/page.tsx

"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import CredentialsSignInForm from "./credentials-sign-in-form";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen">
      {/* Left Side: Sign In Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center">
        {/* Mobile: Full width container - Fixed sizing */}
        <div className="w-full h-full flex items-center justify-center md:hidden px-4 py-6">
          <div className="w-full space-y-6">
            <div className="text-center space-y-2">
              <Link href="/" className="flex justify-center">
                <Image
                  src="/logo.svg"
                  alt="App Logo"
                  width={120}
                  height={120}
                  priority
                />
              </Link>
              <h2 className="text-2xl font-bold">Sign In</h2>
              <p className="text-gray-500">Sign in to your BrahFotos account</p>
            </div>
            {/* Apply a wrapper div with specific styling to ensure consistent size */}
            <div className="w-full text-base">
              <CredentialsSignInForm />
            </div>
          </div>
        </div>

        {/* Desktop: Original card design */}
        <div className="hidden md:block w-full max-w-md p-6">
          <Card className="shadow-lg">
            <CardHeader className="text-center space-y-2">
              <Link href="/" className="flex justify-center">
                <Image
                  src="/logo.svg"
                  alt="App Logo"
                  width={120}
                  height={120}
                  priority
                />
              </Link>
              <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
              <p className="text-gray-500">Sign in to your BrahFotos account</p>
            </CardHeader>
            <CardContent>
              <CredentialsSignInForm />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right Side: Image (Hidden on Mobile) */}
      <div className="hidden md:flex w-1/2 justify-center items-center m-10 aspect-video">
        <Image
          src="/destinations/north-chiba.jpg"
          alt="千葉北のサーファー"
          width={600}
          height={600}
          className="object-cover rounded-lg"
          priority
        />
      </div>
    </div>
  );
}
