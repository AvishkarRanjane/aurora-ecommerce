"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Truck,
  Sparkles,
  Tag,
  CheckCircle2,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";

export function CartDrawer() {
  const {
    items,
    totalCount,
    subtotal,
    total,
    discount,
    coupon,
    shipping,
    freeShippingThreshold,
    progressToFreeShipping,
    isDrawerOpen,
    closeDrawer,
    updateQuantity,
    removeFromCart,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponCode, setCouponCode] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setIsApplyingCoupon(true);
    applyCoupon(couponCode);
    setIsApplyingCoupon(false);
    setCouponCode("");
  };

  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            onClick={closeDrawer}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md"
          />

          {/* Slide-in Glass Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-white/90 dark:bg-[#121214]/90 backdrop-blur-2xl border-l border-black/5 dark:border-white/10 shadow-2xl flex flex-col"
          >
            {/* Drawer Header */}
            <div className="p-6 border-b border-black/5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-[12px] bg-[#0071E3]/10 text-[#0071E3] flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-[#1D1D1F] tracking-tight">
                    Review Bag
                  </h2>
                  <p className="text-xs text-[#6E6E73]">
                    {totalCount} {totalCount === 1 ? "item" : "items"} selected
                  </p>
                </div>
              </div>

              <button
                suppressHydrationWarning
                onClick={closeDrawer}
                className="w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-[#6E6E73] hover:text-[#1D1D1F] transition-colors"
                aria-label="Close bag"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Free Shipping Progress Bar */}
            <div className="px-6 py-3.5 bg-gradient-to-r from-blue-50/70 to-indigo-50/70 border-b border-blue-100/60">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="flex items-center gap-1.5 font-medium text-[#1D1D1F]">
                  <Truck className="w-3.5 h-3.5 text-[#0071E3]" />
                  {progressToFreeShipping >= 100 ? (
                    <span className="text-[#2FA84F] font-semibold">
                      You unlocked Free Worldwide Express!
                    </span>
                  ) : (
                    <span>
                      Add <strong className="text-[#0D6E5D] font-bold">{formatPrice(amountNeededForFreeShipping)}</strong> for Free Express
                    </span>
                  )}
                </span>
                <span className="font-semibold text-[#6E6E73]">
                  {progressToFreeShipping}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-black/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressToFreeShipping}%` }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="h-full bg-[#0071E3] rounded-full"
                />
              </div>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-16 space-y-4">
                  <div className="w-16 h-16 rounded-[24px] bg-neutral-100 flex items-center justify-center text-neutral-400">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-semibold text-[#1D1D1F]">
                      Your Bag is Empty
                    </h3>
                    <p className="text-xs text-[#6E6E73] max-w-xs">
                      Explore our flagship collection of acoustics, titanium wearables, and studio displays.
                    </p>
                  </div>
                  <Link
                    href="/catalog"
                    onClick={closeDrawer}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[16px] bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs font-semibold shadow-sm transition-all active:scale-[0.97]"
                  >
                    <span>Browse Hardware</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-[20px] bg-white/70 border border-black/5 shadow-[0_4px_16px_rgba(0,0,0,0.03)] flex gap-3.5 items-center"
                  >
                    {/* Item Image */}
                    <div className="w-16 h-16 rounded-[14px] bg-neutral-100 overflow-hidden flex items-center justify-center shrink-0 border border-black/5">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.product_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ShoppingBag className="w-6 h-6 text-neutral-400" />
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold text-[#1D1D1F] truncate">
                        {item.product_name}
                      </h4>
                      <div className="text-xs font-semibold text-[#1D1D1F] mt-0.5">
                        {formatPrice(item.product_price)}
                      </div>

                      {/* Stepper */}
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center rounded-[10px] bg-neutral-100 border border-black/5 overflow-hidden">
                          <button
                            suppressHydrationWarning
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-6 h-6 flex items-center justify-center text-neutral-600 hover:text-black hover:bg-neutral-200 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-7 text-center text-xs font-semibold text-[#1D1D1F]">
                            {item.quantity}
                          </span>
                          <button
                            suppressHydrationWarning
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 flex items-center justify-center text-neutral-600 hover:text-black hover:bg-neutral-200 transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          suppressHydrationWarning
                          onClick={() => removeFromCart(item.id)}
                          className="p-1.5 text-neutral-400 hover:text-[#E8635A] transition-colors rounded-lg"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Line Total */}
                    <div className="text-right shrink-0">
                      <span className="text-xs font-bold text-[#1D1D1F]">
                        {formatPrice(item.product_price * item.quantity)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Drawer Footer (Summary & Checkout) */}
            {items.length > 0 && (
              <div className="p-6 border-t border-black/5 bg-white/60 backdrop-blur-md space-y-4">
                {/* Promo Code Box */}
                {coupon ? (
                  <div className="flex items-center justify-between px-3.5 py-2.5 rounded-[14px] bg-[#2FA84F]/10 border border-[#2FA84F]/20 text-xs">
                    <div className="flex items-center gap-2 text-[#2FA84F] font-semibold">
                      <Tag className="w-3.5 h-3.5" />
                      <span>{coupon.code} applied (-{formatPrice(discount)})</span>
                    </div>
                    <button
                      suppressHydrationWarning
                      onClick={removeCoupon}
                      className="text-neutral-400 hover:text-neutral-700 text-[11px] underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApply} className="flex gap-2">
                    <input
                      suppressHydrationWarning
                      type="text"
                      placeholder="Promo code (e.g. APPLE10)"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 h-9 px-3 rounded-[12px] bg-neutral-100 border border-black/5 text-xs text-[#1D1D1F] uppercase placeholder-neutral-400 focus:outline-none focus:border-[#0D6E5D]"
                    />
                    <button
                      suppressHydrationWarning
                      type="submit"
                      disabled={!couponCode.trim() || isApplyingCoupon}
                      className="h-9 px-4 rounded-[12px] bg-neutral-900 hover:bg-black text-white text-xs font-semibold disabled:opacity-40 transition-colors"
                    >
                      Apply
                    </button>
                  </form>
                )}

                {/* Subtotals */}
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-[#6E6E73]">
                    <span>Subtotal</span>
                    <span className="font-semibold text-[#1D1D1F]">{formatPrice(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-[#2FA84F]">
                      <span>Discount ({coupon?.code})</span>
                      <span className="font-semibold">-{formatPrice(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[#6E6E73]">
                    <span>Worldwide Express Delivery</span>
                    <span>{shipping === 0 ? "FREE" : formatPrice(shipping)}</span>
                  </div>
                  <div className="border-t border-black/5 pt-2 flex justify-between text-sm font-bold text-[#1D1D1F]">
                    <span>Estimated Total</span>
                    <span className="text-[#0D6E5D] font-bold">{formatPrice(total)}</span>
                  </div>
                </div>

                {/* Checkout CTA */}
                <div className="space-y-2">
                  <Link
                    href="/checkout"
                    onClick={closeDrawer}
                    className="w-full h-11 rounded-full bg-[#0D6E5D] hover:bg-[#0A5649] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
                  >
                    <span>Check Out</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/cart"
                    onClick={closeDrawer}
                    className="w-full h-9 rounded-[14px] bg-neutral-100 hover:bg-neutral-200 text-[#1D1D1F] text-xs font-medium flex items-center justify-center transition-colors"
                  >
                    View Full Bag
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
