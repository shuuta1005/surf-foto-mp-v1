import { prisma } from "@/lib/db";
import { sampleData } from "@/db/sample-data";

async function seedUsers() {
  console.log("👤 Seeding users...");

  for (const user of sampleData.users) {
    const existingUser = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (!existingUser) {
      await prisma.user.create({ data: user });
      console.log(`✅ Seeded user: ${user.name}`);
    } else {
      console.log(`⚠️ User already exists: ${user.email}`);
    }
  }
}

async function seedGalleries() {
  console.log("🖼️ Seeding galleries...");

  for (const gallery of sampleData.galleries) {
    const existingGallery = await prisma.gallery.findFirst({
      where: { name: gallery.name },
    });

    if (!existingGallery) {
      const photos = Array.from({ length: 15 }).map((_, index) => ({
        title: `Photo ${index + 1}`,
        photoUrl: `/${gallery.folder}/photo-${index + 1}.jpg`,
      }));

      await prisma.gallery.create({
        data: {
          name: gallery.name,
          location: gallery.location,
          coverImage: gallery.coverImage, // ✅ Manually set cover image
          photos: { create: photos },
        },
      });

      console.log(`✅ Seeded gallery: ${gallery.name}`);
    } else {
      console.log(`⚠️ Gallery already exists: ${gallery.name}`);
    }
  }
}

async function main() {
  await seedUsers();
  await seedGalleries();
  console.log("🎉 Seeding complete!");
}

main()
  .catch((e) => console.error("❌ Error seeding database:", e))
  .finally(async () => {
    await prisma.$disconnect();
  });
