//app/(auth)/invalid-token/page.tsx

"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function InvalidTokenPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleResend = async () => {
    if (!email) return;

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      setMessage(data.message || "Verification email resent.");
    } catch {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50 px-4">
      <div className="max-w-md w-full bg-white shadow-md rounded-lg p-6 text-center">
        <h1 className="text-xl font-semibold text-red-700 mb-4">
          Invalid or Expired Link
        </h1>
        <p className="text-gray-600 mb-6">
          The verification link is no longer valid. You can request a new one
          below or contact support.
        </p>

        <button
          onClick={handleResend}
          disabled={loading || !email}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm"
        >
          {loading ? "Resending..." : "Resend Verification Email"}
        </button>

        {message && <p className="mt-4 text-sm text-green-600">{message}</p>}

        <a
          href="/sign-up"
          className="mt-6 inline-block text-blue-600 hover:underline text-sm"
        >
          ← Return to Sign-Up
        </a>
      </div>
    </div>
  );
}
