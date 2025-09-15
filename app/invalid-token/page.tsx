//app/(auth)/invalid-token/page.tsx

"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function InvalidTokenPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [cooldown, setCooldown] = useState(0);

  // Start cooldown immediately on page load
  useEffect(() => {
    setCooldown(60);
  }, []);

  // Countdown logic
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleResend = async () => {
    if (!email || cooldown > 0) return;

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

      // Always restart cooldown after resend
      setCooldown(60);
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
          {cooldown > 0
            ? `You can resend a verification email in ${cooldown}s.`
            : "The verification link is no longer valid. You can request a new one below or contact support."}
        </p>

        <button
          onClick={handleResend}
          disabled={loading || cooldown > 0 || !email}
          className={`px-4 py-2 rounded text-sm ${
            loading || cooldown > 0 || !email
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          {loading
            ? "Resending..."
            : cooldown > 0
            ? `Resend available in ${cooldown}s`
            : "Resend Verification Email"}
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
