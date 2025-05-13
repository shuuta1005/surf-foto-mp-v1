import Image from "next/image";
import waveLoader from "@/assets/wave-loader.gif";

const LoadingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-white text-center px-4">
      <Image
        src={waveLoader}
        height={160}
        width={160}
        alt="Loading..."
        className="animate-pulse"
      />
      <p className="mt-6 text-gray-600 text-sm sm:text-base">
        Loading... Please hang tight 🌊
      </p>
    </div>
  );
};

export default LoadingPage;
