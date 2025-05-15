// app/api/admin/upload-gallery/route.ts

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { IncomingMessage } from "http";
import { Readable } from "stream";
import formidable, { File as FormidableFile } from "formidable";
import { uploadWithWatermarkAndOriginal } from "@/lib/blob-watermark";

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

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const readable = await streamRequest(req);
    const { fields, files } = await parseForm(readable);

    const prefecture = Array.isArray(fields.prefecture)
      ? fields.prefecture[0]
      : fields.prefecture;
    const area = Array.isArray(fields.area) ? fields.area[0] : fields.area;
    const surfSpot = Array.isArray(fields.surfSpot)
      ? fields.surfSpot[0]
      : fields.surfSpot;
    const date = Array.isArray(fields.date) ? fields.date[0] : fields.date;
    const sessionTime = Array.isArray(fields.sessionTime)
      ? fields.sessionTime[0]
      : fields.sessionTime;

    const coverPhotoFile = Array.isArray(files.coverPhoto)
      ? files.coverPhoto[0]
      : files.coverPhoto;

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

    let coverPhotoUrl: string | undefined = undefined;
    if (coverPhotoFile) {
      if (!coverPhotoFile.filepath) {
        throw new Error("Cover photo file is missing a filepath");
      }
      const { originalUrl } = await uploadWithWatermarkAndOriginal(
        coverPhotoFile
      );
      coverPhotoUrl = originalUrl;
    }

    const newGallery = await prisma.gallery.create({
      data: {
        prefecture: String(prefecture),
        area: String(area),
        surfSpot: String(surfSpot),
        date: new Date(String(date)),
        sessionTime: sessionTime || "",
        coverPhoto: coverPhotoUrl || "",
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
