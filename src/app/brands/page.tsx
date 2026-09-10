"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Store, ShieldCheck, Star, ArrowRight, Sparkles } from "lucide-react";
import { getStoredSellers } from "@/lib/mockData";
import { SellerProfile } from "@/types/api";

export default function BrandsShowcasePage() {
  const [sellers, setSellers] = useState<SellerProfile[]>([]);

  useEffect(() => {
    setSellers(getStoredSellers());
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-10 py-6">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 tracking-wider uppercase">
          Design Houses & Engineering Guilds
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
          Verified Independent Hardware Studios
        </h1>
        <p className="text-xs text-neutral-500">
          Discover certified manufacturers pushing the boundaries of titanium ergonomics, lossless acoustics, and neural computing.
        </p>
      </div>

      {/* Brand Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sellers.map((seller) => (
          <div
            key={seller.id}
            className="p-8 rounded-[32px] bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/10 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between space-y-6 group"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-lg shadow-xs group-hover:scale-105 transition-transform">
                  {seller.businessName[0]}
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Verified</span>
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                  {seller.businessName}
                </h3>
                <div className="flex items-center gap-2 text-xs text-neutral-400 mt-0.5">
                  <span>{seller.category}</span>
                  <span>•</span>
                  <span className="text-amber-500 font-semibold flex items-center gap-0.5">
                    <Star className="w-3 h-3 fill-current" />
                    <span>{seller.rating}</span>
                  </span>
                </div>
              </div>

              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed line-clamp-3">
                {seller.storeDescription}
              </p>
            </div>

            <div className="pt-4 border-t border-black/5 dark:border-white/5 flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-400">
                {seller.totalSales}+ units shipped
              </span>

              <Link
                href={`/seller/store/${seller.id}`}
                className="px-4 py-2 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs transition-all shadow-xs flex items-center gap-1.5"
              >
                <span>Visit Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
