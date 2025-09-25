"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import CredentialsSignUpForm from "./credentials-sign-up-form";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen">
      {/* Left Side: Sign Up Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center">
        {/* Mobile Version */}
        <div className="w-full h-full flex items-center justify-center md:hidden px-4 py-6">
          <div className="w-full space-y-6">
            <div className="text-center space-y-2">
              <Link href="/" className="flex justify-center">
                <Image
                  src="/brahfotos-logo-3.png"
                  alt="App Logo"
                  width={150}
                  height={150}
                  priority
                />
              </Link>
              <h2 className="text-2xl font-bold">Create Account</h2>
              <p className="text-gray-500">Sign up to your BrahFotos account</p>
            </div>
            <CredentialsSignUpForm />
          </div>
        </div>

        {/* Desktop Version */}
        <div className="hidden md:block w-full max-w-md p-6">
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
              <CardTitle className="text-2xl font-bold">
                Create Account
              </CardTitle>
              <p className="text-gray-500">Sign up to your BrahFotos account</p>
            </CardHeader>
            <CardContent>
              <CredentialsSignUpForm />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right Side: Background Image (Hidden on Mobile) */}
      <div className="hidden md:flex w-1/2 justify-center items-center m-10 aspect-video">
        <Image
          src="/destinations/kamo.jpg"
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
