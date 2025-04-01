"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import CredentialsSignInForm from "./credentials-sign-form";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen">
      {/* Left Side: Sign In Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Card className="shadow-lg">
            <CardHeader className="text-center space-y-2">
              <Link href="/" className="flex justify-center">
                <Image
                  src="/brafotos-logo-1.svg"
                  alt="App Logo"
                  width={180}
                  height={180}
                  priority
                />
              </Link>
              <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
              <p className="text-gray-500">Access your BraFotos account</p>
            </CardHeader>
            <CardContent>
              <CredentialsSignInForm />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right Side: Image (Hidden on Mobile) */}
      <div className="hidden md:flex w-1/2 justify-center items-center m-10">
        <Image
          src="/destinations/north-chiba.jpg"
          alt="Surfing"
          width={600}
          height={600}
          className="object-cover rounded-lg"
          priority
        />
      </div>
    </div>
  );
}
