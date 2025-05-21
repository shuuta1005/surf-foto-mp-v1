//app/loading.tsx

import Image from "next/image";
import waveLoader from "@/assets/wave-loader.gif";

const LoadingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-white text-center px-4">
      <Image
        src={waveLoader}
        height={320}
        width={320}
        alt="Loading..."
        className="animate-pulse"
      />
      {/* ‼️Mayble we can display different messages depending on user actions */}
      <p className="mt-6 text-gray-600 text-sm sm:text-lg font-semibold">
        Loading... Please hang tight 🌊
      </p>
    </div>
  );
};

export default LoadingPage;
