// app/apply-photographer/page.tsx

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import PhotographerApplicationForm from "./PhotographerApplicationForm";

export default async function ApplyPhotographerPage() {
  const session = await auth();

  // Must be logged in
  if (!session?.user) {
    redirect("/sign-in");
  }

  // Get user data
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      role: true,
      photographerStatus: true,
      name: true,
      email: true,
    },
  });

  if (!user) {
    redirect("/sign-in");
  }

  // Already a photographer
  if (user.role === "PHOTOGRAPHER") {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <h1 className="text-3xl font-bold mb-4">
          You're Already a Photographer! 📸
        </h1>
        <p className="text-gray-600 mb-6">
          You already have photographer access. Head to your dashboard to start
          uploading galleries.
        </p>
        <a
          href="/admin"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Go to Dashboard
        </a>
      </div>
    );
  }

  // Application pending
  if (user.photographerStatus === "PENDING") {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <h1 className="text-3xl font-bold mb-4">Application Pending ⏳</h1>
        <p className="text-gray-600 mb-6">
          Your photographer application is under review. We'll notify you via
          email once it's been processed.
        </p>
        <a
          href="/"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Back to Home
        </a>
      </div>
    );
  }

  // Application rejected
  if (user.photographerStatus === "REJECTED") {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <h1 className="text-3xl font-bold mb-4">Application Not Approved</h1>
        <p className="text-gray-600 mb-6">
          Unfortunately, your photographer application was not approved at this
          time. If you have questions, please contact us.
        </p>
        <a
          href="/"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Back to Home
        </a>
      </div>
    );
  }

  // Show application form
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-3">
              Become a Photographer 📸
            </h1>
            <p className="text-gray-600 text-lg">
              Join BrahFotos and start selling your surf photos
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <h3 className="font-semibold text-blue-900 mb-2">
              What you'll get:
            </h3>
            <ul className="space-y-1 text-sm text-blue-800">
              <li>✅ Upload unlimited surf photo galleries</li>
              <li>✅ Set your own prices and bundles</li>
              <li>✅ Earn 90% on every sale (we take 10% platform fee)</li>
              <li>✅ Track your sales and earnings</li>
              <li>✅ Direct payouts via Stripe</li>
            </ul>
          </div>

          <PhotographerApplicationForm
            userId={session.user.id!}
            userName={user.name}
            userEmail={user.email}
          />
        </div>
      </div>
    </div>
  );
}
