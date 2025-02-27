import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { name, location, photographerId } = await req.json();

    const newGallery = await prisma.gallery.create({
      data: { name, location, photographerId },
    });

    return NextResponse.json(newGallery);
  } catch (error) {
    console.error("Error creating gallery:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const galleries = await prisma.gallery.findMany();
    return NextResponse.json(galleries);
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: "Failed to fetch galleries" },
      { status: 500 }
    );
  }
}
