// app/admin/upload/test-multi/page.tsx
"use client";

import { upload } from "@vercel/blob/client";
import { useState } from "react";

// Type for tracking individual file upload status
type FileUploadStatus = {
  file: File;
  status: "pending" | "uploading" | "success" | "error";
  url?: string;
  error?: string;
  mediaType?: "image" | "video";
};

export default function TestMultiUploadPage() {
  const [files, setFiles] = useState<FileUploadStatus[]>([]);
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState<{ url: string; mediaType: string }[]>(
    []
  );
  const [savingGallery, setSavingGallery] = useState(false);
  const [galleryCreated, setGalleryCreated] = useState<any>(null);

  // ─────────────────────────────────────────────────────────────
  // STEP 1: Handle file selection
  // ─────────────────────────────────────────────────────────────
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);

    if (selectedFiles.length === 0) return;

    // Initialize status for each file
    const fileStatuses: FileUploadStatus[] = selectedFiles.map((file) => ({
      file,
      status: "pending",
    }));

    setFiles(fileStatuses);
    setResults([]);
    setGalleryCreated(null);

    console.log(`📁 Selected ${selectedFiles.length} files`);
  };

  // ─────────────────────────────────────────────────────────────
  // STEP 2: Upload files ONE BY ONE (sequential, safer)
  // ─────────────────────────────────────────────────────────────
  const handleUploadAll = async () => {
    if (files.length === 0) return;

    setUploading(true);
    const uploadedFiles: { url: string; mediaType: string }[] = [];

    console.log(`🚀 Starting upload of ${files.length} files...`);

    // Upload files sequentially (one at a time)
    for (let i = 0; i < files.length; i++) {
      const fileStatus = files[i];

      // Update UI: Mark as uploading
      setFiles((prev) =>
        prev.map((f, idx) =>
          idx === i ? { ...f, status: "uploading" as const } : f
        )
      );

      try {
        console.log(
          `⬆️  Uploading ${i + 1}/${files.length}: ${fileStatus.file.name}`
        );

        // THE MAGIC: Direct upload to Blob
        const blob = await upload(fileStatus.file.name, fileStatus.file, {
          access: "public",
          handleUploadUrl: "/api/blob/upload",
        });

        // Determine media type from content type
        const mediaType = blob.contentType?.startsWith("video/")
          ? "video"
          : "image";

        console.log(`✅ Success: ${blob.url}`);

        // Update UI: Mark as success
        setFiles((prev) =>
          prev.map((f, idx) =>
            idx === i
              ? { ...f, status: "success" as const, url: blob.url, mediaType }
              : f
          )
        );

        // Collect result
        uploadedFiles.push({
          url: blob.url,
          mediaType,
        });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Upload failed";

        console.error(`❌ Failed: ${fileStatus.file.name}`, errorMessage);

        // Update UI: Mark as error (but continue uploading others!)
        setFiles((prev) =>
          prev.map((f, idx) =>
            idx === i
              ? { ...f, status: "error" as const, error: errorMessage }
              : f
          )
        );
      }

      // Small delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    setUploading(false);
    setResults(uploadedFiles);

    console.log(
      `🏁 Upload complete: ${uploadedFiles.length}/${files.length} successful`
    );
  };

  // ─────────────────────────────────────────────────────────────
  // STEP 3: Create gallery in database with uploaded files
  // ─────────────────────────────────────────────────────────────
  const handleCreateGallery = async () => {
    if (results.length === 0) {
      alert("No uploaded files to save!");
      return;
    }

    setSavingGallery(true);

    try {
      console.log("💾 Creating gallery in database...");

      const response = await fetch("/api/admin/galleries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // Location & Session (use dummy data for testing)
          prefecture: "千葉県",
          area: "千葉北",
          surfSpot: "志田下",
          date: new Date().toISOString(),
          sessionTime: "08:00 - 11:00",

          // Uploaded files
          uploadedFiles: results,

          // Optional
          basePrice: 1000,
          isEpic: false,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create gallery");
      }

      console.log("✅ Gallery created:", data.gallery);
      setGalleryCreated(data.gallery);
      alert(`Gallery created successfully! ID: ${data.gallery.id}`);
    } catch (error) {
      console.error("❌ Gallery creation failed:", error);
      alert(
        `Failed to create gallery: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setSavingGallery(false);
    }
  };

  // ─────────────────────────────────────────────────────────────
  // HELPER: Calculate progress
  // ─────────────────────────────────────────────────────────────
  const successCount = files.filter((f) => f.status === "success").length;
  const errorCount = files.filter((f) => f.status === "error").length;
  const pendingCount = files.filter((f) => f.status === "pending").length;
  const uploadingCount = files.filter((f) => f.status === "uploading").length;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h1 className="text-2xl font-bold mb-2">
            🚀 Phase 4: Complete Upload & Save Flow
          </h1>
          <p className="text-gray-600">
            Upload files → Save gallery to database
          </p>
        </div>

        {/* File Selection */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <label className="block mb-4">
            <span className="text-sm font-medium text-gray-700 mb-2 block">
              Select multiple photos/videos:
            </span>
            <input
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleFileSelect}
              disabled={uploading || savingGallery}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100
                disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </label>

          {/* Upload Button */}
          {files.length > 0 && !uploading && results.length === 0 && (
            <button
              onClick={handleUploadAll}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-semibold hover:bg-blue-700 transition"
            >
              📤 Upload {files.length} Files to Blob
            </button>
          )}

          {/* Progress Summary */}
          {uploading && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <div className="flex items-center mb-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-700 mr-3"></div>
                <span className="text-blue-700 font-medium">
                  Uploading files to Blob...
                </span>
              </div>
              <div className="text-sm text-blue-600">
                ✅ Success: {successCount} | ❌ Failed: {errorCount} | ⏳
                Pending: {pendingCount} | 📤 Uploading: {uploadingCount}
              </div>
            </div>
          )}

          {/* Final Upload Results */}
          {!uploading && results.length > 0 && !galleryCreated && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
              <h3 className="text-green-800 font-semibold mb-2">
                ✅ Upload Complete!
              </h3>
              <p className="text-sm text-green-700">
                Successfully uploaded {results.length} out of {files.length}{" "}
                files to Blob
              </p>
              {errorCount > 0 && (
                <p className="text-sm text-orange-600 mt-1">
                  ⚠️ {errorCount} files failed (see list below)
                </p>
              )}
            </div>
          )}

          {/* Gallery Creation Success */}
          {galleryCreated && (
            <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-md">
              <h3 className="text-purple-800 font-semibold mb-2">
                🎉 Gallery Saved to Database!
              </h3>
              <div className="text-sm text-purple-700 space-y-1">
                <p>
                  <strong>Gallery ID:</strong> {galleryCreated.id}
                </p>
                <p>
                  <strong>Surf Spot:</strong> {galleryCreated.surfSpot}
                </p>
                <p>
                  <strong>Photos/Videos:</strong> {galleryCreated.photoCount}
                </p>
                <p>
                  <strong>Has Video:</strong>{" "}
                  {galleryCreated.hasVideo ? "🎥 Yes" : "📸 No"}
                </p>
                <p>
                  <strong>Status:</strong> {galleryCreated.status}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Save to Database Button */}
        {results.length > 0 && !galleryCreated && (
          <div className="mb-6">
            <button
              onClick={handleCreateGallery}
              disabled={savingGallery}
              className="w-full bg-green-600 text-white py-4 px-4 rounded-md font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {savingGallery ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Saving to Database...
                </span>
              ) : (
                `💾 Save Gallery to Database (${results.length} files)`
              )}
            </button>
          </div>
        )}

        {/* File Status List */}
        {files.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="font-semibold mb-4">Files ({files.length})</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {files.map((fileStatus, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-md border ${
                    fileStatus.status === "success"
                      ? "bg-green-50 border-green-200"
                      : fileStatus.status === "error"
                      ? "bg-red-50 border-red-200"
                      : fileStatus.status === "uploading"
                      ? "bg-blue-50 border-blue-200"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {fileStatus.file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(fileStatus.file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <div className="ml-4">
                      {fileStatus.status === "pending" && (
                        <span className="text-xs text-gray-500">
                          ⏳ Pending
                        </span>
                      )}
                      {fileStatus.status === "uploading" && (
                        <span className="text-xs text-blue-600">
                          📤 Uploading...
                        </span>
                      )}
                      {fileStatus.status === "success" && (
                        <span className="text-xs text-green-600">
                          ✅ Success
                        </span>
                      )}
                      {fileStatus.status === "error" && (
                        <span className="text-xs text-red-600">❌ Failed</span>
                      )}
                    </div>
                  </div>

                  {/* Show URL on success */}
                  {fileStatus.status === "success" && fileStatus.url && (
                    <div className="mt-2 p-2 bg-white rounded border border-green-300">
                      <p className="text-xs text-gray-500 mb-1">
                        {fileStatus.mediaType === "video"
                          ? "🎥 Video"
                          : "🖼️ Image"}
                      </p>
                      <code className="text-xs break-all text-gray-700">
                        {fileStatus.url}
                      </code>
                    </div>
                  )}

                  {/* Show error on failure */}
                  {fileStatus.status === "error" && fileStatus.error && (
                    <p className="mt-2 text-xs text-red-600">
                      Error: {fileStatus.error}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <h3 className="text-yellow-800 font-semibold mb-2">
            📋 Complete Test Flow:
          </h3>
          <ol className="text-sm text-yellow-700 space-y-2 list-decimal list-inside">
            <li>Select 5-10 files (mix of images and videos if possible)</li>
            <li>Click "📤 Upload X Files to Blob" and wait for completion</li>
            <li>Verify all files show green checkmarks</li>
            <li>Click "💾 Save Gallery to Database"</li>
            <li>Wait for success message</li>
            <li>
              Open Prisma Studio to verify:{" "}
              <code className="bg-yellow-100 px-1 rounded">
                npx prisma studio
              </code>
            </li>
            <li>Check Gallery table → See your new gallery</li>
            <li>Check Photo table → See all uploaded media files</li>
          </ol>
        </div>

        {/* Results JSON (for debugging) */}
        {results.length > 0 && (
          <div className="bg-gray-100 rounded-lg p-4">
            <h3 className="text-sm font-semibold mb-2">
              📋 Upload Results JSON:
            </h3>
            <pre className="text-xs overflow-x-auto bg-white p-3 rounded border">
              {JSON.stringify(results, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
