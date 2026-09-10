"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { ClientCartItem, ProductResponse } from "@/types/api";
import { productApi } from "@/lib/api";
import { AVAILABLE_COUPONS } from "@/lib/mockData";
import { useToast } from "./ToastContext";

export interface AppliedCoupon {
  code: string;
  discountPercent: number;
  discountAmount: number;
  freeShipping?: boolean;
}

interface CartContextType {
  items: ClientCartItem[];
  totalCount: number;
  subtotal: number;
  total: number;
  discount: number;
  coupon: AppliedCoupon | null;
  shipping: number;
  freeShippingThreshold: number;
  progressToFreeShipping: number;
  isLoading: boolean;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  addToCart: (
    productId: number,
    quantity?: number,
    productData?: ProductResponse
  ) => Promise<void>;
  addItem: (
    product: any,
    quantity?: number
  ) => Promise<void>;
  updateQuantity: (
    itemIdOrProductId: number | string,
    quantity: number
  ) => Promise<void>;
  removeFromCart: (itemIdOrProductId: number | string) => Promise<void>;
  clearCart: () => void;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_KEY = "aurelian_local_cart_v3";
const COUPON_KEY = "aurelian_local_coupon_v3";
const FREE_SHIPPING_THRESHOLD = 500;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ClientCartItem[]>([]);
  const [coupon, setCoupon] = useState<AppliedCoupon | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { success, error, info } = useToast();

  const openDrawer = useCallback(() => setIsDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);
  const toggleDrawer = useCallback(() => setIsDrawerOpen((prev) => !prev), []);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem(CART_KEY);
      if (storedCart) {
        setItems(JSON.parse(storedCart));
      }
      const storedCoupon = localStorage.getItem(COUPON_KEY);
      if (storedCoupon) {
        setCoupon(JSON.parse(storedCoupon));
      }
    } catch {
      setItems([]);
      setCoupon(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveCart = useCallback((cartItems: ClientCartItem[]) => {
    setItems(cartItems);
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
    } catch (e) {
      console.error("Failed to save cart", e);
    }
  }, []);

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.product_price * item.quantity, 0);
  }, [items]);

  const totalCount = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const discount = useMemo(() => {
    if (!coupon) return 0;
    if (coupon.discountPercent) {
      return Math.round((subtotal * coupon.discountPercent) / 100);
    }
    return 0;
  }, [subtotal, coupon]);

  const shipping = useMemo(() => {
    if (subtotal === 0) return 0;
    if (coupon?.freeShipping || subtotal >= FREE_SHIPPING_THRESHOLD) return 0;
    return 29; // Standard flat express shipping
  }, [subtotal, coupon]);

  const total = useMemo(() => {
    return Math.max(0, subtotal - discount + shipping);
  }, [subtotal, discount, shipping]);

  const progressToFreeShipping = useMemo(() => {
    if (subtotal >= FREE_SHIPPING_THRESHOLD) return 100;
    return Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
  }, [subtotal]);

  const addToCart = useCallback(
    async (
      productId: number,
      quantity = 1,
      productData?: ProductResponse
    ) => {
      try {
        let prod = productData;
        if (!prod) {
          prod = await productApi.getById(productId);
        }

        const existingIdx = items.findIndex((i) => i.product_id === productId);
        let updated: ClientCartItem[];

        if (existingIdx > -1) {
          updated = items.map((i, idx) =>
            idx === existingIdx ? { ...i, quantity: i.quantity + quantity } : i
          );
        } else {
          updated = [
            ...items,
            {
              id: Date.now(),
              product_id: prod.id,
              product_name: prod.name,
              product_price: prod.price,
              quantity,
              image_url: prod.image_url,
              stock: prod.stock,
            },
          ];
        }

        saveCart(updated);
        success(`Added ${prod.name} to your bag`);
        openDrawer();
      } catch (err: any) {
        error(err?.message || "Failed to add item to bag");
      }
    },
    [items, saveCart, success, error, openDrawer]
  );

  const addItem = useCallback(
    async (product: any, quantity: number = 1) => {
      const prodId = typeof product === "number" ? product : product?.id;
      await addToCart(prodId, quantity, typeof product === "object" ? product : undefined);
    },
    [addToCart]
  );

  const updateQuantity = useCallback(
    async (itemIdOrProductId: number | string, quantity: number) => {
      let updated: ClientCartItem[];
      if (quantity <= 0) {
        updated = items.filter(
          (i) => i.id !== itemIdOrProductId && i.product_id !== itemIdOrProductId
        );
      } else {
        updated = items.map((i) => {
          if (i.id === itemIdOrProductId || i.product_id === itemIdOrProductId) {
            return { ...i, quantity };
          }
          return i;
        });
      }
      saveCart(updated);
    },
    [items, saveCart]
  );

  const removeFromCart = useCallback(
    async (itemIdOrProductId: number | string) => {
      const itemToRemove = items.find(
        (i) => i.id === itemIdOrProductId || i.product_id === itemIdOrProductId
      );
      const updated = items.filter(
        (i) => i.id !== itemIdOrProductId && i.product_id !== itemIdOrProductId
      );
      saveCart(updated);
      if (itemToRemove) {
        info(`Removed ${itemToRemove.product_name} from bag`);
      }
    },
    [items, saveCart, info]
  );

  const clearCart = useCallback(() => {
    saveCart([]);
    setCoupon(null);
    try {
      localStorage.removeItem(COUPON_KEY);
    } catch {}
  }, [saveCart]);

  const applyCoupon = useCallback(
    (code: string): boolean => {
      const cleanCode = code.trim().toUpperCase();
      const match = AVAILABLE_COUPONS.find((c) => c.code === cleanCode);

      if (!match) {
        error("Invalid promo code. Try APPLE10 or PRO20");
        return false;
      }

      if (match.minSpend && subtotal < match.minSpend) {
        error(`Promo code ${cleanCode} requires a minimum order of $${match.minSpend}`);
        return false;
      }

      const applied: AppliedCoupon = {
        code: match.code,
        discountPercent: match.discountPercent,
        discountAmount: match.discountPercent ? Math.round((subtotal * match.discountPercent) / 100) : 0,
        freeShipping: match.freeShipping,
      };

      setCoupon(applied);
      try {
        localStorage.setItem(COUPON_KEY, JSON.stringify(applied));
      } catch {}
      success(`Promo code ${match.code} applied! ${match.description}`);
      return true;
    },
    [subtotal, success, error]
  );

  const removeCoupon = useCallback(() => {
    setCoupon(null);
    try {
      localStorage.removeItem(COUPON_KEY);
    } catch {}
    info("Promo code removed");
  }, [info]);

  return (
    <CartContext.Provider
      value={{
        items,
        totalCount,
        subtotal,
        total,
        discount,
        coupon,
        shipping,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        progressToFreeShipping,
        isLoading,
        isDrawerOpen,
        openDrawer,
        closeDrawer,
        toggleDrawer,
        addToCart,
        addItem,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyCoupon,
        removeCoupon,
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
