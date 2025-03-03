import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function resetDatabase() {
  console.log("🔄 Resetting database...");

  // Delete all photos first (to avoid foreign key constraint issues)
  await prisma.photo.deleteMany();
  await prisma.gallery.deleteMany();

  console.log("✅ Database reset complete.");
}

resetDatabase()
  .catch((e) => console.error("❌ Error resetting database:", e))
  .finally(async () => {
    await prisma.$disconnect();
  });
