// app/api/admin/upload-gallery/route.ts

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const user = await auth();

    // ✅ Ensure user is authenticated and has an ID
    if (!user || !user.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    //Reads JSON body of the request.
    // Grabs all the form values that were passed in from the client.

    const body = await req.json();
    const { prefecture, area, surfSpot, date, photoUrls } = body;

    // ✅ Validate photoUrls
    //This line checks if photoUrls is valid and not empty.
    // Is photoUrls not an array? If true, bail.
    if (!Array.isArray(photoUrls) || photoUrls.length === 0) {
      return NextResponse.json(
        { error: "No photos provided" },
        { status: 400 }
      );
    }

    // ✅ Create new gallery with photos
    const newGallery = await prisma.gallery.create({
      data: {
        prefecture,
        area,
        surfSpot,
        date: new Date(date),
        photographerId: user.user.id, // ✅ safe and guaranteed
        isPublic: true,
        photos: {
          create: photoUrls.map((url: string, index: number) => ({
            photoUrl: url,
            isCover: index === 0,
          })),
        },
      },
    });

    return NextResponse.json({ gallery: newGallery }, { status: 200 });
  } catch (err) {
    console.error("Upload failed:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
