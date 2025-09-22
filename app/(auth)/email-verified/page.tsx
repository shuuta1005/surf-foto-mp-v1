// // app/(auth)/email-verified/page.tsx

export default function EmailVerifiedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 px-4">
      <div className="max-w-md w-full bg-white shadow-md rounded-lg p-6 text-center">
        <h1 className="text-xl font-semibold text-green-700 mb-4">
          Email Verified!
        </h1>
        <p className="text-gray-600 mb-6">
          Your account is now active. You can log in and start using
          SurfPhotosJapan.
        </p>
        <a href="/sign-in" className="text-blue-600 hover:underline">
          Go to Login →
        </a>
      </div>
    </div>
  );
}
