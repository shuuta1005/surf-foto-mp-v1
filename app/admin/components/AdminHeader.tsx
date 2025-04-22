// app/admin/components/AdminHeader.tsx
"use client";

import Link from "next/link";
import Image from "next/image";

const AdminHeader = () => {
  return (
    <header className="bg-[#ebf6cf] px-6 py-4 shadow-sm border-b flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center space-x-3">
          <Image
            src="/logo.svg"
            alt="BraFotos Logo"
            height={60}
            width={60}
            priority={true}
            // className="w-110 h-10 sm:w-12 sm:h-12"
          />
          <span className="hidden lg:block text-3xl sm:text-2xl md:text-3xl text-black-400 font-bold">
            BrahFotos - Admin
          </span>
        </Link>
      </div>
      <nav className="flex gap-6 text-sm font-semibold text-gray-700">
        <Link href="/admin" className="hover:underline">
          Dashboard
        </Link>
        <Link href="/admin/upload" className="hover:underline font-semibold">
          Upload
        </Link>
        <Link
          href="/sign-out"
          className="hover:underline text-red-600 font-semibold"
        >
          Sign Out
        </Link>
      </nav>
    </header>
  );
};

export default AdminHeader;
