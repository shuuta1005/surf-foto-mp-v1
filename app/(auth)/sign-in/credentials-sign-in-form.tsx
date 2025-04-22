"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { z } from "zod";
import { signInSchema } from "@/lib/validation";
import { signInDefaultValues } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "@/components/ui/use-toast";
import FormField from "@/components/form/formField";

type SignInData = z.infer<typeof signInSchema>; // typeof = the type of the Zod object

const CredentialsSignInForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<SignInData>(signInDefaultValues);

  // Partial is a type that represents a type that allows all properties to be optional.
  // Required is a type that represents a type that requires all properties to be present.
  // Record is a type that represents a type that is a mapping from string to any.

  //The Record type is defined as Record<K, T> ,
  // where K represents the type of the keys
  // and T represents the type of the values.
  const [errors, setErrors] = useState<
    Partial<Record<keyof SignInData, string>>
  >({});

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    try {
      //This runs the rules we defined in signInSchema and checks if formData is valid.
      const validated = signInSchema.parse(formData);

      const result = await signIn("credentials", {
        ...validated,
        redirect: false,
      });

      if (result?.error) {
        toast({
          title: "Login Failed",
          description: "Invalid email or password.",
          variant: "destructive",
        });
      } else {
        router.push("/");
      }
    } catch (err) {
      //If Zod finds validation problems, it throws an error
      if (err instanceof z.ZodError) {
        const fieldErrors: typeof errors = {};
        err.issues.forEach((issue) => {
          const key = issue.path[0] as keyof SignInData;
          fieldErrors[key] = issue.message;
        });
        setErrors(fieldErrors);
      } else {
        toast({
          title: "Unexpected Error",
          description: "Something went wrong.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormField
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
        disabled={isLoading}
      />

      <FormField
        label="Password"
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
        disabled={isLoading}
      />

      <Button className="w-full" disabled={isLoading}>
        Sign In
      </Button>

      <p className="text-sm text-center text-gray-500">
        Don’t have an account?{" "}
        <Link href="/sign-up" className="text-blue-500 hover:underline">
          Sign Up
        </Link>
      </p>
    </form>
  );
};

export default CredentialsSignInForm;
