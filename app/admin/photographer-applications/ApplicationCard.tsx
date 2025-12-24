// app/admin/photographer-applications/ApplicationCard.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, Check, X, ExternalLink } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Application {
  id: string;
  name: string;
  email: string;
  bio: string | null;
  portfolioLink: string | null;
  applicationSubmittedAt: Date | null;
  createdAt: Date;
}

interface Props {
  application: Application;
}

export default function ApplicationCard({ application }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState<"approve" | "reject" | null>(null);

  const handleApprove = async () => {
    if (!confirm(`Approve ${application.name} as a photographer?`)) return;

    setAction("approve");
    setLoading(true);

    try {
      const res = await fetch(
        `/api/photographer-application/${application.id}/approve`,
        {
          method: "POST",
        }
      );

      if (res.ok) {
        alert(`✅ ${application.name} is now a photographer!`);
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to approve application");
      }
    } catch (error) {
      console.error("Error approving application:", error);
      alert("An error occurred");
    } finally {
      setLoading(false);
      setAction(null);
    }
  };

  const handleReject = async () => {
    if (!confirm(`Reject ${application.name}'s application?`)) return;

    setAction("reject");
    setLoading(true);

    try {
      const res = await fetch(
        `/api/photographer-application/${application.id}/reject`,
        {
          method: "POST",
        }
      );

      if (res.ok) {
        alert(`Application from ${application.name} has been rejected`);
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to reject application");
      }
    } catch (error) {
      console.error("Error rejecting application:", error);
      alert("An error occurred");
    } finally {
      setLoading(false);
      setAction(null);
    }
  };

  const submittedTime = application.applicationSubmittedAt
    ? formatDistanceToNow(new Date(application.applicationSubmittedAt), {
        addSuffix: true,
      })
    : "Unknown";

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            {application.name}
          </h3>
          <p className="text-sm text-gray-600">{application.email}</p>
          <p className="text-xs text-gray-500 mt-1">Applied {submittedTime}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={handleApprove}
            disabled={loading}
            size="sm"
            className="bg-green-600 hover:bg-green-700"
          >
            {loading && action === "approve" ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Check className="w-4 h-4 mr-1" />
                Approve
              </>
            )}
          </Button>

          <Button
            onClick={handleReject}
            disabled={loading}
            size="sm"
            variant="destructive"
          >
            {loading && action === "reject" ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <X className="w-4 h-4 mr-1" />
                Reject
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Portfolio Link */}
      {application.portfolioLink && (
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700 block mb-1">
            Portfolio
          </label>
          <a
            href={application.portfolioLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline text-sm flex items-center gap-1"
          >
            {application.portfolioLink}
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}

      {/* Bio */}
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-2">
          About / Why They Want to Join
        </label>
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-800 whitespace-pre-wrap">
            {application.bio || "No bio provided"}
          </p>
        </div>
      </div>

      {/* Member Since */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          User since {new Date(application.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
