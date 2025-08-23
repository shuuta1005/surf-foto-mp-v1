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

    // This part is weird, but here's what it does:
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
      //“If it's an array, grab the first item. Otherwise, use it as is.”

      prefecture: fields.prefecture,
      area: fields.area,
      surfSpot: fields.surfSpot,
      date: fields.date,
      sessionTime: fields.sessionTime,
    };

    //This uses the Zod schema to check that the form input is correct.
    //safeParse(data) tries to validate the fields.
    const parsed = uploadGallerySchema.safeParse(data); //TODO: Review zod schemas

    if (!parsed.success) {
      //If validation fails, you return an error.
      return NextResponse.json(
        { error: "Invalid form data", details: parsed.error.format() },
        { status: 400 }
      );
    }

    //Now you can use the cleaned and validated values from the form.
    const { prefecture, area, surfSpot, date, sessionTime } = parsed.data;

    //→ If coverPhoto is an array, grab the first image. If not, just use it directly.
    const coverPhotoFile = Array.isArray(files.coverPhoto)
      ? files.coverPhoto[0]
      : files.coverPhoto;

    //Simple check: if not no cover photo is updated return an error.

    if (!coverPhotoFile || !coverPhotoFile.filepath) {
      return NextResponse.json(
        { error: "Cover photo is required" },
        { status: 400 }
      );
    }

    //This makes sure photoFiles is always an array, even if there’s only one photo.
    const photoFiles = Array.isArray(files.photos)
      ? files.photos
      : files.photos
      ? [files.photos]
      : [];

    //Simple check: if no photos were uploaded, return an error.
    if (photoFiles.length === 0) {
      return NextResponse.json(
        { error: "No photos provided" },
        { status: 400 }
      );
    }

    const uploaded = await Promise.all(
      //Promise.all(...) = this runs a bunch of async tasks at the same time and waits until all of them are done.
      //“Run all the photo uploads at the same time. When they’re all done, give me the results.”
      photoFiles.map(async (file: FormidableFile, index: number) => {
        const { originalUrl, watermarkedUrl } =
          await uploadWithWatermarkAndOriginal(file);
        return {
          photoUrl: watermarkedUrl,
          originalUrl,
          // TODO: Remove `isCover` field from photo upload logic, Photo model, and any related UI or DB logic.
          // Reason: `coverPhoto` is now handled separately and isCover is unused/redundant.
          // Steps:
          // 1. Remove `isCover` from the upload return object
          // 2. Remove `isCover` from Prisma schema
          // 3. Run `npx prisma migrate dev` or `db push`
          // 4. Search for any `.isCover` usage and clean up

          isCover: index === 0,
        };
      })
    );

    //Upload the cover photo (original only, no watermark)
    //If there is a cover photo uploaded, upload it and get the URL.
    // Save that as coverPhotoUrl.
    let coverPhotoUrl = "";
    if (coverPhotoFile && coverPhotoFile.filepath) {
      const { originalUrl } = await uploadWithWatermarkAndOriginal(
        coverPhotoFile
      );
      coverPhotoUrl = originalUrl;
    }

    // You’re now creating a new gallery in your database with:
    // 📍 prefecture, area, surfSpot
    // 📅 date, sessionTime
    // 🖼️ coverPhoto
    // 👤 photographerId
    // 📸 An array of photos (from the uploaded list)
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

    //If everything worked, you send a 201 Created response with the saved gallery info.
    return NextResponse.json({ gallery: newGallery }, { status: 201 });
  } catch (error) {
    console.error("❌ Upload failed:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
