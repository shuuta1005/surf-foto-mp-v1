// app/api/blob/upload/route.ts
// ═══════════════════════════════════════════════════════════════
// BLOB UPLOAD TOKEN ENDPOINT
// Purpose: Generate secure upload tokens for direct-to-blob uploads
// Security: Admin-only access
// ═══════════════════════════════════════════════════════════════

import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { config as authOptions } from "@/auth";

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        // ─────────────────────────────────────────────────────────
        // SECURITY CHECK: Only admins can upload
        // ─────────────────────────────────────────────────────────
        const session = await getServerSession(authOptions);

        if (!session?.user) {
          throw new Error("Unauthorized: No session found");
        }

        if (session.user.role !== "ADMIN") {
          throw new Error("Unauthorized: Admin access required");
        }

        // ─────────────────────────────────────────────────────────
        // FILE TYPE VALIDATION
        // ─────────────────────────────────────────────────────────
        const allowedTypes = [
          // Images
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/webp",
          "image/heic",
          "image/heif",
          // Videos
          "video/mp4",
          "video/quicktime", // .mov files
          "video/x-msvideo", // .avi files
        ];

        // clientPayload is optional metadata sent from the browser
        const fileType = (clientPayload as { type?: string })?.type;

        if (fileType && !allowedTypes.includes(fileType)) {
          throw new Error(
            `Invalid file type: ${fileType}. Only images and videos allowed.`
          );
        }

        // ─────────────────────────────────────────────────────────
        // RETURN: Allow upload with metadata
        // ─────────────────────────────────────────────────────────
        return {
          allowedContentTypes: allowedTypes,
          // Optional: Add metadata to the blob
          tokenPayload: JSON.stringify({
            uploadedBy: session.user.id,
            uploadedAt: new Date().toISOString(),
          }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // ─────────────────────────────────────────────────────────
        // OPTIONAL: Log successful uploads
        // ─────────────────────────────────────────────────────────
        console.log("✓ Blob uploaded:", blob.url);

        // You could also:
        // - Send a webhook
        // - Update a database
        // - Trigger a background job
        // But for now, we keep it simple
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error: unknown) {
    // ─────────────────────────────────────────────────────────────
    // ERROR HANDLING
    // ─────────────────────────────────────────────────────────────
    const errorMessage =
      error instanceof Error ? error.message : "Upload failed";

    console.error("Blob upload error:", errorMessage);

    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}
