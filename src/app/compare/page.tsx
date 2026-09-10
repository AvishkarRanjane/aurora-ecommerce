"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  GitCompare,
  X,
  Plus,
  ShoppingBag,
  Star,
  Check,
  Shield,
  ArrowRight
} from "lucide-react";
import { getStoredProducts } from "@/lib/mockData";
import { ProductDetailData } from "@/types/api";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { formatPrice } from "@/lib/utils";

export default function CompareProductsPage() {
  const { addItem, openDrawer } = useCart();
  const { success } = useToast();
  const [allProducts, setAllProducts] = useState<ProductDetailData[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([1, 2, 3]);

  useEffect(() => {
    const prods = getStoredProducts();
    setAllProducts(prods);
  }, []);

  const selectedProducts = selectedIds
    .map((id) => allProducts.find((p) => p.id === id))
    .filter(Boolean) as ProductDetailData[];

  const removeProduct = (id: number) => {
    setSelectedIds(selectedIds.filter((x) => x !== id));
  };

  const addProduct = (id: number) => {
    if (!selectedIds.includes(id) && selectedIds.length < 4) {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const availableToAdd = allProducts.filter((p) => !selectedIds.includes(p.id));

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white flex items-center gap-2">
          <GitCompare className="w-7 h-7 text-indigo-500" />
          <span>Side-by-Side Hardware Comparison</span>
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          Evaluate acoustic drivers, titanium tolerances, display nits, and battery runtime across our lineup.
        </p>
      </div>

      {/* Add More Product Chips */}
      {selectedIds.length < 4 && availableToAdd.length > 0 && (
        <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-black/5 dark:border-white/10 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-neutral-500 font-medium">Add to comparison:</span>
          {availableToAdd.slice(0, 4).map((p) => (
            <button
              key={p.id}
              onClick={() => addProduct(p.id)}
              className="px-3 py-1 rounded-full bg-white dark:bg-neutral-800 border border-black/5 text-neutral-700 dark:text-neutral-300 hover:border-indigo-500 flex items-center gap-1 transition-all"
            >
              <Plus className="w-3 h-3" />
              <span>{p.name}</span>
            </button>
          ))}
        </div>
      )}

      {/* Comparison Grid Table */}
      <div className="overflow-x-auto rounded-[32px] bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/10 shadow-sm">
        <table className="w-full text-left text-xs min-w-[650px]">
          {/* Products Header Row */}
          <thead>
            <tr className="border-b border-black/5 dark:border-white/5 divide-x divide-black/5 dark:divide-white/5">
              <th className="p-6 w-48 text-neutral-400 uppercase tracking-wider font-semibold">
                Specs Overview
              </th>
              {selectedProducts.map((p) => (
                <th key={p.id} className="p-6 w-64 align-top">
                  <div className="space-y-4">
                    <div className="flex justify-end">
                      <button
                        onClick={() => removeProduct(p.id)}
                        className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white p-1 rounded-full hover:bg-black/5 transition-colors"
                        title="Remove"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="w-full h-36 relative rounded-2xl overflow-hidden bg-neutral-50 dark:bg-neutral-800 border border-black/5">
                      {p.image_url && (
                        <Image src={p.image_url} alt={p.name} fill className="object-cover" />
                      )}
                    </div>

                    <div className="space-y-1">
                      <h3 className="font-bold text-sm text-neutral-900 dark:text-white line-clamp-1">
                        {p.name}
                      </h3>
                      <div className="text-sm font-extrabold text-neutral-900 dark:text-white">
                        {formatPrice(p.price)}
                      </div>
                      <div className="flex items-center text-amber-500 text-[11px] font-semibold gap-1">
                        <Star className="w-3 h-3 fill-current" />
                        <span>{p.rating}</span>
                        <span className="text-neutral-400 font-normal">({p.review_count})</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        addItem(p);
                        success(`Added ${p.name} to your bag!`);
                        openDrawer();
                      }}
                      className="w-full py-2 rounded-full bg-neutral-900 dark:bg-white hover:bg-neutral-800 text-white dark:text-neutral-950 font-semibold text-xs transition-all shadow-xs flex items-center justify-center gap-1.5"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Add to Bag</span>
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Spec Rows */}
          <tbody className="divide-y divide-black/5 dark:divide-white/5">
            {/* Category */}
            <tr className="divide-x divide-black/5 dark:divide-white/5">
              <td className="p-4 font-semibold text-neutral-500">Category</td>
              {selectedProducts.map((p) => (
                <td key={p.id} className="p-4 font-medium text-neutral-800 dark:text-neutral-200">
                  {p.category_name}
                </td>
              ))}
            </tr>

            {/* Acoustic / Driver Architecture */}
            <tr className="divide-x divide-black/5 dark:divide-white/5 bg-neutral-50/50 dark:bg-neutral-850/30">
              <td className="p-4 font-semibold text-neutral-500">Acoustics & Transducer</td>
              {selectedProducts.map((p) => (
                <td key={p.id} className="p-4 text-neutral-700 dark:text-neutral-300">
                  {p.specs?.["Acoustic Architecture"] || p.specs?.["Display"] || "Custom Aurelian Dynamic Architecture"}
                </td>
              ))}
            </tr>

            {/* Battery Runtime */}
            <tr className="divide-x divide-black/5 dark:divide-white/5">
              <td className="p-4 font-semibold text-neutral-500">Battery & Power</td>
              {selectedProducts.map((p) => (
                <td key={p.id} className="p-4 text-neutral-700 dark:text-neutral-300">
                  {p.specs?.["Battery Life"] || p.specs?.["Battery"] || "All-Day Runtime"}
                </td>
              ))}
            </tr>

            {/* Materials & Chassis */}
            <tr className="divide-x divide-black/5 dark:divide-white/5 bg-neutral-50/50 dark:bg-neutral-850/30">
              <td className="p-4 font-semibold text-neutral-500">Materials & Chassis</td>
              {selectedProducts.map((p) => (
                <td key={p.id} className="p-4 text-neutral-700 dark:text-neutral-300">
                  {p.specs?.["Materials"] || "Titanium Grade 5 & Sapphire Glass"}
                </td>
              ))}
            </tr>

            {/* Connectivity */}
            <tr className="divide-x divide-black/5 dark:divide-white/5">
              <td className="p-4 font-semibold text-neutral-500">Connectivity</td>
              {selectedProducts.map((p) => (
                <td key={p.id} className="p-4 text-neutral-700 dark:text-neutral-300">
                  {p.specs?.["Connectivity"] || "Bluetooth 5.4, USB-C 3.2 Lossless"}
                </td>
              ))}
            </tr>

            {/* Warranty */}
            <tr className="divide-x divide-black/5 dark:divide-white/5 bg-neutral-50/50 dark:bg-neutral-850/30">
              <td className="p-4 font-semibold text-neutral-500">AurelianCare+ Warranty</td>
              {selectedProducts.map((p) => (
                <td key={p.id} className="p-4 text-emerald-600 font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>2 Years Comprehensive</span>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
