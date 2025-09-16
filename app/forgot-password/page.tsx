// // app/forgot-password/page.tsx

// "use client";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { toast } from "@/components/ui/use-toast";
// import FormField from "@/components/shared/formField";

// export default function ForgotPasswordPage() {
//   const [email, setEmail] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);

//     try {
//       const res = await fetch("/api/auth/request-password-reset", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email }),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         toast({
//           title: "Reset Link Sent",
//           description: data.message || "Check your inbox for the reset link.",
//         });
//       } else {
//         toast({
//           title: "Error",
//           description: data.error || "Could not send reset link.",
//           variant: "destructive",
//         });
//       }
//     } catch {
//       toast({
//         title: "Unexpected Error",
//         description: "Something went wrong.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto py-10 px-4">
//       <h1 className="text-2xl font-semibold mb-6">Forgot Password</h1>
//       <form onSubmit={handleSubmit} className="space-y-6">
//         <FormField
//           label="Email"
//           name="email"
//           type="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           disabled={isLoading}
//         />

//         <Button type="submit" className="w-full" disabled={isLoading}>
//           {isLoading ? "Sending..." : "Send Reset Link"}
//         </Button>
//       </form>
//     </div>
//   );
// }

// app/forgot-password/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function ForgotPasswordPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(0);

  // Pre-fill email if user is logged in
  useEffect(() => {
    if (session?.user?.email) {
      setEmail(session.user.email);
    }
  }, [session]);

  // Cooldown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/auth/send-reset-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setCooldown(60); // 1 minute cooldown
        // Redirect to verification page with email
        router.push(`/verify-reset-code?email=${encodeURIComponent(email)}`);
      } else {
        setError(data.error);
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Reset your password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your email address and we&apos;ll send you a verification code
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading || cooldown > 0}
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
            <button
              type="submit"
              disabled={isLoading || cooldown > 0}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading
                ? "Sending..."
                : cooldown > 0
                ? `Wait ${cooldown}s`
                : "Send Verification Code"}
            </button>
          </div>

          <div className="text-center">
            <a
              href="/auth/signin"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Back to sign in
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
