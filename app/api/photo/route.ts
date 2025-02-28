import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { galleryId, photoUrl, title } = await req.json();

    if (!galleryId || !photoUrl) {
      return NextResponse.json(
        { error: "Gallery ID and Photo URL are required" },
        { status: 400 }
      );
    }

    const gallery = await prisma.gallery.findUnique({
      where: { id: galleryId },
    });

    if (!gallery) {
      return NextResponse.json({ error: "Gallery not found" }, { status: 404 });
    }

    const newPhoto = await prisma.photo.create({
      data: { galleryId, photoUrl, title },
    });

    return NextResponse.json(newPhoto);
  } catch (error) {
    console.error("Error uploading photo:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
