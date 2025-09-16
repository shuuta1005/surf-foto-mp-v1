// app/verify-reset-code/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function VerifyResetCodePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [remainingAttempts, setRemainingAttempts] = useState(3);

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    } else {
      router.push("/forgot-password");
    }
  }, [searchParams, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/verify-reset-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to password reset page with token
        router.push(
          `/reset-password?token=${data.resetToken}&email=${encodeURIComponent(
            email
          )}`
        );
      } else {
        setError(data.error);
        if (data.remainingAttempts !== undefined) {
          setRemainingAttempts(data.remainingAttempts);
        }
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = () => {
    router.push(
      `/forgot-password${email ? `?email=${encodeURIComponent(email)}` : ""}`
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Enter verification code
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            We sent a 6-digit code to{" "}
            <span className="font-medium">{email}</span>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="code"
              className="block text-sm font-medium text-gray-700"
            >
              Verification Code
            </label>
            <input
              id="code"
              name="code"
              type="text"
              required
              maxLength={6}
              className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm text-center text-xl tracking-wider"
              placeholder="123456"
              value={code}
              onChange={(e) =>
                setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
              {error}
              {remainingAttempts > 0 && remainingAttempts < 3 && (
                <div className="mt-1 text-xs">
                  {remainingAttempts} attempt(s) remaining
                </div>
              )}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading || code.length !== 6}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Verifying..." : "Verify Code"}
            </button>
          </div>

          <div className="text-center space-y-2">
            <button
              type="button"
              onClick={handleResendCode}
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Didn&apos;t receive the code? Send a new one
            </button>
            <br />
            <a
              href="/forgot-password"
              className="font-medium text-gray-600 hover:text-gray-500 text-sm"
            >
              Use a different email
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
