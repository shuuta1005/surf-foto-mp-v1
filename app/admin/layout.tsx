import { ReactNode } from "react";
import AdminHeader from "./components/AdminHeader";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ADMIN_EMAILS } from "@/lib/constants";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  const userEmail = session?.user?.email;

  if (!userEmail || !ADMIN_EMAILS.includes(userEmail)) {
    return redirect("/sign-in"); // 🔐 redirect unauthorized users
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <AdminHeader />
      <main className="p-6 max-w-5xl mx-auto">{children}</main>
    </div>
  );
}
