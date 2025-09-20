//app/(auth)/verify-signup/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

export default function VerifySignUpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    const emailParam = searchParams.get("email");
    const canResendAt = searchParams.get("canResendAt");

    if (emailParam) {
      setEmail(emailParam);
    } else {
      router.push("/sign-up");
    }

    // Set initial cooldown if coming from successful signup
    if (canResendAt) {
      const timeLeft = Math.max(
        0,
        Math.ceil((new Date(canResendAt).getTime() - Date.now()) / 1000)
      );
      setResendCooldown(timeLeft);
    }
  }, [searchParams, router]);

  // Countdown timer for resend button
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/auth/verify-email", {
        //"/api/auth/verify-signup-code"
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Welcome to BrahFotos!",
          description: "Your account has been created successfully.",
        });

        // Redirect to sign-in page with success message
        router.push(
          "/sign-in?message=Account created successfully. Please sign in."
        );
      } else {
        setError(data.error);
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0) return;

    setIsResending(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/auth/resend-verification", {
        //"/api/auth/resend-signup-code"
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("New verification code sent. Please check your inbox.");
        setCode(""); // Clear the current code input

        // Set cooldown from server response
        if (data.canResendAt) {
          const timeLeft = Math.max(
            0,
            Math.ceil(
              (new Date(data.canResendAt).getTime() - Date.now()) / 1000
            )
          );
          setResendCooldown(timeLeft);
        }
      } else {
        setError(data.error);
        if (data.timeLeft) {
          setResendCooldown(data.timeLeft);
        }
      }
    } catch {
      setError("Failed to resend code. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Verify your email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            We sent a 6-digit verification code to{" "}
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
            </div>
          )}

          {message && (
            <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md text-sm">
              {message}
            </div>
          )}

          <div>
            <Button
              type="submit"
              disabled={isLoading || code.length !== 6}
              className="w-full"
            >
              {isLoading ? "Verifying..." : "Verify Code"}
            </Button>
          </div>

          <div className="text-center space-y-2">
            <button
              type="button"
              onClick={handleResendCode}
              disabled={resendCooldown > 0 || isResending}
              className="font-medium text-blue-600 hover:text-blue-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:text-gray-400"
            >
              {isResending
                ? "Sending..."
                : resendCooldown > 0
                ? `Resend code in ${resendCooldown}s`
                : "Didn't receive the code? Send a new one"}
            </button>
            <br />
            <a
              href="/sign-up"
              className="font-medium text-gray-600 hover:text-gray-500 text-sm"
            >
              Back to sign up
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
