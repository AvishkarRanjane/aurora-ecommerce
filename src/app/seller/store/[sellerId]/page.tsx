"use client";

import React, { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Store,
  ShieldCheck,
  Star,
  Package,
  ArrowLeft,
  CheckCircle2,
  ExternalLink
} from "lucide-react";
import { getStoredSellers, getStoredProducts } from "@/lib/mockData";
import { SellerProfile, ProductDetailData } from "@/types/api";
import ProductCard from "@/components/product/ProductCard";

export default function PublicSellerStorefrontPage({
  params,
}: {
  params: Promise<{ sellerId: string }>;
}) {
  const resolvedParams = use(params);
  const [seller, setSeller] = useState<SellerProfile | null>(null);
  const [products, setProducts] = useState<ProductDetailData[]>([]);

  useEffect(() => {
    const sellers = getStoredSellers();
    const found = sellers.find((s) => s.id === resolvedParams.sellerId) || sellers[0];
    setSeller(found);
    setProducts(getStoredProducts());
  }, [resolvedParams.sellerId]);

  if (!seller) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-6">
      {/* Back Link */}
      <Link
        href="/catalog"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-700 hover:text-neutral-950 px-3 py-1.5 rounded-full bg-white/80 hover:bg-white border border-black/5 transition-all shadow-xs"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to All Hardware</span>
      </Link>

      {/* Store Header Banner - Ultra Glassmorphism */}
      <div className="relative rounded-[36px] overflow-hidden ultra-glass p-8 sm:p-10 border border-white/90 space-y-6">
        {/* Soft pastel ambient glass glows */}
        <div className="absolute -top-16 -right-16 w-80 h-80 bg-gradient-to-br from-emerald-300/25 to-teal-400/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-80 h-80 bg-gradient-to-tr from-amber-200/25 to-rose-200/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl ultra-glass-pill text-[#0D6E5D] flex items-center justify-center font-bold text-xl shadow-md shrink-0 border border-white/95">
              <Store className="w-8 h-8 text-[#0D6E5D] stroke-[1.8]" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950">
                  {seller.businessName}
                </h1>
                <span className="px-3 py-1 rounded-full ultra-glass-pill text-[#0D6E5D] text-xs font-bold flex items-center gap-1.5 shadow-xs border border-white/90">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#0D6E5D]" />
                  <span>Verified Studio</span>
                </span>
              </div>
              <p className="text-xs sm:text-sm font-medium text-neutral-600 mt-1.5">
                Curated by <span className="font-semibold text-neutral-900">{seller.ownerName}</span> • Registered {seller.registeredDate}
              </p>
            </div>
          </div>

          {/* Store Metrics Card - Authentic Apple Glassmorphism Pill */}
          <div className="ultra-glass-pill flex items-center gap-5 px-6 py-3.5 rounded-2xl shrink-0 transition-all duration-300 hover:scale-[1.02] border border-white/95 shadow-[0_10px_30px_rgba(0,0,0,0.06),inset_0_1.5px_2px_rgba(255,255,255,1)]">
            <div className="text-center px-1">
              <div className="text-amber-500 font-extrabold text-base flex items-center justify-center gap-1.5">
                <Star className="w-4 h-4 fill-amber-400 text-amber-500 drop-shadow-xs" />
                <span className="text-neutral-950">{seller.rating}</span>
              </div>
              <div className="text-[11px] font-semibold text-neutral-500 tracking-wide mt-0.5">Store Rating</div>
            </div>
            <div className="h-8 w-[1px] bg-gradient-to-b from-transparent via-black/15 to-transparent" />
            <div className="text-center px-1">
              <div className="font-extrabold text-base text-neutral-950">{seller.totalSales}+</div>
              <div className="text-[11px] font-semibold text-neutral-500 tracking-wide mt-0.5">Units Shipped</div>
            </div>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-neutral-700 max-w-3xl leading-relaxed relative z-10 font-normal border-t border-black/5 pt-4">
          {seller.storeDescription}
        </p>
      </div>

      {/* Hardware Lineup */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-neutral-950 tracking-tight">
              Studio Hardware Lineup
            </h2>
            <p className="text-xs sm:text-sm font-medium text-neutral-600">
              Official products directly supplied and guaranteed by {seller.businessName}.
            </p>
          </div>
          <span className="text-xs font-bold text-neutral-600 px-3 py-1 rounded-full bg-black/[0.04] border border-black/5">
            {products.length} Products
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </div>
    </div>
  );
}
