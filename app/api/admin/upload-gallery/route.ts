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

// It takes the incoming request (req) — which includes:
// fields like “surfSpot”, “area”, etc.
// and uploaded files (images)
// Then it parses them and gives you back two things:
// fields = the text data
// files = the images

function parseFormData(
  //Parse = break something down and understand it.
  req: Request
): Promise<{ fields: Fields; files: Files }> {
  return new Promise(async (resolve, reject) => {
    const reader = req.body?.getReader();
    if (!reader) return reject("No readable stream");

    // Think of this like this:
    // A form with photos is like water dripping from a pipe.
    // You read it chunk by chunk (little pieces of data).
    // chunks.push(value) → Save each chunk into an array.
    // At the end, you’ll have all the data saved in chunks.

    const chunks: Uint8Array[] = [];
    let done = false;
    while (!done) {
      const { value, done: readerDone } = await reader.read();
      if (value) chunks.push(value);
      done = readerDone;
    }

    //Now that you have lots of small pieces (chunks), you stick them together to make one full thing.
    const buffer = Buffer.concat(chunks);

    // You turn that full buffer into a stream (like a pipe that Formidable can drink from).
    // Then you manually attach some “headers” to this stream — so Formidable knows what kind of data it's getting.
    const stream = Readable.from(buffer);
    Object.assign(stream, {
      headers: {
        "content-type": req.headers.get("content-type") || "",
        "content-length": buffer.length.toString(),
      },
    });

    // formidable(...) → Creates a new form parser.
    // multiples: true → Means you’re allowing multiple files
    // keepExtensions: true → Keeps .jpg, .png, etc.
    // form.parse(...) → This is the magic that reads the stream and gives back:
    // fields → like area: "千葉北", date: "2024-01-01"
    // files → the actual uploaded image files
    // If parsing fails → reject(err)
    // If parsing succeeds → resolve({ fields, files })
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

    const data = {
      prefecture: Array.isArray(fields.prefecture) ? fields.prefecture[0] : fields.prefecture,
      area: Array.isArray(fields.area) ? fields.area[0] : fields.area,
      surfSpot: Array.isArray(fields.surfSpot) ? fields.surfSpot[0] : fields.surfSpot,
      date: Array.isArray(fields.date) ? fields.date[0] : fields.date,
      sessionTime: Array.isArray(fields.sessionTime) ? fields.sessionTime[0] : fields.sessionTime,
    };

    const parsed = uploadGallerySchema.safeParse(data);
    if (!parsed.success) {
      console.error("❌ Invalid form data:", parsed.error.format());
      return NextResponse.json(
        { error: "Invalid form data", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { prefecture, area, surfSpot, date, sessionTime } = parsed.data;

    const coverPhotoFile = Array.isArray(files.coverPhoto)
      ? files.coverPhoto[0]
      : files.coverPhoto;

    if (!coverPhotoFile || !coverPhotoFile.filepath) {
      return NextResponse.json(
        { error: "Cover photo is required" },
        { status: 400 }
      );
    }

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
        const { originalUrl, watermarkedUrl } = await uploadWithWatermarkAndOriginal(file);
        return {
          photoUrl: watermarkedUrl,
          originalUrl,
        };
      })
    );

    let coverPhotoUrl = "";
    if (coverPhotoFile && coverPhotoFile.filepath) {
      const { originalUrl } = await uploadWithWatermarkAndOriginal(coverPhotoFile);
      coverPhotoUrl = originalUrl;
    }

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
        photos: {
          create: uploaded,
        },
      },
    });

    console.log("✅ Gallery created:", newGallery.id);
    return NextResponse.json({ gallery: newGallery }, { status: 201 });
  } catch (error) {
    console.error("❌ Upload failed:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
