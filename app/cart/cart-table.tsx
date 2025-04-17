"use client";

import { useCart } from "@/lib/context/CartContext";
import Image from "next/image";
import Link from "next/link";
//import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

const CartTable = () => {
  //const router = useRouter();
  const { items, removeFromCart, getTotal } = useCart();

  const isEmpty = items.length === 0;

  return (
    <>
      <h1 className="py-4 text-2xl font-bold">Shopping Cart</h1>

      {isEmpty ? (
        <div>
          Cart is empty.{" "}
          <Link href="/" className="text-blue-500 underline">
            Go Find Photos of Yourself
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className="overflow-x-auto md:col-span-3">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Photo</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.photoId}>
                    <TableCell className="w-32 h-20 relative">
                      <Image
                        src={item.photoUrl}
                        alt="Surf Photo"
                        fill
                        className="object-cover rounded-md shadow-sm"
                      />
                    </TableCell>
                    <TableCell>¥{item.price}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
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

          {/* Summary Section */}
          <Card>
            <CardContent className="p-4 flex flex-col gap-4">
              <div className="text-lg">
                Total: <span className="font-bold">¥{getTotal()}</span>
              </div>
              <Button
                className="w-full"
                onClick={() => alert("Checkout coming soon!")}
              >
                Checkout
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default CartTable;
