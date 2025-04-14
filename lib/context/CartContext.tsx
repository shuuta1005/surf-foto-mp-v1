"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { CartItem } from "@/app/types/cart";

type CartContextType = {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (photoId: string) => void;
  isInCart: (photoId: string) => boolean;
  clearCart: () => void;
  getTotal: () => number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("brafotos-cart");
    if (stored) {
      try {
        setItems(JSON.parse(stored));
      } catch (err) {
        console.error("Failed to parse cart:", err);
      }
    }
  }, []);

  // Save cart to localStorage on change
  useEffect(() => {
    localStorage.setItem("brafotos-cart", JSON.stringify(items));
  }, [items]);

  const addToCart = (item: CartItem) => {
    if (!items.some((i) => i.photoId === item.photoId)) {
      setItems((prev) => [...prev, item]);
    }
  };

  const removeFromCart = (photoId: string) => {
    setItems((prev) => prev.filter((item) => item.photoId !== photoId));
  };

  const isInCart = (photoId: string) => {
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

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        isInCart,
        clearCart,
        getTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
