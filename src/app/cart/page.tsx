"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import {
  ShoppingBag,
  Trash2,
  Minus,
  Plus,
  ArrowRight,
  ShieldCheck,
  Tag,
  Truck,
  RotateCcw,
  CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const router = useRouter();
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
    updateQuantity,
    removeFromCart,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [promoCode, setPromoCode] = useState("");
  const [isApplying, setIsApplying] = useState(false);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCode.trim()) return;
    setIsApplying(true);
    applyCoupon(promoCode);
    setIsApplying(false);
    setPromoCode("");
  };

  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-black/5 pb-6">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#1D1D1F] dark:text-white">
          Review your Bag
        </h1>
        <p className="text-xs sm:text-sm text-[#6E6E73] mt-1">
          Free worldwide express delivery and 2-year warranty on all flagship hardware.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="py-20 text-center rounded-[32px] bg-white/60 dark:bg-[#18181A]/60 backdrop-blur-xl border border-black/5 space-y-4 max-w-xl mx-auto p-8">
          <div className="w-16 h-16 rounded-[24px] bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400">
            <ShoppingBag className="w-8 h-8 stroke-[1.8]" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-[#1D1D1F] dark:text-white">
              Your bag is empty.
            </h3>
            <p className="text-xs text-[#6E6E73] max-w-xs mx-auto">
              Browse our flagship collections of acoustic headphones, titanium watches, and computing displays.
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 h-11 px-6 rounded-[16px] bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs font-semibold shadow-sm transition-all active:scale-[0.97]"
            >
              <span>Continue Shopping</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Items Column (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Free shipping bar */}
            <div className="p-4 rounded-[20px] bg-blue-50/60 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 font-medium text-[#1D1D1F] dark:text-white">
                  <Truck className="w-4 h-4 text-[#0071E3]" />
                  {progressToFreeShipping >= 100 ? (
                    <strong className="text-[#2FA84F]">
                      You unlocked Free Worldwide Express!
                    </strong>
                  ) : (
                    <span>
                      Add <strong>${remainingForFreeShipping}</strong> more for Free Express
                    </span>
                  )}
                </span>
                <span className="font-semibold text-[#6E6E73]">
                  {progressToFreeShipping}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-black/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#0071E3] rounded-full transition-all duration-300"
                  style={{ width: `${progressToFreeShipping}%` }}
                />
              </div>
            </div>

            {/* List */}
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-[24px] bg-white/70 dark:bg-[#18181A]/70 backdrop-blur-xl border border-black/[0.06] shadow-sm flex gap-4 items-center"
                >
                  <div className="w-20 h-20 rounded-[18px] bg-neutral-100 dark:bg-neutral-800 overflow-hidden shrink-0 border border-black/5">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.product_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ShoppingBag className="w-8 h-8 text-neutral-300 m-auto" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <h3 className="font-semibold text-sm text-[#1D1D1F] dark:text-white truncate">
                      {item.product_name}
                    </h3>
                    <div className="text-xs font-semibold text-[#1D1D1F] dark:text-white">
                      {formatPrice(item.product_price)}
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <div className="flex items-center rounded-[12px] bg-neutral-100 dark:bg-neutral-800 border border-black/5 overflow-hidden">
                        <button
                          suppressHydrationWarning
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center text-neutral-600 hover:text-black hover:bg-neutral-200 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-xs font-semibold text-[#1D1D1F] dark:text-white">
                          {item.quantity}
                        </span>
                        <button
                          suppressHydrationWarning
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center text-neutral-600 hover:text-black hover:bg-neutral-200 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        suppressHydrationWarning
                        onClick={() => removeFromCart(item.id)}
                        className="text-neutral-400 hover:text-[#E8635A] text-xs font-medium flex items-center gap-1 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-base font-bold text-[#1D1D1F] dark:text-white tabular-nums">
                      {formatPrice(item.product_price * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary Column (5 cols) */}
          <div className="lg:col-span-5 space-y-4 sticky top-24">
            <div className="p-6 sm:p-7 rounded-[28px] bg-white/70 dark:bg-[#18181A]/70 backdrop-blur-xl border border-black/[0.06] shadow-sm space-y-6">
              <h2 className="text-lg font-semibold text-[#1D1D1F] dark:text-white">
                Order Summary
              </h2>

              {/* Promo Code Input */}
              {coupon ? (
                <div className="flex items-center justify-between px-3.5 py-2.5 rounded-[14px] bg-[#2FA84F]/10 border border-[#2FA84F]/20 text-xs">
                  <div className="flex items-center gap-2 text-[#2FA84F] font-semibold">
                    <Tag className="w-3.5 h-3.5" />
                    <span>{coupon.code} applied (-{formatPrice(discount)})</span>
                  </div>
                  <button
                    suppressHydrationWarning
                    onClick={removeCoupon}
                    className="text-neutral-500 hover:text-neutral-800 text-[11px] underline"
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
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1 h-10 px-3.5 rounded-[12px] bg-neutral-100 border border-black/5 text-xs text-[#1D1D1F] uppercase placeholder-[#6E6E73] focus:outline-none focus:border-[#0D6E5D]"
                  />
                  <button
                    suppressHydrationWarning
                    type="submit"
                    disabled={!promoCode.trim() || isApplying}
                    className="h-10 px-4 rounded-[12px] bg-[#1D1D1F] hover:bg-black text-white text-xs font-semibold disabled:opacity-40 transition-colors"
                  >
                    Apply
                  </button>
                </form>
              )}

              {/* Breakdown */}
              <div className="space-y-3 text-xs border-t border-black/5 pt-4">
                <div className="flex justify-between text-[#6E6E73]">
                  <span>Items Subtotal ({totalCount})</span>
                  <span className="font-semibold text-[#1D1D1F] dark:text-white">{formatPrice(subtotal)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-[#2FA84F]">
                    <span>Discount ({coupon?.code})</span>
                    <span className="font-semibold">-{formatPrice(discount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-[#6E6E73]">
                  <span>Worldwide Express</span>
                  <span className="font-semibold text-[#1D1D1F] dark:text-white">
                    {shipping === 0 ? "FREE" : formatPrice(shipping)}
                  </span>
                </div>

                <div className="flex justify-between text-[#6E6E73]">
                  <span>Estimated GST</span>
                  <span className="font-semibold text-[#1D1D1F] dark:text-white">Included</span>
                </div>

                <div className="border-t border-black/5 pt-3 flex justify-between text-base font-bold text-[#1D1D1F] dark:text-white">
                  <span>Total</span>
                  <span className="text-[#0D6E5D] tabular-nums font-bold">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <Link
                href="/checkout"
                className="w-full h-12 rounded-full bg-[#0D6E5D] hover:bg-[#0A5649] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
