"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Layers,
  Sparkles,
  Tag,
  PlusCircle,
  Trash2,
  CheckCircle2,
  Eye,
  Sliders
} from "lucide-react";
import { getStoredCMSBanners, saveStoredCMSBanners, AVAILABLE_COUPONS } from "@/lib/mockData";
import { AdminCMSBanner } from "@/types/api";
import { useToast } from "@/context/ToastContext";

export default function AdminContentPage() {
  const { success } = useToast();
  const [banners, setBanners] = useState<AdminCMSBanner[]>([]);
  const [coupons, setCoupons] = useState(AVAILABLE_COUPONS);
  const [newCode, setNewCode] = useState("");
  const [newDiscount, setNewDiscount] = useState("15");
  const [newDesc, setNewDesc] = useState("");

  useEffect(() => {
    setBanners(getStoredCMSBanners());
  }, []);

  const toggleBannerActive = (id: string) => {
    const updated = banners.map((b) => {
      if (b.id === id) return { ...b, isActive: !b.isActive };
      return b;
    });
    setBanners(updated);
    saveStoredCMSBanners(updated);
    success("Homepage keynote banner visibility toggled.");
  };

  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim()) return;

    const item = {
      code: newCode.toUpperCase().trim(),
      discountPercent: Number(newDiscount) || 10,
      description: newDesc || `${newDiscount}% off limited promotion`,
      minSpend: 0
    };

    const updated = [item, ...coupons];
    setCoupons(updated);
    setNewCode("");
    setNewDesc("");
    success(`Promo code "${item.code}" created and active in cart!`);
  };

  const handleDeleteCoupon = (code: string) => {
    const updated = coupons.filter((c) => c.code !== code);
    setCoupons(updated);
    success(`Promo code "${code}" deactivated.`);
  };

  return (
    <div className="space-y-8 py-2">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
          Content Management (CMS) & Promotions
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          Publish keynote hero carousels, configure flash sale announcements, and manage live checkout discount vouchers.
        </p>
      </div>

      {/* Hero Banners Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-500" />
            <span>Storefront Keynote Banners</span>
          </h2>
          <span className="text-xs text-neutral-400">Controls buyer hero section</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {banners.map((b) => (
            <div
              key={b.id}
              className="p-5 rounded-[28px] bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/10 shadow-sm space-y-3 relative overflow-hidden flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-full h-32 rounded-2xl bg-neutral-100 dark:bg-neutral-800 overflow-hidden relative border border-black/5">
                  <Image src={b.imageUrl} alt={b.title} fill className="object-cover" />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/60 text-white backdrop-blur-md text-[10px] font-semibold">
                    {b.tag}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
                    {b.title}
                  </h3>
                  <p className="text-xs text-neutral-500 line-clamp-2 mt-1">
                    {b.subtitle}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-black/5 dark:border-white/5 flex items-center justify-between">
                <button
                  onClick={() => toggleBannerActive(b.id)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                    b.isActive
                      ? "bg-emerald-500/15 text-emerald-600"
                      : "bg-neutral-100 dark:bg-neutral-800 text-neutral-400"
                  }`}
                >
                  {b.isActive ? "Published" : "Draft"}
                </button>

                <span className="text-[11px] text-neutral-400 font-mono">
                  {b.actionUrl}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Coupon & Voucher Manager */}
      <div className="p-6 sm:p-8 rounded-[32px] bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/10 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <Tag className="w-4 h-4 text-amber-500" />
            <span>Active Promotion Codes (Discounts)</span>
          </h2>
          <span className="text-xs text-neutral-400">Applies at checkout</span>
        </div>

        {/* Add Coupon Form */}
        <form
          onSubmit={handleAddCoupon}
          className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-black/5 dark:border-white/5 flex flex-col sm:flex-row items-center gap-3 text-xs"
        >
          <input
            type="text"
            required
            placeholder="PROMO CODE (e.g. VIP25)"
            value={newCode}
            onChange={(e) => setNewCode(e.target.value)}
            className="w-full sm:w-44 h-9 px-3 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 font-mono uppercase font-bold focus:outline-none focus:border-amber-500"
          />

          <input
            type="number"
            required
            placeholder="Discount %"
            value={newDiscount}
            onChange={(e) => setNewDiscount(e.target.value)}
            className="w-full sm:w-28 h-9 px-3 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 font-semibold focus:outline-none focus:border-amber-500"
          />

          <input
            type="text"
            placeholder="Description / Terms"
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            className="flex-1 w-full h-9 px-3 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:border-amber-500"
          />

          <button
            type="submit"
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold transition-all shrink-0 flex items-center justify-center gap-1.5"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Create Code</span>
          </button>
        </form>

        {/* Coupon Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {coupons.map((c) => (
            <div
              key={c.code}
              className="p-4 rounded-2xl border border-dashed border-amber-500/40 bg-amber-500/5 flex items-center justify-between gap-3 text-xs"
            >
              <div>
                <div className="font-mono font-bold text-sm text-neutral-900 dark:text-white">
                  {c.code}
                </div>
                <div className="text-[11px] text-neutral-500 mt-0.5">
                  {c.description}
                </div>
                <span className="text-[10px] font-bold text-amber-600">
                  {c.discountPercent}% Discount
                </span>
              </div>

              <button
                onClick={() => handleDeleteCoupon(c.code)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-600 transition-colors"
                title="Deactivate Code"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
