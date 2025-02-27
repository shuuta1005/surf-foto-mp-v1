import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create 50 galleries
  const galleries = await prisma.gallery.createMany({
    data: Array.from({ length: 50 }).map((_, i) => ({
      id: `gallery-${i + 1}`,
      name: `Gallery ${i + 1}`,
      location: `Location ${i % 5}`,
      photographerId: `photographer-${(i % 10) + 1}`,
    })),
  });

  console.log(`✅ Created ${galleries.count} galleries`);

  // Create 500 photos, spread across galleries
  const photos = await prisma.photo.createMany({
    data: Array.from({ length: 500 }).map((_, i) => ({
      galleryId: `gallery-${(i % 50) + 1}`,
      photoUrl: `https://example.com/photo-${i + 1}.jpg`,
      title: `Photo ${i + 1}`,
    })),
  });

  console.log(`✅ Created ${photos.count} photos`);
}

main()
  .catch((error) => {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
