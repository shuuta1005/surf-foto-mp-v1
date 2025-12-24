// app/(auth)/photographer-signup/photographer-signup-form.tsx

"use client";

import { useState } from "react";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Bio is now optional
const photographerSignUpSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    bio: z.string().optional(), // ✨ Now optional
    portfolioLink: z
      .string()
      .url("Must be a valid URL")
      .optional()
      .or(z.literal("")),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type PhotographerSignUpData = z.infer<typeof photographerSignUpSchema>;

const PhotographerSignUpForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<PhotographerSignUpData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    bio: "",
    portfolioLink: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof PhotographerSignUpData, string>>
  >({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      const validated = photographerSignUpSchema.parse(formData);

      const res = await fetch("/api/auth/photographer-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 429 && data.timeLeft) {
          toast({
            title: "Please Wait",
            description: data.error,
            variant: "destructive",
          });
          return;
        }

        const fieldErrors: Partial<
          Record<keyof PhotographerSignUpData, string>
        > = {};

        if (data.details && Array.isArray(data.details)) {
          fieldErrors.password = data.details.join(" ");
        }

        if (data.error === "Email already in use") {
          fieldErrors.email = "This email is already registered.";
        }

        if (data.error === "Weak password") {
          fieldErrors.password = "Your password is too weak.";
        }

        if (!fieldErrors.password && !fieldErrors.email) {
          fieldErrors.email = data.error || "Something went wrong.";
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

      const canResendAt = data.canResendAt
        ? `&canResendAt=${encodeURIComponent(data.canResendAt)}`
        : "";
      router.push(
        `/verify-signup?email=${encodeURIComponent(
          validated.email
        )}${canResendAt}&isPhotographer=true`
      );
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: typeof errors = {};
        err.issues.forEach((issue) => {
          const key = issue.path[0] as keyof PhotographerSignUpData;
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
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-blue-900 mb-2">
          📸 Photographer Account Benefits:
        </h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Upload unlimited surf photo galleries</li>
          <li>• Earn 90% on every photo sold</li>
          <li>• Track sales and earnings in real-time</li>
          <li>• Direct payouts via Stripe</li>
        </ul>
      </div>

      {/* Name Field */}
      <div className="space-y-2">
        <Label htmlFor="name" className="font-semibold">
          Name
        </Label>
        <Input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          disabled={isSubmitting}
          className={errors.name ? "border-red-500" : ""}
        />
        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
      </div>

      {/* Email Field */}
      <div className="space-y-2">
        <Label htmlFor="email" className="font-semibold">
          Email
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          disabled={isSubmitting}
          className={errors.email ? "border-red-500" : ""}
        />
        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <Label htmlFor="password" className="font-semibold">
          Password
        </Label>
        <Input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          disabled={isSubmitting}
          className={errors.password ? "border-red-500" : ""}
        />
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password}</p>
        )}
      </div>

      {/* Confirm Password Field */}
      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="font-semibold">
          Confirm Password
        </Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          disabled={isSubmitting}
          className={errors.confirmPassword ? "border-red-500" : ""}
        />
        {errors.confirmPassword && (
          <p className="text-sm text-red-500">{errors.confirmPassword}</p>
        )}
      </div>

      {/* Bio Field - Now Optional */}
      <div className="space-y-2">
        <Label htmlFor="bio" className="font-semibold">
          About You / Why You Want to Join{" "}
          <span className="text-gray-400 text-sm font-normal">(Optional)</span>
        </Label>
        <Textarea
          id="bio"
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          placeholder="Tell us about your surf photography experience and why you want to join BrahFotos..."
          rows={4}
          disabled={isSubmitting}
          className={errors.bio ? "border-red-500" : ""}
        />
        {errors.bio && <p className="text-sm text-red-500">{errors.bio}</p>}
        {formData.bio && (
          <p className="text-xs text-gray-500">
            {formData.bio.length} characters
          </p>
        )}
      </div>

      {/* Portfolio Link Field */}
      <div className="space-y-2">
        <Label htmlFor="portfolioLink" className="font-semibold">
          Portfolio Link{" "}
          <span className="text-gray-400 text-sm font-normal">(Optional)</span>
        </Label>
        <Input
          id="portfolioLink"
          name="portfolioLink"
          type="url"
          value={formData.portfolioLink}
          onChange={handleChange}
          disabled={isSubmitting}
          placeholder="https://yourportfolio.com"
          className={errors.portfolioLink ? "border-red-500" : ""}
        />
        {errors.portfolioLink && (
          <p className="text-sm text-red-500">{errors.portfolioLink}</p>
        )}
      </div>

      <Button className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Creating Account..." : "Sign Up as Photographer"}
      </Button>

      <p className="text-sm text-center text-gray-500">
        Already have an account?{" "}
        <Link href="/sign-in" className="text-blue-500 hover:underline">
          Sign In
        </Link>
      </p>

      <p className="text-xs text-center text-gray-400">
        Just want to browse photos?{" "}
        <Link href="/sign-up" className="text-blue-500 hover:underline">
          Create a regular account
        </Link>
      </p>
    </form>
  );
};

export default PhotographerSignUpForm;
