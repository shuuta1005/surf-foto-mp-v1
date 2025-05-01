// app/api/admin/upload-gallery/route.ts
// app/api/admin/upload-gallery/route.ts

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { IncomingMessage } from "http";
import { Readable } from "stream";
import formidable, { File as FormidableFile } from "formidable";
import { uploadWithWatermarkAndOriginal } from "@/lib/blob-watermark";

// ✅ Required: use Node.js runtime to support form parsing
export const runtime = "nodejs";

async function streamRequest(req: Request): Promise<Readable> {
  const reader = req.body?.getReader();
  if (!reader) throw new Error("No readable stream");

  const chunks: Uint8Array[] = [];
  let done = false;

  while (!done) {
    const { value, done: readerDone } = await reader.read();
    if (value) chunks.push(value);
    done = readerDone;
  }

  const buffer = Buffer.concat(chunks);
  const readable = Readable.from(buffer);

  Object.assign(readable, {
    headers: {
      "content-type": req.headers.get("content-type") || "",
      "content-length": buffer.length.toString(),
    },
  });

  return readable;
}

// ✅ Parse multipart form data
async function parseForm(readable: Readable): Promise<{
  fields: formidable.Fields;
  files: formidable.Files;
}> {
  const form = formidable({
    multiples: true,
    keepExtensions: true,
  });

  return new Promise((resolve, reject) => {
    form.parse(readable as IncomingMessage, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}

// ✅ Handle POST request
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const readable = await streamRequest(req);
    const { fields, files } = await parseForm(readable);

    const { prefecture, area, surfSpot, date } = fields;

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
      photoFiles.map(async (file: FormidableFile, index: number) => {
        const { originalUrl, watermarkedUrl } =
          await uploadWithWatermarkAndOriginal(file);
        return {
          photoUrl: watermarkedUrl,
          originalUrl,
          isCover: index === 0,
        };
      })
    );

    const newGallery = await prisma.gallery.create({
      data: {
        prefecture: String(prefecture),
        area: String(area),
        surfSpot: String(surfSpot),
        date: new Date(String(date)),
        photographerId: session.user.id,
        isPublic: true,
        photos: {
          create: uploaded,
        },
      },
    });

    return NextResponse.json({ gallery: newGallery }, { status: 201 });
  } catch (error) {
    console.error("Upload failed:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
