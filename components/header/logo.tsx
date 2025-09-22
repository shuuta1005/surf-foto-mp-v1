"use client";

import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { APP_NAME } from "@/lib/constants";
import spiralGif from "@/assets/spiral.gif";

const Logo = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setLoading(true);
    router.push("/");

    // fallback to stop loading after 5 seconds
    setTimeout(() => {
      setLoading(false);
    }, 5000);
  };

  // Reset loading when the path actually changes
  useEffect(() => {
    setLoading(false);
  }, [pathname]);

  return (
    <div
      className="flex items-center space-x-3 cursor-pointer"
      onClick={handleClick}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <Image
            src={spiralGif}
            alt="Loading..."
            width={100}
            height={100}
            className="animate-pulse"
          />
        </div>
      ) : (
        <>
          <Image
            src="/logo.svg"
            alt="BraFotos Logo"
            height={45}
            width={45}
            priority
          />
          <span className="hidden lg:block font-gothic text-2xl sm:text-3xl md:text-4xl text-gray-800 font-semibold">
            {APP_NAME}
          </span>
        </>
      )}
    </div>
  );
};

export default Logo;
