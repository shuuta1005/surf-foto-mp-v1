// app/admin/components/AdminHeader.tsx
"use client";

import Link from "next/link";
import Image from "next/image";

const AdminHeader = () => {
  return (
    <header className="bg-[#86cca6] px-6 py-4 shadow-sm border-b flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center space-x-3">
          <Image
            src="/brahfotos-logo-3.png"
            alt="BraFotos Logo"
            height={80}
            width={80}
            priority={true}
            // className="w-110 h-10 sm:w-12 sm:h-12"
          />
          <span className="hidden lg:block text-3xl sm:text-2xl md:text-3xl text-black-400 font-extrabold">
            BrahFotos for Filmers
          </span>
        </Link>
      </div>
      <nav className="flex gap-6 text-sm font-bold text-gray-900">
        <Link href="/admin" className="hover:text-gray-700">
          Dashboard
        </Link>
        <Link href="/admin/upload" className="hover:text-gray-700">
          Upload
        </Link>
        <Link
          href="/sign-out"
          className="hover:text-red-500 text-red-700 font-bold"
        >
          Sign Out
        </Link>
      </nav>
    </header>
  );
};

export default AdminHeader;
