"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Package,
  PlusCircle,
  Search,
  Check,
  Edit2,
  Trash2,
  ArrowUpDown,
  Filter
} from "lucide-react";
import { getStoredProducts, STORAGE_KEYS } from "@/lib/mockData";
import { ProductDetailData } from "@/types/api";
import { useToast } from "@/context/ToastContext";
import { formatPrice } from "@/lib/utils";

export default function SellerInventoryPage() {
  const { success } = useToast();
  const [products, setProducts] = useState<ProductDetailData[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("all");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editStock, setEditStock] = useState<number>(0);

  useEffect(() => {
    setProducts(getStoredProducts());
  }, []);

  const saveProducts = (updated: ProductDetailData[]) => {
    setProducts(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updated));
    }
  };

  const startEdit = (p: ProductDetailData) => {
    setEditingId(p.id);
    setEditPrice(p.price);
    setEditStock(p.stock || 0);
  };

  const handleSaveEdit = (id: number) => {
    const updated = products.map((p) => {
      if (p.id === id) {
        return { ...p, price: Number(editPrice), stock: Number(editStock) };
      }
      return p;
    });
    saveProducts(updated);
    setEditingId(null);
    success("Product price and inventory updated!");
  };

  const handleDelete = (id: number, name: string) => {
    if (confirm(`Are you sure you want to remove "${name}" from your catalog?`)) {
      const updated = products.filter((p) => p.id !== id);
      saveProducts(updated);
      success(`Removed "${name}" from catalog.`);
    }
  };

  const filtered = products.filter((p) => {
    const matchQuery = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCat === "all" || p.category_name === selectedCat;
    return matchQuery && matchCat;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Studio Inventory Management
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Real-time stock counts, price adjustments, and SKU visibility.
          </p>
        </div>

        <Link
          href="/seller/products/new"
          className="px-4 py-2 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-[24px] bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/10 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search SKUs or product titles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-4 rounded-full bg-neutral-50 dark:bg-neutral-800 text-xs focus:outline-none focus:border-indigo-500 border border-transparent"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="h-9 px-3 rounded-full bg-neutral-50 dark:bg-neutral-800 text-xs text-neutral-700 dark:text-neutral-300 border border-transparent focus:outline-none"
          >
            <option value="all">All Categories</option>
            <option value="Audio & Acoustics">Audio & Acoustics</option>
            <option value="Wearables & Watch">Wearables & Watch</option>
            <option value="Computing & Displays">Computing & Displays</option>
            <option value="Smartphones & Tablets">Smartphones & Tablets</option>
            <option value="MagCharge & Accessories">Accessories</option>
          </select>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="rounded-[28px] bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/10 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 dark:bg-neutral-800/50 text-neutral-500 uppercase tracking-wider font-semibold border-b border-black/5 dark:border-white/5">
              <tr>
                <th className="py-3 px-4">Product Details</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Unit Price</th>
                <th className="py-3 px-4">Inventory Units</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/5">
              {filtered.map((item) => {
                const isEditing = editingId === item.id;
                const stock = item.stock || 0;
                const statusLabel =
                  stock <= 0 ? "Out of Stock" : stock < 15 ? "Low Stock" : "In Stock";
                const statusColor =
                  stock <= 0
                    ? "bg-rose-500/10 text-rose-600"
                    : stock < 15
                    ? "bg-amber-500/10 text-amber-600"
                    : "bg-emerald-500/10 text-emerald-600";

                return (
                  <tr key={item.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 overflow-hidden relative shrink-0 border border-black/5">
                          {item.image_url ? (
                            <Image
                              src={item.image_url}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <Package className="w-5 h-5 text-neutral-400 m-auto" />
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-neutral-900 dark:text-white">
                            {item.name}
                          </div>
                          <div className="text-[10px] text-neutral-400 font-mono">
                            SKU: AUR-{item.id.toString().padStart(4, "0")}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-neutral-500">
                      {item.category_name || "Audio"}
                    </td>

                    <td className="py-3 px-4 font-semibold text-neutral-900 dark:text-white">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editPrice}
                          onChange={(e) => setEditPrice(Number(e.target.value))}
                          className="w-20 h-7 px-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-indigo-500 text-xs"
                        />
                      ) : (
                        formatPrice(item.price)
                      )}
                    </td>

                    <td className="py-3 px-4">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editStock}
                          onChange={(e) => setEditStock(Number(e.target.value))}
                          className="w-20 h-7 px-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-indigo-500 text-xs"
                        />
                      ) : (
                        <span className="font-medium">{stock} units</span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${statusColor}`}>
                        {statusLabel}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      {isEditing ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleSaveEdit(item.id)}
                            className="p-1.5 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
                            title="Save"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => startEdit(item)}
                            className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
                            title="Quick Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id, item.name)}
                            className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 text-neutral-400 hover:text-rose-600 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
