"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { ProductResponse } from "@/types/api";
import { useToast } from "./ToastContext";
import { useCart } from "./CartContext";

interface WishlistContextType {
  items: ProductResponse[];
  count: number;
  isInWishlist: (productId: number) => boolean;
  toggleWishlist: (product: ProductResponse) => void;
  removeFromWishlist: (productId: number) => void;
  moveToBag: (product: ProductResponse) => Promise<void>;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const WISHLIST_KEY = "aurelian_wishlist_v2";

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ProductResponse[]>([]);
  const { success, info } = useToast();
  const { addToCart } = useCart();

  useEffect(() => {
    try {
      const raw = localStorage.getItem(WISHLIST_KEY);
      if (raw) {
        setItems(JSON.parse(raw));
      }
    } catch {
      setItems([]);
    }
  }, []);

  const saveWishlist = useCallback((newItems: ProductResponse[]) => {
    setItems(newItems);
    try {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(newItems));
    } catch (e) {
      console.error("Failed to save wishlist", e);
    }
  }, []);

  const isInWishlist = useCallback(
    (productId: number) => {
      return items.some((item) => item.id === productId);
    },
    [items]
  );

  const toggleWishlist = useCallback(
    (product: ProductResponse) => {
      const exists = items.some((item) => item.id === product.id);
      if (exists) {
        const updated = items.filter((item) => item.id !== product.id);
        saveWishlist(updated);
        info(`Removed ${product.name} from Wishlist`);
      } else {
        const updated = [product, ...items];
        saveWishlist(updated);
        success(`Saved ${product.name} to Wishlist`);
      }
    },
    [items, saveWishlist, success, info]
  );

  const removeFromWishlist = useCallback(
    (productId: number) => {
      const updated = items.filter((item) => item.id !== productId);
      saveWishlist(updated);
    },
    [items, saveWishlist]
  );

  const moveToBag = useCallback(
    async (product: ProductResponse) => {
      await addToCart(product.id, 1, product);
      removeFromWishlist(product.id);
      success(`Moved ${product.name} to Shopping Bag`);
    },
    [addToCart, removeFromWishlist, success]
  );

  const clearWishlist = useCallback(() => {
    saveWishlist([]);
  }, [saveWishlist]);

  return (
    <WishlistContext.Provider
      value={{
        items,
        count: items.length,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
        moveToBag,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
