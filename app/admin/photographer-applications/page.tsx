// app/admin/photographer-applications/page.tsx

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ApplicationCard from "./ApplicationCard";

async function getPendingApplications() {
  return await prisma.user.findMany({
    where: {
      photographerStatus: "PENDING",
    },
    select: {
      id: true,
      name: true,
      email: true,
      bio: true,
      portfolioLink: true,
      applicationSubmittedAt: true,
      createdAt: true,
    },
    orderBy: {
      applicationSubmittedAt: "desc",
    },
  });
}

export default async function PhotographerApplicationsPage() {
  const session = await auth();

  // Only admins can access
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/admin");
  }

  const applications = await getPendingApplications();

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Photographer Applications</h1>
          <p className="text-gray-600 mt-1">
            {applications.length} pending application
            {applications.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link href="/admin">
          <Button variant="outline">← Back to Dashboard</Button>
        </Link>
      </div>

      {/* Applications List */}
      {applications.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="text-6xl mb-4">📭</div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            No Pending Applications
          </h2>
          <p className="text-gray-600">All applications have been reviewed!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <ApplicationCard key={app.id} application={app} />
          ))}
        </div>
      )}
    </div>
  );
}
