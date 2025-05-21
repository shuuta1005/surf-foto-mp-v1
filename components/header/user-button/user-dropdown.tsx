// components/shared/header/user-dropdown.tsx

"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { ADMIN_EMAILS } from "@/lib/constants"; // ✅ import your admin list

interface Props {
  user: {
    name?: string | null;
    email?: string | null;
  };
}

export const UserDropdown = ({ user }: Props) => {
  const firstInitial = user.name?.charAt(0).toUpperCase() ?? "U";
  const isAdmin = user.email && ADMIN_EMAILS.includes(user.email);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="text-lg w-10 h-10 rounded-full bg-gray-500 text-white
           hover:bg-gray-700 text-center p-0 font-semibold
            hover:text-white shadow-sm hover:shadow-md transition
           focus-visible:ring-0 focus-visible:ring-offset-0"
        >
          {firstInitial}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              Hey, {user.name}🤙🏽
            </p>
            <p className="text-sm text-muted-foreground leading-none">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>

        {/* ✅ Admin Link (only for admins) */}
        {isAdmin && (
          <DropdownMenuItem asChild>
            <Link href="/admin" className="w-full">
              🛠 Admin Dashboard
            </Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem
          className="cursor-pointer text-red-500"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
