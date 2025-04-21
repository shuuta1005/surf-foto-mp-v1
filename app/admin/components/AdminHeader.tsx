// app/admin/components/AdminHeader.tsx
"use client";

import Link from "next/link";
import Image from "next/image";

const AdminHeader = () => {
  return (
    <header className="bg-[#ebf6cf] px-6 py-4 shadow-sm border-b flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Image
          src="/logo.svg"
          alt="BraFotos Logo"
          width={50}
          height={50}
          className="rounded-sm"
        />
        <Link href="/admin" className="text-3xl font-bold text-gray-800">
          BraFotos Admin
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
