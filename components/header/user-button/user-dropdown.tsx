// components/shared/header/user-dropdown.tsx

"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

interface Props {
  user: {
    name?: string | null;
    email?: string | null;
    role?: string;
    photographerStatus?: string;
  };
}

export const UserDropdown = ({ user }: Props) => {
  const firstInitial = user.name?.charAt(0).toUpperCase() ?? "U";
  const isAdmin = user.role === "ADMIN";
  const isPhotographer = user.role === "PHOTOGRAPHER";
  const isRegularUser = user.role === "USER";
  const canApplyPhotographer =
    isRegularUser && user.photographerStatus === "NONE";
  const applicationPending = user.photographerStatus === "PENDING";

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
        {/* User Info */}
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              G&apos;day, {user.name}🤙🏽
            </p>
            <p className="text-xs text-muted-foreground leading-none">
              {user.email}
            </p>
            {/* Role Badge */}
            {user.role && (
              <span className="text-xs font-medium text-blue-600 mt-1">
                {user.role === "ADMIN" && "👑 Admin"}
                {user.role === "PHOTOGRAPHER" && "📸 Photographer"}
                {user.role === "USER" && "🏄 User"}
              </span>
            )}
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {/* Dashboard - Admin & Photographers */}
        {(isAdmin || isPhotographer) && (
          <DropdownMenuItem asChild>
            <Link href="/admin" className="w-full cursor-pointer">
              🛠️ Dashboard
            </Link>
          </DropdownMenuItem>
        )}

        {/* Become a Photographer - Regular Users */}
        {canApplyPhotographer && (
          <DropdownMenuItem asChild>
            <Link href="/apply-photographer" className="w-full cursor-pointer">
              <span className="flex items-center gap-2">
                📸 Become a Photographer
                <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                  New
                </span>
              </span>
            </Link>
          </DropdownMenuItem>
        )}

        {/* Application Pending - Regular Users */}
        {applicationPending && (
          <DropdownMenuItem disabled>
            <span className="flex items-center gap-2 text-amber-600">
              ⏳ Application Pending
            </span>
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        {/* Sign Out - Everyone */}
        <DropdownMenuItem
          className="cursor-pointer text-red-600 focus:text-red-600"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          🚪 Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
