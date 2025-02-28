import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding multiple galleries using local images...");

  const galleries = [
    { name: "Ichinomiya", folder: "fake-gallery-1", location: "千葉北" },
    { name: "Torami", folder: "fake-gallery-2", location: "千葉北" },
    { name: "Kugenuma", folder: "fake-gallery-3", location: "湘南" },
    { name: "Kamogawa", folder: "fake-gallery-4", location: "千葉南" },
    { name: "Maroubra ", folder: "fake-gallery-5", location: "Sydney" },
  ];

  for (const gallery of galleries) {
    // Generate photo URLs assuming filenames are photo-1.jpg to photo-15.jpg
    const photos = Array.from({ length: 15 }).map((_, index) => ({
      title: `Photo ${index + 1}`,
      photoUrl: `/${gallery.folder}/photo-${index + 1}.jpg`, // Use the folder name dynamically
    }));

    await prisma.gallery.create({
      data: {
        name: gallery.name,
        location: gallery.location,
        photos: {
          create: photos,
        },
      },
    });

    console.log(`Seeded: ${gallery.name}`);
  }

  console.log("Seeding complete! Check your frontend!");
}

main()
  .catch((e) => console.error("Error seeding database:", e))
  .finally(async () => {
    await prisma.$disconnect();
  });
