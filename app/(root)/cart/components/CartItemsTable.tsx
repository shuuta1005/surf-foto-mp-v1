// app/(root)/cart/components/CartItemTable.tsx

"use client";

import { useCart } from "@/features/cart/CartContext";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2 } from "lucide-react";

const formatYen = (price: number) => `¥${price.toLocaleString("ja-JP")}`;

const CartItemsTable = () => {
  const { items, removeFromCart } = useCart();

  return (
    <div className="overflow-x-auto md:col-span-3">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-black">Photo</TableHead>
            <TableHead className="text-black">Price</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.photoId}>
              <TableCell className="w-32 h-20 relative bg-white shadow-sm rounded-md">
                <Image
                  src={item.photoUrl}
                  alt="Surf Photo"
                  fill
                  className="object-cover rounded-md shadow-sm"
                />
              </TableCell>
              <TableCell className="font-semibold text-sm">
                {formatYen(item.price)}
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFromCart(item.photoId)}
                >
                  <Trash2 size={18} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CartItemsTable;
