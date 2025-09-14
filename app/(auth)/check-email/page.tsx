// // app/(auth)/check-email/page.tsx

"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function CheckEmailPage() {
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white shadow-md rounded-lg p-6 text-center">
        <h1 className="text-xl font-semibold text-gray-800 mb-4">
          One last step!
        </h1>
        <p className="text-gray-600 mb-6">
          We’ve sent a verification link to your email. Click it to activate
          your account.
        </p>
        <p className="text-sm text-gray-500 mb-4">
          Didn’t receive it? Check your spam folder or click below to resend.
        </p>

        <button
          onClick={handleResend}
          disabled={loading || !email}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm"
        >
          {loading ? "Resending..." : "Resend Verification Email"}
        </button>

        {message && <p className="mt-4 text-sm text-green-600">{message}</p>}

        <Link
          href="/"
          className="mt-6 inline-block text-blue-500 hover:underline text-sm"
        >
          ← Return to homepage
        </Link>
      </div>
    </div>
  );
}
