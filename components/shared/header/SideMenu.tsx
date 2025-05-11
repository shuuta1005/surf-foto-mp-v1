// components/shared/header/SideMenu.tsx
"use client";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import {
  UserIcon,
  Info,
  FileText,
  Shield,
  Menu,
  WavesIcon,
  GalleryHorizontal,
  X,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useState } from "react";

const SideMenu = () => {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  const menuItems = [
    session
      ? {
          title: "My Account",
          icon: <UserIcon />,
          href: "/account", // You can implement this page later
        }
      : {
          title: "Sign In",
          icon: <UserIcon />,
          href: "/sign-in",
        },
    { title: "My Purchased Photos", icon: <WavesIcon />, href: "/purchases" },
    {
      title: "Browse Galleries",
      icon: <GalleryHorizontal />,
      href: "/galleries",
    },
    { title: "About Us", icon: <Info />, href: "/about" },
    { title: "Terms", icon: <FileText />, href: "/terms" },
    { title: "Privacy", icon: <Shield />, href: "/privacy" },
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {/* Menu Button */}
      <SheetTrigger asChild>
        <Button variant="outline" className="w-10 h-10">
          <Menu />
        </Button>
      </SheetTrigger>

      {/* Menu Content */}
      <SheetContent side="left" className="[&>button.absolute]:hidden">
        <div className="flex items-center justify-between mb-4">
          <SheetTitle className="font-extrabold">Menu</SheetTitle>
          <SheetClose asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Close menu"
              className="hover:bg-gray-200"
            >
              <X className="h-5 w-5" />
            </Button>
          </SheetClose>
        </div>

        <nav className="mt-6 space-y-4">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="flex items-center gap-3 p-2 hover:bg-gray-200 rounded-md"
            >
              {item.icon}
              <span className="font-semibold">{item.title}</span>
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default SideMenu;
