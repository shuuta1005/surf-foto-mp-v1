// app/api/admin/upload-gallery/route.ts

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { IncomingMessage } from "http";
import { Readable } from "stream";
import formidable, { File as FormidableFile } from "formidable";
import { uploadWithWatermarkAndOriginal } from "@/lib/blob-watermark";
import { uploadGallerySchema } from "@/lib/validations/validation";
import type { Fields, Files } from "formidable";

export const runtime = "nodejs";

function parseFormData(
  req: Request
): Promise<{ fields: Fields; files: Files }> {
  return new Promise(async (resolve, reject) => {
    const reader = req.body?.getReader();
    if (!reader) return reject("No readable stream");

    const chunks: Uint8Array[] = [];
    let done = false;
    while (!done) {
      const { value, done: readerDone } = await reader.read();
      if (value) chunks.push(value);
      done = readerDone;
    }

    const buffer = Buffer.concat(chunks);
    const stream = Readable.from(buffer);
    Object.assign(stream, {
      headers: {
        "content-type": req.headers.get("content-type") || "",
        "content-length": buffer.length.toString(),
      },
    });

    const form = formidable({ multiples: true, keepExtensions: true });
    form.parse(stream as IncomingMessage, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { fields, files } = await parseFormData(req);

    // ✅ Extract metadata + pricing
    const rawData = {
      prefecture: Array.isArray(fields.prefecture)
        ? fields.prefecture[0]
        : fields.prefecture,
      area: Array.isArray(fields.area) ? fields.area[0] : fields.area,
      surfSpot: Array.isArray(fields.surfSpot)
        ? fields.surfSpot[0]
        : fields.surfSpot,
      date: Array.isArray(fields.date) ? fields.date[0] : fields.date,
      sessionTime: Array.isArray(fields.sessionTime)
        ? fields.sessionTime[0]
        : fields.sessionTime,
      price: Array.isArray(fields.price) ? fields.price[0] : fields.price,
      tiers: Array.isArray(fields.tiers) ? fields.tiers[0] : fields.tiers,
    };

    const parsed = uploadGallerySchema.safeParse(rawData);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid form data", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { prefecture, area, surfSpot, date, sessionTime, price, tiers } =
      parsed.data;

    // ✅ Parse tiers JSON
    let parsedTiers: { quantity: number; price: number }[] = [];
    try {
      parsedTiers = tiers ? JSON.parse(tiers) : [];
    } catch {
      parsedTiers = [];
    }

    // ✅ Cover photo: only original, no watermark
    const coverPhotoFile = Array.isArray(files.coverPhoto)
      ? files.coverPhoto[0]
      : files.coverPhoto;
    if (!coverPhotoFile?.filepath) {
      return NextResponse.json(
        { error: "Cover photo is required" },
        { status: 400 }
      );
    }

    const { originalUrl: coverPhotoUrl } = await uploadWithWatermarkAndOriginal(
      coverPhotoFile
    );

    // ✅ Gallery photos: watermark + original
    const photoFiles = Array.isArray(files.photos)
      ? files.photos
      : files.photos
      ? [files.photos]
      : [];
    if (photoFiles.length === 0) {
      return NextResponse.json(
        { error: "No photos provided" },
        { status: 400 }
      );
    }

    const uploaded = await Promise.all(
      photoFiles.map(async (file: FormidableFile) => {
        const { originalUrl, watermarkedUrl } =
          await uploadWithWatermarkAndOriginal(file);
        return {
          photoUrl: watermarkedUrl,
          originalUrl,
          price: Number(price), // Individual photo price (same as base)
        };
      })
    );

    // ✅ Save gallery with photos + pricing tiers
    const newGallery = await prisma.gallery.create({
      data: {
        prefecture,
        area,
        surfSpot,
        date: new Date(date),
        sessionTime,
        coverPhoto: coverPhotoUrl,
        photographerId: session.user.id,
        isPublic: true,
        price: Number(price), // 🔥 THIS WAS MISSING! Add base price to gallery
        photos: { create: uploaded },
        pricingTiers: {
          create: parsedTiers.map((t) => ({
            quantity: t.quantity,
            price: t.price,
          })),
        },
      },
      include: {
        photos: true,
        pricingTiers: true,
      },
    });

    return NextResponse.json({ gallery: newGallery }, { status: 201 });
  } catch (error) {
    console.error("❌ Upload failed:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
// 📋 Mobile (and Safari) Upload Optimization To-Do List
// 🔧 Frontend Improvements
// [ ] Add image size check before upload Warn users if the photo exceeds a mobile-safe threshold (e.g. 5MB).

// [ ] Implement client-side image compression Use canvas or ImageBitmap to resize large images before uploading.

// [ ] Add upload progress indicator Show a progress bar or spinner to reassure users during upload.

// [ ] Improve error handling for mobile uploads Catch and display specific errors (e.g. timeout, file too large, unsupported format).

// 📱 Mobile-Specific UX
// [ ] Detect mobile device and adjust UI Use navigator.userAgent or similar to tailor messages and limits.

// [ ] Add mobile upload tips Suggest using Wi-Fi or switching to desktop for large files.

// [ ] Prevent background suspension issues Consider chunked uploads or direct-to-storage to avoid browser suspensions.

// 🧪 Testing & Debugging
// [ ] Test uploads on Safari and Chrome (iOS) Try with different image sizes and network conditions.

// [ ] Log upload failures with device info Capture browser, OS, and error type for debugging.

// [ ] Simulate slow network conditions Use dev tools to throttle and observe mobile behavior.
