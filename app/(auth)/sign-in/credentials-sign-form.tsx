"use client";

import { useState } from "react";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

const CredentialsSignInForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password.");
    } else {
      router.push("/"); // Redirect to homepage after login
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* Email Input */}
      <div>
        <Label htmlFor="email" className="font-semibold">
          Email
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      {/* Password Input */}
      <div>
        <Label htmlFor="password" className="font-semibold">
          Password
        </Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {/* Submit Button */}
      <div>
        <Button className="w-full" variant="default">
          Sign In
        </Button>
      </div>

      {/* Sign Up Link */}
      <div className="text-sm text-center text-gray-500">
        Don’t have an account?{" "}
        <Link href="/sign-up" className="text-blue-500 hover:underline">
          Sign Up
        </Link>
      </div>
    </form>
  );
};

export default CredentialsSignInForm;
