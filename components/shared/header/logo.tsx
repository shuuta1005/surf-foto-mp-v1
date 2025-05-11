import Image from "next/image";
import Link from "next/link";
import { APP_NAME } from "@/lib/constants";

const Logo = () => {
  return (
    <Link href="/" className="flex items-center space-x-3">
      <Image
        src="/logo.svg"
        alt="BraFotos Logo"
        height={45}
        width={45}
        priority={true}
      />
      <span className="hidden lg:block font-gothic text-2xl sm:text-3xl md:text-4xl text-gray-800 font-semibold">
        {APP_NAME}
      </span>
    </Link>
  );
};

export default Logo;
