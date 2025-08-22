//app/(auth)/invalid-token/page.tsx

export default function InvalidTokenPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50 px-4">
      <div className="max-w-md w-full bg-white shadow-md rounded-lg p-6 text-center">
        <h1 className="text-xl font-semibold text-red-700 mb-4">
          Invalid or Expired Link
        </h1>
        <p className="text-gray-600 mb-6">
          The verification link is no longer valid. Please try signing up again
          or contact support.
        </p>
        <a href="/sign-up" className="text-blue-600 hover:underline">
          Return to Sign-Up →
        </a>
      </div>
    </div>
  );
}
