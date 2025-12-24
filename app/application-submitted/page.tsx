// app/application-submitted/page.tsx

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ApplicationSubmittedPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          {/* Success Message */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Application Submitted! 🎉
          </h1>

          <p className="text-lg text-gray-600 mb-8">
            Thanks for applying to become a BrahFotos photographer! We've
            received your application and will review it shortly.
          </p>

          {/* What's Next */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 text-left">
            <h2 className="font-semibold text-blue-900 mb-3">
              What happens next:
            </h2>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start">
                <span className="mr-2">📧</span>
                <span>
                  We'll review your application within 2-3 business days
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✅</span>
                <span>
                  You'll receive an email notification once your application is
                  approved
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">📸</span>
                <span>
                  Once approved, you can start uploading galleries right away
                </span>
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Link href="/">
              <Button size="lg" className="w-full md:w-auto">
                Back to Home
              </Button>
            </Link>
            <p className="text-sm text-gray-500">
              Questions? Contact us at{" "}
              <a
                href="mailto:support@brahfotos.com"
                className="text-blue-600 hover:underline"
              >
                support@brahfotos.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
