// app/(auth)/sign-up/page.tsx

"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import CredentialsSignUpForm from "./credentials-sign-up-form";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md px-4 py-6">
        <Card className="shadow-lg">
          <CardHeader className="text-center space-y-2">
            <Link href="/" className="flex justify-center">
              <Image
                src="/brahfotos-logo-3.png"
                alt="App Logo"
                width={150}
                height={150}
                priority
              />
            </Link>
            <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
            <p className="text-gray-500">Sign up to your BrahFotos account</p>
          </CardHeader>
          <CardContent>
            <CredentialsSignUpForm />
          </CardContent>
        </Card>

        {/* Photographer Sign-Up Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 mb-2">
            Want to sell your surf photos?
          </p>
          <Link
            href="/photographer-signup"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold hover:underline"
          >
            📸 Sign up as a photographer instead
          </Link>
        </div>
      </div>
    </div>
  );
}
