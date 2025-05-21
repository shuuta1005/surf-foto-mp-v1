// // components/shared/header/user-button-client.tsx

"use client";

import { UserDropdown } from "./user-dropdown";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { UserIcon } from "lucide-react";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";

interface UserButtonProps {
  session: Session | null;
}

const UserButton = ({ session: serverSession }: UserButtonProps) => {
  // Use client-side session state which will update immediately
  const { data: clientSession } = useSession();

  // Prioritize the client-side session for UI rendering
  const session = clientSession || serverSession;

  if (!session) {
    return (
      <Button asChild className="rounded-full p-2 sm:p-3">
        <Link href="/sign-in">
          <UserIcon className="w-4 h-4 sm:w-6 sm:h-6" />
        </Link>
      </Button>
    );
  }

  return <UserDropdown user={session.user} />;
};

export default UserButton;
