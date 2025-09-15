// app/profile/page.tsx

"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";

export default function ProfilePage() {
  const { data: session } = useSession();
  const user = session?.user;

  const [name, setName] = useState(user?.name || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleNameUpdate = async () => {
    try {
      const res = await fetch("/api/account/update-name", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      setMessage(data.message || "Name updated.");
    } catch {
      setMessage("Failed to update name.");
    }
  };

  const handlePasswordChange = async () => {
    try {
      const res = await fetch("/api/account/change-password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      setMessage(data.message || "Password updated.");
    } catch {
      setMessage("Failed to update password.");
    }
  };

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
        {/* <p className="text-xs text-green-600 mt-1">
          {user?.emailVerified ? "Verified ✅" : "Not verified ❌"}
        </p> */}
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />
        <button
          onClick={handleNameUpdate}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Update Name
        </button>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Current Password
        </label>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />
        <label className="block text-sm font-medium text-gray-700 mt-4 mb-1">
          New Password
        </label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />
        <button
          onClick={handlePasswordChange}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Change Password
        </button>
      </div>

      {message && <p className="text-sm text-green-600 mt-4">{message}</p>}
    </div>
  );
}
