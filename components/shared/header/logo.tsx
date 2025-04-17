import Image from "next/image";
import Link from "next/link";
import { APP_NAME } from "@/lib/constants";

const Logo = () => {
  return (
    <Link href="/" className="flex items-center space-x-3">
      <Image
        src="/logo.svg"
        alt="BraFotos Logo"
        height={60}
        width={60}
        priority={true}
        // className="w-110 h-10 sm:w-12 sm:h-12"
      />
      <span className="hidden lg:block font-gothic text-xl sm:text-2xl md:text-3xl text-black-400 font-normal">
        {APP_NAME}
      </span>
    </Link>
  );
};

export default Logo;
