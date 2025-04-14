import { prisma } from "@/lib/db";

async function resetDatabase() {
  console.log("⚠️ Resetting database...");

  await prisma.$transaction([
    prisma.photo.deleteMany(),
    prisma.gallery.deleteMany(),
    prisma.account.deleteMany(),
    prisma.session.deleteMany(),
    prisma.verificationToken.deleteMany(),
    prisma.user.deleteMany(),
  ]);

  console.log("✅ Database reset complete!");
}

resetDatabase()
  .catch((e) => console.error("❌ Error resetting database:", e))
  .finally(async () => {
    await prisma.$disconnect();
  });
