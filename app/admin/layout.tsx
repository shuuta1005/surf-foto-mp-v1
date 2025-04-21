// app/admin/layout.tsx
// app/admin/layout.tsx

import { ReactNode } from "react";
import AdminHeader from "./components/AdminHeader";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <AdminHeader />
      <main className="p-6 max-w-5xl mx-auto">{children}</main>
    </div>
  );
}
