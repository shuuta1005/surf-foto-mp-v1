import { prisma } from "@/lib/db";

async function deleteAllGalleries() {
  try {
    // Step 1: Delete all photos
    await prisma.photo.deleteMany({});

    // Step 2: Delete all galleries
    await prisma.gallery.deleteMany({});

    console.log("✅ Successfully deleted all photos and galleries.");
  } catch (error) {
    console.error("❌ Failed to delete galleries:", error);
  } finally {
    await prisma.$disconnect();
  }
}

deleteAllGalleries();
