// "use client";

// import { useState } from "react";
// import { Label } from "@radix-ui/react-label";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import { toast } from "@/hooks/use-toast";

// const CredentialsSignUpForm = () => {
//   const router = useRouter();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [name, setName] = useState("");
//   const [error, setError] = useState("");

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault(); // Stops the page from refreshing when you submit the form (default browser behavior)

//     setError(""); // Clears any previous error messages.

//     const res = await fetch("/api/auth/sign-up", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json", // Says: "I’m sending JSON data."
//       },
//       body: JSON.stringify({ name, email, password }), // Converts the info into a JSON string and sends it in the request.
//     });

//     const data = await res.json();

//     if (!res.ok) {
//       setError(data.message || "Something went wrong.");
//     } else {
//       toast({ title: "Account created!", description: "You can now sign in." });
//       router.push("/sign-in");
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-6">
//       {error && <p className="text-red-500 text-sm">{error}</p>}

//       <div>
//         <Label htmlFor="name" className="font-semibold">
//           Username
//         </Label>
//         <Input
//           id="name"
//           name="name"
//           type="text"
//           required
//           value={name}
//           onChange={(e) => setName(e.target.value)} //onChange updates the name state whenever the user types.
//         />
//       </div>

//       <div>
//         <Label htmlFor="email" className="font-semibold">
//           Email
//         </Label>
//         <Input
//           id="email"
//           name="email"
//           type="email"
//           required
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />
//       </div>

//       <div>
//         <Label htmlFor="password" className="font-semibold">
//           Password
//         </Label>
//         <Input
//           id="password"
//           name="password"
//           type="password"
//           required
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         />
//       </div>

//       <Button className="w-full font-semibold">Sign Up</Button>

//       <div className="text-sm text-center text-gray-500">
//         Already have an account?{" "}
//         <Link href="/sign-in" className="text-blue-500 hover:underline">
//           Sign In
//         </Link>
//       </div>
//     </form>
//   );
// };

// export default CredentialsSignUpForm;

"use client";

import { useState } from "react";
import { z } from "zod";
import { signUpSchema } from "@/lib/validation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-label";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "@/hooks/use-toast";

type SignUpData = z.infer<typeof signUpSchema>;

const CredentialsSignUpForm = () => {
  const router = useRouter();

  const [formData, setFormData] = useState<SignUpData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof SignUpData, string>>
  >({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      const validated = signUpSchema.parse(formData);

      const res = await fetch("/api/auth/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });

      const data = await res.json();

      if (!res.ok) {
        toast({ title: "Sign Up Failed", description: data.message });
      } else {
        toast({ title: "Account created", description: "Please sign in." });
        router.push("/sign-in");
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: typeof errors = {};
        for (const issue of err.issues) {
          fieldErrors[issue.path[0] as keyof SignUpData] = issue.message;
        }
        setErrors(fieldErrors);
      } else {
        toast({
          title: "Unexpected Error",
          description: "Something went wrong.",
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name */}
      <div>
        <Label htmlFor="name">Name</Label>
        <Input name="name" value={formData.name} onChange={handleChange} />
        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
      </div>

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

      {/* Confirm Password */}
      <div>
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
        />
        {errors.confirmPassword && (
          <p className="text-sm text-red-500">{errors.confirmPassword}</p>
        )}
      </div>

      <Button className="w-full">Sign Up</Button>

      <div className="text-sm text-center text-gray-500">
        Already have an account?{" "}
        <Link href="/sign-in" className="text-blue-500 hover:underline">
          Sign In
        </Link>
      </div>
    </form>
  );
};

export default CredentialsSignUpForm;
