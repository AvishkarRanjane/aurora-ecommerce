"use client";

import React from "react";
import Link from "next/link";
import { Heart, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { ProductCard } from "@/components/product/ProductCard";

export default function WishlistPage() {
  const { items, count, clearWishlist, moveToBag } = useWishlist();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-black/5 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8635A]/10 text-[#E8635A] text-xs font-semibold mb-2">
            <Heart className="w-3.5 h-3.5 fill-[#E8635A]" />
            <span>Saved Hardware</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#1D1D1F] dark:text-white">
            Your Wishlist
          </h1>
          <p className="text-xs sm:text-sm text-[#6E6E73] mt-1">
            {count} {count === 1 ? "product" : "products"} saved for later.
          </p>
        </div>

        {items.length > 0 && (
          <div className="flex items-center gap-3">
            <button
              suppressHydrationWarning
              onClick={clearWishlist}
              className="h-10 px-4 rounded-[14px] bg-neutral-100 hover:bg-neutral-200 text-xs font-semibold text-[#6E6E73] hover:text-[#1D1D1F] transition-colors"
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* Grid or Empty State */}
      {items.length === 0 ? (
        <div className="py-20 text-center rounded-[32px] bg-white/60 dark:bg-[#18181A]/60 backdrop-blur-xl border border-black/5 dark:border-white/5 space-y-4 max-w-xl mx-auto p-8">
          <div className="w-16 h-16 rounded-[24px] bg-[#E8635A]/10 text-[#E8635A] flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8 stroke-[1.8]" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-[#1D1D1F] dark:text-white">
              No saved items yet
            </h3>
            <p className="text-xs text-[#6E6E73] max-w-xs mx-auto">
              Tap the heart icon on any hardware piece across the store to save it to your personal wishlist.
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 h-11 px-6 rounded-[16px] bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs font-semibold shadow-sm transition-all active:scale-[0.97]"
            >
              <span>Explore Hardware</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      )}
    </div>
  );
}
