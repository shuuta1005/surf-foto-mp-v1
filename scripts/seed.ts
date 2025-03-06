import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding multiple galleries using local images...");

  const galleries = [
    {
      name: "Ichinomiya",
      folder: "fake-gallery-1",
      location: "千葉北",
      coverImage: "/fake-gallery-1/photo-1.jpg", // ✅ Manually set cover image
    },
    {
      name: "Torami",
      folder: "fake-gallery-2",
      location: "千葉北",
      coverImage: "/fake-gallery-2/photo-1.jpg",
    },
    {
      name: "Kugenuma",
      folder: "fake-gallery-3",
      location: "湘南",
      coverImage: "/fake-gallery-3/photo-1.jpg",
    },
    {
      name: "Kamogawa",
      folder: "fake-gallery-4",
      location: "千葉南",
      coverImage: "/fake-gallery-4/photo-1.jpg",
    },
    {
      name: "Maroubra",
      folder: "fake-gallery-5",
      location: "Sydney",
      coverImage: "/fake-gallery-5/photo-1.jpg",
    },
  ];

  for (const gallery of galleries) {
    // Generate photo URLs
    const photos = Array.from({ length: 15 }).map((_, index) => ({
      title: `Photo ${index + 1}`,
      photoUrl: `/${gallery.folder}/photo-${index + 1}.jpg`,
    }));

    await prisma.gallery.create({
      data: {
        name: gallery.name,
        location: gallery.location,
        coverImage: gallery.coverImage, // ✅ Save cover image manually
        photos: { create: photos },
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
