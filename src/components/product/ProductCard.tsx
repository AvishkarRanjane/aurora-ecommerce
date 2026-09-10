"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Check, Star } from "lucide-react";
import { ProductResponse } from "@/types/api";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

import { formatPrice } from "@/lib/utils";

interface ProductCardProps {
  product: ProductResponse;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const isSaved = isInWishlist(product.id);

  const handleAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAdding) return;

    setIsAdding(true);
    try {
      await addToCart(product.id, 1, product);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1600);
    } catch {
    } finally {
      setIsAdding(false);
    }
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex flex-col justify-between rounded-[26px] aurora-glass-card p-4 sm:p-5"
    >
      {/* Top Bar: Badge & Wishlist Heart */}
      <div className="flex items-center justify-between mb-4 z-10">
        <div>
          {product.badge ? (
            <span className="inline-block px-3 py-1 rounded-full bg-black/5 text-[11px] font-semibold tracking-tight text-neutral-900 uppercase">
              {product.badge}
            </span>
          ) : product.original_price && product.original_price > product.price ? (
            <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 text-[11px] font-semibold tracking-tight text-[#0D6E5D]">
              Save {formatPrice(product.original_price - product.price)}
            </span>
          ) : (
            <span className="inline-block text-[11px] font-medium text-neutral-500">
              {product.category_name || "Hardware"}
            </span>
          )}
        </div>

        <button
          suppressHydrationWarning
          onClick={handleWishlist}
          aria-label={isSaved ? "Remove from wishlist" : "Add to wishlist"}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all active:scale-[0.9] ${
            isSaved
              ? "bg-rose-50 text-rose-600"
              : "bg-black/[0.04] text-neutral-500 hover:text-neutral-950 hover:bg-black/[0.08]"
          }`}
        >
          <Heart
            className={`w-3.5 h-3.5 transition-transform ${
              isSaved ? "fill-rose-500 stroke-rose-500 scale-110" : "stroke-[1.8]"
            }`}
          />
        </button>
      </div>

      {/* Product Image Stage */}
      <Link href={`/product/${product.id}`} className="block relative aspect-square rounded-[20px] bg-gradient-to-b from-neutral-50/50 to-neutral-100/50 overflow-hidden mb-4 flex items-center justify-center">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <ShoppingBag className="w-12 h-12 text-neutral-300" />
        )}
      </Link>

      {/* Product Meta Details */}
      <div className="space-y-2 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-neutral-600 mb-1">
            <div className="flex items-center text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-400 stroke-none" />
            </div>
            <span className="font-bold text-neutral-950">
              {product.rating?.toFixed(1) || "4.9"}
            </span>
            <span className="font-medium text-neutral-500">({product.review_count || 128})</span>
          </div>

          <Link href={`/product/${product.id}`}>
            <h3 className="font-bold text-base text-neutral-950 tracking-tight hover:text-[#0D6E5D] transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>
          <p className="text-xs text-neutral-600 font-normal line-clamp-2 mt-1 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Pricing & Add to Bag Button */}
        <div className="pt-4 mt-2 border-t border-black/5 flex items-center justify-between gap-3">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-base font-extrabold text-neutral-950 tabular-nums">
                {formatPrice(product.price)}
              </span>
              {product.original_price && product.original_price > product.price && (
                <span className="text-xs text-neutral-400 line-through tabular-nums font-medium">
                  {formatPrice(product.original_price)}
                </span>
              )}
            </div>
            <span className="text-[10px] text-[#0D6E5D] font-bold block">
              Free Express Delivery
            </span>
          </div>

          <button
            suppressHydrationWarning
            onClick={handleAdd}
            disabled={isAdding}
            className={`h-9 px-4 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-[0.97] ${
              justAdded
                ? "bg-emerald-600 text-white"
                : "bg-[#0D6E5D] hover:bg-[#0A584A] text-white shadow-xs"
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[2.2]" />
                <span>Added</span>
              </>
            ) : isAdding ? (
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5 stroke-[1.8]" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default ProductCard;
