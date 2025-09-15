// app/profile/page.tsx

"use client";

import { useSession } from "next-auth/react";

export default function ProfilePage() {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-semibold mb-6">My Account</h1>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          type="email"
          value={user?.email || ""}
          disabled
          className="w-full px-3 py-2 border rounded bg-gray-100 text-gray-600"
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Name
        </label>
        <input
          type="text"
          value={user?.name || ""}
          disabled
          className="w-full px-3 py-2 border rounded bg-gray-100 text-gray-600"
        />
      </div>
    </div>
  );
}
