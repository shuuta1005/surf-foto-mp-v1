// app/apply-photographer/PhotographerApplicationForm.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface Props {
  userId: string;
  userName: string;
  userEmail: string;
}

export default function PhotographerApplicationForm({
  userId,
  userName,
  userEmail,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [portfolioLink, setPortfolioLink] = useState("");
  const [bio, setBio] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (!bio.trim()) {
      setError("Please tell us about yourself and why you want to join");
      return;
    }

    if (bio.trim().length < 50) {
      setError("Please write at least 50 characters about yourself");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/photographer-application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          portfolioLink: portfolioLink.trim() || null,
          bio: bio.trim(),
        }),
      });

      if (res.ok) {
        router.push("/application-submitted");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "Failed to submit application");
      }
    } catch (err) {
      console.error("Error submitting application:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Pre-filled info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Name
          </label>
          <input
            type="text"
            value={userName}
            disabled
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            value={userEmail}
            disabled
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
          />
        </div>
      </div>

      {/* Portfolio Link */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Portfolio Link <span className="text-gray-500">(Optional)</span>
        </label>
        <input
          type="url"
          value={portfolioLink}
          onChange={(e) => setPortfolioLink(e.target.value)}
          placeholder="https://instagram.com/yourhandle or your website"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          disabled={loading}
        />
        <p className="text-xs text-gray-500 mt-1">
          Instagram, personal website, or any link to your surf photography
        </p>
      </div>

      {/* Bio / Why Join */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          About You & Why You Want to Join{" "}
          <span className="text-red-500">*</span>
        </label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Tell us about your surf photography experience and why you want to join BrahFotos..."
          rows={8}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          disabled={loading}
          required
        />
        <p className="text-xs text-gray-500 mt-1">
          {bio.length}/50 characters minimum • Share your experience, favorite
          spots, style, etc.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Terms */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-600">
        <p className="font-medium mb-2">By submitting this application:</p>
        <ul className="space-y-1 text-xs">
          <li>
            ✓ You confirm that all photos you upload are your own original work
          </li>
          <li>✓ You agree to BrahFotos' 10% platform fee on all sales</li>
          <li>
            ✓ You understand that galleries require admin approval before going
            live
          </li>
          <li>
            ✓ You'll receive payouts via Stripe (setup required after approval)
          </li>
        </ul>
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={loading || !bio.trim() || bio.length < 50}
        className="w-full"
        size="lg"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            Submitting Application...
          </>
        ) : (
          "Submit Application 🚀"
        )}
      </Button>
    </form>
  );
}
