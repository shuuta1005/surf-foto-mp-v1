"use client";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { UserIcon, Camera, Info, FileText, Shield, Menu } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const menuItems = [
  { title: "Sign In", icon: <UserIcon />, href: "/sign-in" },
  { title: "Profile", icon: <UserIcon />, href: "/user" },
  { title: "Photographers", icon: <Camera />, href: "/photographers" },
  { title: "About Us", icon: <Info />, href: "/about" },
  { title: "Terms and Conditions", icon: <FileText />, href: "/terms" },
  { title: "Privacy Policy", icon: <Shield />, href: "/privacy" },
];

const SideMenu = () => {
  return (
    <Sheet>
      {/* Menu Button */}
      <SheetTrigger asChild>
        <Button variant="outline" className="w-10 h-10">
          <Menu />
        </Button>
      </SheetTrigger>

      {/* Menu Content */}
      <SheetContent side="left">
        <SheetTitle className="font-extrabold">Menu</SheetTitle>

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
