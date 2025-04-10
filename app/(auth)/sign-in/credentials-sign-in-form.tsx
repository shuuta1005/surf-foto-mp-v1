// "use client";

// import { useState } from "react";
// import { Label } from "@radix-ui/react-label";
// import { Input } from "@/components/ui/input";
// import { signIn } from "next-auth/react";
// import { Button } from "@/components/ui/button";
// import Link from "next/link";
// import { useRouter } from "next/navigation";

// const CredentialsSignInForm = () => {
//   const router = useRouter();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");

//     const result = await signIn("credentials", {
//       email,
//       password,
//       redirect: false,
//     });

//     if (result?.error) {
//       setError("Invalid email or password.");
//     } else {
//       router.push("/"); // Redirect to homepage after login
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-6">
//       {error && <p className="text-red-500 text-sm">{error}</p>}

//       {/* Email Input */}
//       <div>
//         <Label htmlFor="email" className="font-semibold">
//           Email
//         </Label>
//         <Input
//           id="email"
//           name="email"
//           type="email"
//           required
//           autoComplete="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />
//       </div>

//       {/* Password Input */}
//       <div>
//         <Label htmlFor="password" className="font-semibold">
//           Password
//         </Label>
//         <Input
//           id="password"
//           name="password"
//           type="password"
//           required
//           autoComplete="current-password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         />
//       </div>

//       {/* Submit Button */}
//       <div>
//         <Button className="w-full font-semibold" variant="default">
//           Sign In
//         </Button>
//       </div>

//       {/* Sign Up Link */}
//       <div className="text-sm text-center text-gray-500">
//         Don’t have an account?{" "}
//         <Link href="/sign-up" className="text-blue-500 hover:underline">
//           Sign Up
//         </Link>
//       </div>
//     </form>
//   );
// };

// export default CredentialsSignInForm;

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { z } from "zod";
import { signInSchema } from "@/lib/validation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-label";
import Link from "next/link";
import { toast } from "@/components/ui/use-toast";
import { signInDefaultValues } from "@/lib/constants";

type SignInData = z.infer<typeof signInSchema>;

const CredentialsSignInForm = () => {
  const router = useRouter();

  const [formData, setFormData] = useState<SignInData>(signInDefaultValues);

  const [errors, setErrors] = useState<
    Partial<Record<keyof SignInData, string>>
  >({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      const validated = signInSchema.parse(formData);

      const result = await signIn("credentials", {
        email: validated.email,
        password: validated.password,
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
      if (err instanceof z.ZodError) {
        const fieldErrors: typeof errors = {};
        for (const issue of err.issues) {
          fieldErrors[issue.path[0] as keyof SignInData] = issue.message;
        }
        setErrors(fieldErrors);
      } else {
        toast({
          title: "Unexpected Error",
          description: "Something went wrong.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Email */}
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
      </div>

      {/* Password */}
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
        />
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password}</p>
        )}
      </div>

      {/* Submit */}
      <Button className="w-full">Sign In</Button>

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
