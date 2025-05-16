// components/AnnouncementBar.tsx
"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const messages = [
  "📸 The more photos you buy, the more you save — enjoy automatic bulk discounts at checkout!",
  "🤙 Are you a surf photographer? Join our platform and start selling your photos today!",
  "📲 Stay in the loop — follow @brah_surf_fotos on Instagram for daily updates and behind-the-scenes action!",
  "🌊 We're looking for passionate team members — photographers, engineers, and creatives welcome!",
  "🏄 Want to be in the next gallery? Check our Insta to see where we’re shooting today!",
];

export default function AnnouncementBar() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-scroll every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % messages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Manual controls
  const handlePrev = () =>
    setCurrentIndex((prev) => (prev === 0 ? messages.length - 1 : prev - 1));
  const handleNext = () =>
    setCurrentIndex((prev) => (prev + 1) % messages.length);

  return (
    <div className="w-full bg-black text-white text-sm py-2 px-4 flex items-center justify-between">
      <button
        onClick={handlePrev}
        className="p-1 hover:text-gray-300 transition"
        aria-label="Previous announcement"
      >
        <ChevronLeft size={18} />
      </button>

      <div className="flex-1 text-center">
        <p className="transition-all duration-300">{messages[currentIndex]}</p>
      </div>

      <button
        onClick={handleNext}
        className="p-1 hover:text-gray-300 transition"
        aria-label="Next announcement"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
