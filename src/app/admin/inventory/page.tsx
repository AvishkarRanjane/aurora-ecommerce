"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  PackageCheck,
  Search,
  Star,
  Trash2,
  ExternalLink,
  Sliders,
  Filter,
  CheckCircle2
} from "lucide-react";
import { getStoredProducts, STORAGE_KEYS } from "@/lib/mockData";
import { ProductDetailData } from "@/types/api";
import { useToast } from "@/context/ToastContext";
import { formatPrice } from "@/lib/utils";

export default function AdminGlobalInventoryPage() {
  const { success } = useToast();
  const [products, setProducts] = useState<ProductDetailData[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  useEffect(() => {
    setProducts(getStoredProducts());
  }, []);

  const saveProducts = (updated: ProductDetailData[]) => {
    setProducts(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updated));
    }
  };

  const toggleFeatured = (productId: number) => {
    const updated = products.map((p) => {
      if (p.id === productId) {
        return { ...p, is_featured: !p.is_featured };
      }
      return p;
    });
    saveProducts(updated);
    const item = updated.find((p) => p.id === productId);
    success(item?.is_featured ? `Featured "${item.name}" on homepage hero.` : `Removed "${item?.name}" from hero.`);
  };

  const handleDelete = (productId: number, title: string) => {
    if (confirm(`Admin action: Delete SKU #${productId} ("${title}") from global marketplace?`)) {
      const updated = products.filter((p) => p.id !== productId);
      saveProducts(updated);
      success(`Listing deleted from global index.`);
    }
  };

  const filtered = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.category_name && p.category_name.toLowerCase().includes(search.toLowerCase()));
    const matchCat = categoryFilter === "ALL" || p.category_name === categoryFilter;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-6 py-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Global Marketplace Inventory
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Omnichannel catalog spanning all verified partner studios. Curate featured releases and audit listings.
          </p>
        </div>

        <Link
          href="/seller/products/new"
          className="px-4 py-2 rounded-full bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs shadow-md transition-all self-start sm:self-auto"
        >
          + Add New SKU Listing
        </Link>
      </div>

      {/* Filter and Search */}
      <div className="p-4 rounded-[24px] bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/10 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search across all listings by title or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-4 rounded-full bg-neutral-50 dark:bg-neutral-800 text-xs focus:outline-none focus:border-amber-500 border border-transparent"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="h-9 px-3 rounded-full bg-neutral-50 dark:bg-neutral-800 text-xs text-neutral-700 dark:text-neutral-300 border border-transparent focus:outline-none"
        >
          <option value="ALL">All Categories</option>
          <option value="Audio & Acoustics">Audio & Acoustics</option>
          <option value="Wearables & Watch">Wearables & Watch</option>
          <option value="Computing & Displays">Computing & Displays</option>
          <option value="Smartphones & Tablets">Smartphones & Tablets</option>
          <option value="MagCharge & Accessories">Accessories</option>
        </select>
      </div>

      {/* Global Table */}
      <div className="rounded-[28px] bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/10 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 dark:bg-neutral-800/50 text-neutral-500 uppercase tracking-wider font-semibold border-b border-black/5 dark:border-white/5">
              <tr>
                <th className="py-3 px-4">Hardware SKU</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Keynote Featured</th>
                <th className="py-3 px-4 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/5">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 overflow-hidden relative shrink-0 border border-black/5">
                        {item.image_url ? (
                          <Image src={item.image_url} alt={item.name} fill className="object-cover" />
                        ) : (
                          <PackageCheck className="w-5 h-5 text-neutral-400 m-auto" />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-neutral-900 dark:text-white">
                          {item.name}
                        </div>
                        <div className="text-[10px] text-neutral-400 font-mono">
                          ID: #{item.id} • Rating: {item.rating} ★
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400">
                    {item.category_name}
                  </td>

                  <td className="py-3 px-4 font-bold text-neutral-900 dark:text-white">
                    {formatPrice(item.price)}
                  </td>

                  <td className="py-3 px-4 font-medium">
                    <span className={(item.stock || 0) < 15 ? "text-amber-600" : "text-neutral-700 dark:text-neutral-300"}>
                      {item.stock} units
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <button
                      onClick={() => toggleFeatured(item.id)}
                      className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all flex items-center gap-1 ${
                        item.is_featured
                          ? "bg-amber-500/20 text-amber-600 border border-amber-500/40"
                          : "bg-neutral-100 dark:bg-neutral-800 text-neutral-400 hover:text-neutral-700"
                      }`}
                    >
                      <Star className={`w-3 h-3 ${item.is_featured ? "fill-current" : ""}`} />
                      <span>{item.is_featured ? "Hero Featured" : "Standard"}</span>
                    </button>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/product/${item.id}`}
                        target="_blank"
                        className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 hover:text-neutral-900 transition-colors"
                        title="View Live PDP"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>

                      <button
                        onClick={() => handleDelete(item.id, item.name)}
                        className="p-1.5 rounded-lg hover:bg-rose-50 text-neutral-400 hover:text-rose-600 transition-colors"
                        title="Delete listing globally"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
