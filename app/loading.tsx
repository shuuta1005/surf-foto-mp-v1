//app/loading.tsx

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import equaliser2Gif from "@/assets/equaliser-2.gif";

const LoadingPage = () => {
  const [showEnglish, setShowEnglish] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowEnglish((prev) => !prev);
    }, 500); // ✅ switch every 0.5s

    return () => clearInterval(interval); // cleanup on unmount
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-white text-center px-4">
      <Image
        src={equaliser2Gif}
        height={320}
        width={320}
        alt="Loading..."
        className="animate-pulse"
      />
      <p className="mt-6 text-gray-600 text-sm sm:text-lg font-semibold transition-opacity duration-300">
        {showEnglish
          ? "Loading... Please hang tight 🌊"
          : "読み込み中… 少々お待ちください 🌊"}
      </p>
    </div>
  );
};

export default LoadingPage;
