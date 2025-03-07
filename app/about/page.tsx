"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";

export default function AboutPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle,_transparent_10%,_#000_70%)]"></div>
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
          <div
            className={`transform transition-all duration-1000 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
              About BraFotos
            </h1>
            <div className="h-1 w-24 bg-yellow-500 mb-8"></div>
            {/* <p className="text-xl md:text-2xl max-w-3xl font-semibold text-gray-300">
              At BraFotos, we believe every wave deserves to be remembered. Our
              platform seamlessly connects talented surf photographers with wave
              riders, creating a marketplace where unforgettable moments can be
              discovered, shared, and cherished.
            </p> */}
          </div>
        </div>
      </div>

      {/* Mission Statement with Image */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div
          className={`flex flex-col lg:flex-row items-center gap-12 transform transition-all duration-1000 delay-300 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-gray-100 mb-8">
              Our Mission
            </h2>
            <p className="text-lg text-gray-300 leading-relaxed mb-6">
              At BraFotos, we believe every wave deserves to be remembered. Our
              platform seamlessly connects talented surf photographers with wave
              riders, creating a marketplace where unforgettable moments can be
              discovered, shared, and cherished.
            </p>
            <p className="text-lg text-gray-300 leading-relaxed mb-6">
              Our platform connects photographers with surfers, creating a place
              where the beauty and thrill of surf culture can be discovered,
              shared, and remembered forever.
            </p>
          </div>

          <div className="flex-1 w-full lg:w-auto">
            <div className="relative h-80 sm:h-96 lg:h-[450px] w-full rounded-lg overflow-hidden shadow-2xl ring-1 ring-gray-700">
              <Image
                src="/takeoff1.jpg"
                alt="Surfer Image"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-40"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Join Us CTA */}
      <div className="bg-gradient-to-b from-gray-800 to-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div
            className={`text-center transform transition-all duration-1000 delay-500 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <h2 className="text-3xl font-bold mb-6">
              Keen to Join Our Community?
            </h2>
            <p className="text-xl max-w-2xl mx-auto mb-8 text-gray-300 font-semibold">
              For photographers who are keen to join our community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-8 py-4 rounded-lg font-medium transition-colors shadow-lg flex items-center justify-center">
                For Photographers <ArrowRight size={18} className="ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
