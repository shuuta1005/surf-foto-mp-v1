// app/admin/page.tsx
"use client";

import AdminActionCard from "./components/AdminActionCard";

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Welcome, Admin</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <AdminActionCard
          emoji="📤"
          title="Upload New Gallery"
          description="Add a new surf photo gallery to the platform."
          href="/admin/upload"
        />
        <AdminActionCard
          emoji="📈"
          title="View Your Sales Report"
          description="Track your sales record."
          href="/admin/sales"
        />
      </div>
    </div>
  );
}
