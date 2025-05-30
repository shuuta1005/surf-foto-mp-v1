// components/shared/header/user-button.tsx

"use client";

import { UserDropdown } from "./user-dropdown";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { UserIcon } from "lucide-react";
import { Session } from "next-auth";

interface UserButtonProps {
  session: Session | null;
}

const UserButton = ({ session }: UserButtonProps) => {
  if (!session) {
    return (
      <Button asChild>
        <Link href="/sign-in">
          <UserIcon className="mr-1 h-4 w-4" /> Sign In
        </Link>
      </Button>
    );
  }

  return <UserDropdown user={session.user} />;
};

export default UserButton;
