// components/shared/header/user-button.tsx

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { UserDropdown } from "./user-dropdown";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { UserIcon } from "lucide-react";

// This is now a SERVER component (removed "use client")
export default async function UserButton() {
  const session = await auth();

  if (!session?.user) {
    return (
      <Button asChild className="rounded-full p-2 sm:p-3">
        <Link href="/sign-in">
          <UserIcon className="w-4 h-4 sm:w-6 sm:h-6" />
        </Link>
      </Button>
    );
  }

  // ✅ Fetch role and photographerStatus from database
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      email: true,
      role: true,
      photographerStatus: true,
    },
  });

  // Fallback to session data if user not found
  const userData = user || {
    name: session.user.name,
    email: session.user.email,
    role: undefined,
    photographerStatus: undefined,
  };

  return <UserDropdown user={userData} />;
}
