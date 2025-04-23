"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-stone-100 text-gray-900">
      {/* Hero - Using the same structure as your HighlightedPhotos component */}
      <div className="relative w-full h-[500px] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/fake-gallery-1/photo-1.jpg"
            alt="Wave background"
            fill
            className="object-cover opacity-20"
          />
        </div>

        {/* Overlay content - Positioned absolutely like in HighlightedPhotos */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            About BraFotos
          </h1>
          <div className="h-1 w-16 bg-stone-700 mx-auto mt-4 mb-6" />
          <p className="text-xl md:text-2xl font-medium text-gray-700">
            Every wave deserves to be remembered.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <section className="max-w-6xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-stone-700">Our Mission</h2>
          <p className="text-lg leading-relaxed text-gray-600 font-md">
            At BraFotos, we believe every wave deserves to be remembered.
          </p>
          <p className="text-lg leading-relaxed text-gray-600 font-md">
            Our platform connects photographers with surfers, creating a place
            where the beauty and thrill of surf culture can be discovered,
            shared, and remembered forever.
          </p>
        </div>

        <div className="relative w-full h-[300px] sm:h-[400px] overflow-hidden rounded-3xl shadow-md">
          <Image
            src="/takeoff1.jpg"
            alt="Surfer Image"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-30 rounded-3xl" />
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-stone-50 border-t border-stone-200 py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-2xl font-bold text-stone-800 mb-4">
            Keen to Join Our Community?
          </h2>

          <div className="space-y-8">
            <div>
              <p className="text-lg text-gray-600 font-medium mb-4">
                For photographers who are keen to join our community⚡️⚡️
              </p>
              <button className="bg-stone-300 hover:bg-stone-500 text-black hover:text-white px-6 py-3 rounded-lg font-semibold transition flex items-center justify-center mx-auto">
                📸 For Photographers <ArrowRight size={18} className="ml-2" />
              </button>
            </div>

            <div>
              <p className="text-lg text-gray-600 font-medium mb-4">
                For developers who are building the future of surf media⚡️⚡️
              </p>
              <button className="bg-gray-300 hover:bg-gray-500 hover:text-white text-black px-6 py-3 rounded-lg font-semibold transition flex items-center justify-center mx-auto">
                ⚙️ For Developers <ArrowRight size={18} className="ml-2" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
