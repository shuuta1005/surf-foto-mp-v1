// //app/admin/layout.tsx

import { ReactNode } from "react";
import AdminHeader from "./components/AdminHeader";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  if (!session?.user || session.user.role !== "admin") {
    return redirect("/sign-in"); // 🔐 redirect unauthorized users
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <AdminHeader />
      <main className="p-6 max-w-5xl mx-auto">{children}</main>
    </div>
  );
}
