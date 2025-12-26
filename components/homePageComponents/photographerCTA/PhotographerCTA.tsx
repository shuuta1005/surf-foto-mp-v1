// components/homePageComponents/photographerCTA/PhotographerCTA.tsx

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function PhotographerCTA() {
  return (
    <section className="bg-white border-y border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14 md:py-5">
        <div className="max-w-3xl mx-auto text-center">
          {/* Logo */}
          <div className="inline-block">
            <Image
              src="/brahfotos-logo-7.png"
              alt="BrahFotos"
              width={150}
              height={150}
              className="sm:w-[160px] sm:h-[160px]"
            />
          </div>

          {/* Heading */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-stone-900 mb-2 sm:mb-4">
            Surf Photographer?
          </h2>

          {/* Description */}
          <p className="text-base sm:text-lg text-stone-600 mb-6 sm:mb-8">
            Upload your galleries, set your prices, and earn 90% on every sale.
            Simple as that.
          </p>

          {/* CTA Button */}
          <Link href="/photographer-signup">
            <Button
              size="lg"
              className="bg-stone-900 hover:bg-stone-800 text-white font-semibold text-base sm:text-lg px-8 py-5 rounded-lg group"
            >
              Start Selling Photos
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
