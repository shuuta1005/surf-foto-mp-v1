import Image from "next/image";
import Link from "next/link";
import { APP_NAME } from "@/lib/constants";

const Logo = () => {
  return (
    <Link href="/" className="flex items-center space-x-3">
      <Image
        src="/images/bear.svg"
        alt="CapoFotos Logo"
        height={64}
        width={64}
        priority={true}
        className="w-10 h-10 sm:w-12 sm:h-12"
      />
      <span className="hidden lg:block font-bold text-xl sm:text-2xl text-blue-900">
        {APP_NAME}
      </span>
    </Link>
  );
};

export default Logo;
