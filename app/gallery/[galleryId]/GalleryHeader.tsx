"use client";
import Link from "next/link";
import { useCart } from "@/lib/context/CartContext";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";

export default function GalleryHeader({
  name,
  location,
}: {
  name: string;
  location?: string;
}) {
  const { items } = useCart();
  const router = useRouter();

  return (
    <header className="w-full border-b bg-stone-100 shadow-md sticky top-0 z-10 mb-1">
      <div className="flex justify-between items-center p-4 gap-4 max-w-7xl mx-auto">
        <Button
          variant="outline"
          className="font-semibold"
          onClick={() => router.back()}
        >
          ← Back
        </Button>

        <h1 className="text-2xl font-extrabold text-center">
          {name} - <span className="font-noto">{location || "Unknown"}</span>
        </h1>

        <Link href="/cart" className="relative">
          <Button
            variant="outline"
            className="font-semibold flex items-center gap-2"
          >
            <ShoppingCart size={24} strokeWidth={2.5} />
            {items.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-sm px-2 rounded-full">
                {items.length}
              </span>
            )}
          </Button>
        </Link>
      </div>
    </header>
  );
}
