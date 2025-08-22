// app/(auth)/check-email/page.tsx
import Link from "next/link";

export default function CheckEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white shadow-md rounded-lg p-6 text-center">
        <h1 className="text-xl font-semibold text-gray-800 mb-4">
          One last step!
        </h1>
        <p className="text-gray-600 mb-6">
          We’ve sent a verification link to your email. Click it to activate
          your account.
        </p>
        <p className="text-sm text-gray-500">
          Didn’t receive it? Check your spam folder or try signing up again.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block text-blue-500 hover:underline text-sm"
        >
          ← Return to homepage
        </Link>
      </div>
    </div>
  );
}
