// 🧠 Think of this file as:
// “This file holds my cart’s brain. When I call useCart(), I get access to its memory and tools.”

"use client";

import { useEffect, useState } from "react";
import { CartItem } from "@/app/types/cart";
import { cartItemSchema } from "@/lib/validation";
import { z } from "zod";

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  // ✅ Load from localStorage on first render
  useEffect(() => {
    const stored = localStorage.getItem("brafotos-cart");
    //This checks if what's saved in localStorage is actually valid.
    // If someone tampered with the cart manually in the browser (or it got corrupted),
    // this prevents the app from crashing and logs a clear error instead.
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const validated = z.array(cartItemSchema).parse(parsed); // ✅ validate
        setItems(validated);
      } catch (err) {
        console.error("Invalid cart data:", err);
      }
    }
  }, []);

  // ✅ Save to localStorage every time it changes
  useEffect(() => {
    localStorage.setItem("brafotos-cart", JSON.stringify(items));
  }, [items]);

  const addToCart = (item: CartItem) => {
    if (!items.find((i) => i.photoId === item.photoId)) {
      //🧠 [...prev, item] is a spread operator: It’s like saying:
      //let newArray = copy of prev array + new item
      setItems((prev) => [...prev, item]);
    }
  };

  const removeFromCart = (photoId: string) => {
    setItems((prev) => prev.filter((item) => item.photoId !== photoId));
  };

  const isInCart = (photoId: string) => {
    //items.some(...) → checks if at least one item in items has a matching photoId
    //🧠 .some() returns:
    // true if there’s a match
    // false if not
    return items.some((item) => item.photoId === photoId);
  };

  const clearCart = () => setItems([]);

  const getTotal = () => {
    const n = items.length;
    if (n === 1) return 1000;
    if (n === 2) return 1600;
    if (n === 3) return 2100;
    if (n === 4) return 2400;
    if (n === 5) return 2500;
    return n * 500;
  };

  const getTotalPrice = () => {
    const n = items.length;
    if (n === 0) return 0;
    if (n === 1) return 1000;
    if (n === 2) return 1600;
    if (n === 3) return 2100;
    if (n === 4) return 2400;
    if (n === 5) return 2500;
    return n * 500;
  };

  return {
    items,
    addToCart,
    removeFromCart,
    isInCart,
    clearCart,
    getTotal,
    getTotalPrice,
  };
}
