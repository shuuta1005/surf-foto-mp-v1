//app/(auth)/sign-up/credentials-sign-up-form.tsx

"use client";

import { useState } from "react";
import { z } from "zod";
import { signUpSchema } from "@/lib/validations/validation";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import FormField from "@/components/shared/formField";
import { signUpDefaultValues } from "@/lib/constants";

type SignUpData = z.infer<typeof signUpSchema>;

const CredentialsSignUpForm = () => {
  const router = useRouter();

  const [formData, setFormData] = useState<SignUpData>(signUpDefaultValues);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof SignUpData, string>>
  >({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      const validated = signUpSchema.parse(formData);

      const res = await fetch("/api/auth/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });

      const data = await res.json();

      if (!res.ok) {
        // Handle rate limiting (429)
        if (res.status === 429 && data.timeLeft) {
          toast({
            title: "Please Wait",
            description: data.error,
            variant: "destructive",
          });
          return;
        }

        const fieldErrors: Partial<Record<keyof SignUpData, string>> = {};

        // Handle password validation errors
        if (data.details && Array.isArray(data.details)) {
          fieldErrors.password = data.details.join(" ");
        }

        // Handle known backend error messages
        if (data.error === "Email already in use") {
          fieldErrors.email = "This email is already registered.";
        }

        if (data.error === "Weak password") {
          fieldErrors.password = "Your password is too weak.";
        }

        // Fallback for unknown errors
        if (!fieldErrors.password && !fieldErrors.email) {
          fieldErrors.password = data.error || "Something went wrong.";
        }

        setErrors(fieldErrors);

        toast({
          title: "Sign Up Failed",
          description: Object.values(fieldErrors).join(" "),
          variant: "destructive",
        });

        return;
      }

      toast({
        title: "One last step…",
        description: "Check your email and enter the verification code.",
      });

      // Redirect to verification page with email and timing info
      const canResendAt = data.canResendAt
        ? `&canResendAt=${encodeURIComponent(data.canResendAt)}`
        : "";
      router.push(
        `/verify-signup?email=${encodeURIComponent(
          validated.email
        )}${canResendAt}`
      );
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: typeof errors = {};
        err.issues.forEach((issue) => {
          const key = issue.path[0] as keyof SignUpData;
          fieldErrors[key] = issue.message;
        });
        setErrors(fieldErrors);
      } else {
        toast({
          title: "Unexpected Error",
          description: "Something went wrong.",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormField
        label="Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
        disabled={isSubmitting}
      />

      <FormField
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
        disabled={isSubmitting}
      />

      <FormField
        label="Password"
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
        disabled={isSubmitting}
      />

      <FormField
        label="Confirm Password"
        name="confirmPassword"
        type="password"
        value={formData.confirmPassword}
        onChange={handleChange}
        error={errors.confirmPassword}
        disabled={isSubmitting}
      />

      <Button className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Signing Up..." : "Sign Up"}
      </Button>

      <p className="text-sm text-center text-gray-500">
        Already have an account?{" "}
        <Link href="/sign-in" className="text-blue-500 hover:underline">
          Sign In
        </Link>
      </p>
    </form>
  );
};

export default CredentialsSignUpForm;
