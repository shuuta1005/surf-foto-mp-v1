// app/(auth)/photographer-signup/page.tsx

"use client";

import Link from "next/link";
import Image from "next/image";
import PhotographerSignUpForm from "./photographer-signup-form";

export default function PhotographerSignUpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 sm:py-12 md:py-16">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <Link href="/" className="inline-block mb-4 sm:mb-6">
            <Image
              src="/brahfotos-logo-3.png"
              alt="BrahFotos Logo"
              width={140}
              height={140}
              className="sm:w-[160px] sm:h-[160px] md:w-[180px] md:h-[180px]"
              priority
            />
          </Link>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4 leading-tight">
            Become a Photographer
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto px-4">
            Start selling your surf photos on BrahFotos
          </p>
        </div>

        {/* Form Container */}
        <div className="w-full bg-white rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl p-6 sm:p-8 md:p-10 lg:p-12 xl:p-16">
          <PhotographerSignUpForm />
        </div>

        {/* Footer Note */}
        <p className="text-center text-xs sm:text-sm text-gray-500 mt-6 sm:mt-8 px-4">
          By signing up, you agree to our{" "}
          <Link href="/terms" className="text-blue-600 hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-blue-600 hover:underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}
