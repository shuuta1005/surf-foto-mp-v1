"use client";

import { useState } from "react";
import { z } from "zod";
import { signUpSchema } from "@/lib/validations/validation";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import FormField from "@/components/form/formField";
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
        toast({
          title: "Sign Up Failed",
          description: data.message || "Please check your input.",
          variant: "destructive",
        });
      } else {
        toast({ title: "Account created", description: "Please sign in." });
        router.push("/sign-in");
      }
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
