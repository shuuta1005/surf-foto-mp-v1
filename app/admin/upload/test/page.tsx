// app/admin/upload/test/page.tsx
"use client";

import { upload } from "@vercel/blob/client";
import { useState } from "react";

export default function TestUploadPage() {
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset state
    setUploading(true);
    setResult(null);
    setError(null);

    try {
      console.log("🚀 Starting upload...", file.name);

      // ─────────────────────────────────────────────────────────
      // THE MAGIC: Upload directly to Blob (bypasses your server)
      // ─────────────────────────────────────────────────────────
      const blob = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/blob/upload",
      });

      console.log("✅ Upload complete!");
      console.log("📎 Blob URL:", blob.url);
      console.log("📦 Full blob object:", blob);

      setResult(blob.url);
    } catch (err) {
      console.error("❌ Upload failed:", err);
      const errorMessage = err instanceof Error ? err.message : "Upload failed";
      setError(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h1 className="text-2xl font-bold mb-2">
            🧪 Phase 2: Test Direct Upload
          </h1>
          <p className="text-gray-600">
            Upload a single file to prove Blob upload works
          </p>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <label className="block mb-4">
            <span className="text-sm font-medium text-gray-700 mb-2 block">
              Select a photo or video:
            </span>
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleFileSelect}
              disabled={uploading}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100
                disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </label>

          {/* Loading State */}
          {uploading && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-700 mr-3"></div>
                <span className="text-blue-700 font-medium">
                  Uploading to Blob...
                </span>
              </div>
            </div>
          )}

          {/* Success State */}
          {result && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
              <h3 className="text-green-800 font-semibold mb-2">
                ✅ Upload Successful!
              </h3>
              <p className="text-sm text-green-700 mb-2">
                File uploaded directly to Vercel Blob (your server never touched
                it!)
              </p>
              <div className="bg-white p-3 rounded border border-green-300">
                <p className="text-xs text-gray-500 mb-1">Blob URL:</p>
                <code className="text-xs break-all text-gray-800">
                  {result}
                </code>
              </div>
              <p className="text-xs text-green-600 mt-2">
                ✓ Check your browser console for full details
              </p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <h3 className="text-red-800 font-semibold mb-2">
                ❌ Upload Failed
              </h3>
              <p className="text-sm text-red-700">{error}</p>
              <p className="text-xs text-red-600 mt-2">
                Check browser console for more details
              </p>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="text-yellow-800 font-semibold mb-2">
            📋 What to Check:
          </h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Open browser DevTools (F12) → Console tab</li>
            <li>• Select a file and watch the console logs</li>
            <li>• You should see the Blob URL appear</li>
            <li>• Copy the URL and open it in a new tab to verify</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
