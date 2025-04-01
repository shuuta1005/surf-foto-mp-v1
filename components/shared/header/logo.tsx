import Image from "next/image";
import Link from "next/link";
import { APP_NAME } from "@/lib/constants";

const Logo = () => {
  return (
    <Link href="/" className="flex items-center space-x-3">
      <Image
        src="/brafotos-logo-1.svg"
        alt="BraFotos Logo"
        height={100}
        width={100}
        priority={true}
        // className="w-110 h-10 sm:w-12 sm:h-12"
      />
      <span className="hidden lg:block font-gothic text-2xl sm:text-3xl md:text-4xl text-black-400 font-normal">
        {APP_NAME}
      </span>
    </Link>
  );
};

export default Logo;
