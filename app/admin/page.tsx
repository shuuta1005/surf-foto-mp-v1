// app/admin/page.tsx
"use client";

import { useSession } from "next-auth/react";
import AdminActionCard from "./components/AdminActionCard";

export default function AdminPage() {
  const { data: session } = useSession();

  const userName = session?.user?.name || "Admin";

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-extrabold">G&apos;day, {userName}! </h2>
      <h3 className="font-medium">Cheers for your support🌅</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
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
        <AdminActionCard
          emoji="🎥"
          title="Your Galleries"
          description="Manage your galleries"
          href="/admin/manage-gallery"
        />
        <AdminActionCard
          emoji="🏄‍♂️"
          title="Galleries for Review"
          description="Manage your galleries"
          href="/admin/galleries/pending"
        />
        {/* ✅ NEW: Epic Galleries Card */}
        <AdminActionCard
          emoji="⭐"
          title="Epic Galleries"
          description="Manage featured galleries on homepage"
          href="/admin/galleries/epic"
        />
      </div>
    </div>
  );
}
