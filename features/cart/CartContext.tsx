//features/cart/CartContext.tsx

"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { CartItem } from "@/types/cart";
import {
  calculateCartPricing,
  PricingResult,
  GalleryPricingData,
} from "@/lib/pricing-calculator";

type CartContextType = {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (photoId: string) => void;
  isInCart: (photoId: string) => boolean;
  clearCart: () => void;
  getTotal: () => number;
  getOriginalPrice: () => number;
  getDiscount: () => number;
  getGalleryPricing: () => Map<string, PricingResult>;
  getItemsByGallery: () => Map<string, CartItem[]>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from browser storage
  useEffect(() => {
    const loadCart = () => {
      const stored = localStorage.getItem("brafotos-cart");
      if (stored) {
        try {
          setItems(JSON.parse(stored));
        } catch (err) {
          console.error("Failed to parse cart:", err);
        }
      } else {
        setItems([]);
      }
    };

    loadCart();

    const handleCartUpdate = () => {
      loadCart();
    };

    window.addEventListener("cart-updated", handleCartUpdate);
    return () => window.removeEventListener("cart-updated", handleCartUpdate);
  }, []);

  // Save cart when it changes
  useEffect(() => {
    localStorage.setItem("brafotos-cart", JSON.stringify(items));
  }, [items]);

  // Add and remove items
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

  // Clear the cart
  const clearCart = () => {
    setItems([]);
    localStorage.removeItem("brafotos-cart");
    window.dispatchEvent(new Event("cart-updated"));
  };

  // Group items by gallery
  const getItemsByGallery = () => {
    const grouped = new Map<string, CartItem[]>();

    items.forEach((item) => {
      const galleryId = item.galleryId;
      if (!grouped.has(galleryId)) {
        grouped.set(galleryId, []);
      }
      grouped.get(galleryId)!.push(item);
    });

    return grouped;
  };

  // Get pricing breakdown by gallery
  const getGalleryPricing = () => {
    const itemsByGallery = getItemsByGallery();
    const galleryData = new Map<string, GalleryPricingData>();

    for (const [galleryId, galleryItems] of itemsByGallery) {
      // All items from the same gallery should have the same pricing info
      const firstItem = galleryItems[0];
      galleryData.set(galleryId, {
        items: galleryItems,
        basePrice: firstItem.galleryBasePrice,
        tiers: firstItem.galleryTiers || [],
      });
    }

    const { galleryPricing } = calculateCartPricing(galleryData);
    return galleryPricing;
  };

  // Calculate total price across all galleries
  const getTotal = () => {
    const itemsByGallery = getItemsByGallery();
    const galleryData = new Map<string, GalleryPricingData>();

    for (const [galleryId, galleryItems] of itemsByGallery) {
      const firstItem = galleryItems[0];
      galleryData.set(galleryId, {
        items: galleryItems,
        basePrice: firstItem.galleryBasePrice,
        tiers: firstItem.galleryTiers || [],
      });
    }

    const { grandTotal } = calculateCartPricing(galleryData);
    return grandTotal;
  };

  // Calculate original price (without bundles)
  const getOriginalPrice = () => {
    return items.reduce((sum, item) => sum + item.price, 0);
  };

  // Calculate total discount
  const getDiscount = () => {
    return getOriginalPrice() - getTotal();
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
        getOriginalPrice,
        getDiscount,
        getGalleryPricing,
        getItemsByGallery,
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
