//(auth)/verify-email/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [debugInfo, setDebugInfo] = useState<string[]>([]);

  const addDebug = (message: string) => {
    console.log(message);
    setDebugInfo((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()}: ${message}`,
    ]);
  };

  useEffect(() => {
    addDebug(`Page loaded. Token: ${token}`);
    addDebug(`Current URL: ${window.location.href}`);

    if (!token) {
      addDebug("No token found, redirecting to invalid-token");
      router.replace("/invalid-token");
      return;
    }

    const verify = async () => {
      try {
        addDebug(`Making API call to: /api/auth/verify-email?token=${token}`);

        const res = await fetch(`/api/auth/verify-email?token=${token}`);
        addDebug(`API Response status: ${res.status}`);

        const data = await res.json();
        addDebug(`API Response data: ${JSON.stringify(data)}`);

        if (res.ok && data.success) {
          addDebug("Verification successful, redirecting to /email-verified");
          router.replace("/email-verified");
        } else {
          addDebug(`Verification failed: ${data.error || "Unknown error"}`);
          router.replace("/invalid-token");
        }
      } catch (error) {
        addDebug(`Network error: ${error}`);
        router.replace("/invalid-token");
      }
    };

    verify();
  }, [token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 px-4">
      <div className="max-w-2xl w-full bg-white shadow-md rounded-lg p-6">
        <div className="text-center mb-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h1 className="text-lg font-medium text-gray-800 mb-2">
            🔄 Verifying your email...
          </h1>
          <p className="text-gray-600">
            Please wait while we verify your email address.
          </p>
        </div>

        {/* Debug Information */}
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Debug Info:</h3>
          <div className="text-xs space-y-1 max-h-40 overflow-y-auto">
            {debugInfo.map((info, index) => (
              <div key={index} className="text-gray-700">
                {info}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
