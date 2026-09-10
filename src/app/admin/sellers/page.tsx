"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Building2,
  CheckCircle2,
  XCircle,
  Ban,
  Search,
  ExternalLink,
  ShieldCheck,
  Star,
  DollarSign
} from "lucide-react";
import { getStoredSellers, saveStoredSellers } from "@/lib/mockData";
import { SellerProfile } from "@/types/api";
import { useToast } from "@/context/ToastContext";
import { formatPrice } from "@/lib/utils";

export default function AdminSellersPage() {
  const { success, error: toastError } = useToast();
  const [sellers, setSellers] = useState<SellerProfile[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    setSellers(getStoredSellers());
  }, []);

  const updateSellerStatus = (sellerId: string, status: SellerProfile["status"]) => {
    const updated = sellers.map((s) => {
      if (s.id === sellerId) return { ...s, status };
      return s;
    });
    setSellers(updated);
    saveStoredSellers(updated);

    if (status === "APPROVED") {
      success("Merchant approved for public storefront trading.");
    } else if (status === "REJECTED" || status === "SUSPENDED") {
      toastError(`Merchant status updated to: ${status}`);
    }
  };

  const filtered = sellers.filter((s) => {
    const matchSearch =
      s.businessName.toLowerCase().includes(search.toLowerCase()) ||
      s.ownerName.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "ALL" || s.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6 py-2">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
          Merchant & Seller Governance
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          Review business filings, verify hardware studios, adjust platform commission tiers, and audit store ratings.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 rounded-[24px] bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/10 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search merchants by studio name or contact email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-4 rounded-full bg-neutral-50 dark:bg-neutral-800 text-xs focus:outline-none focus:border-amber-500 border border-transparent"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {["ALL", "APPROVED", "PENDING", "REJECTED", "SUSPENDED"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                statusFilter === st
                  ? "bg-amber-500 text-neutral-950 font-bold shadow-xs"
                  : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Sellers List */}
      <div className="space-y-4">
        {filtered.map((seller) => {
          const isApproved = seller.status === "APPROVED";
          const isPending = seller.status === "PENDING";
          const isSuspended = seller.status === "SUSPENDED";

          return (
            <div
              key={seller.id}
              className="p-6 rounded-[28px] bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/10 shadow-sm space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-black/5 dark:border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center font-bold text-base shrink-0">
                    {seller.businessName[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-bold text-sm text-neutral-900 dark:text-white">
                        {seller.businessName}
                      </h2>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          isApproved
                            ? "bg-emerald-500/15 text-emerald-600"
                            : isPending
                            ? "bg-amber-500/15 text-amber-600"
                            : "bg-rose-500/15 text-rose-600"
                        }`}
                      >
                        {seller.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-500 mt-0.5">
                      Owner: <strong>{seller.ownerName}</strong> • {seller.email} • {seller.phone}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-xs text-neutral-600 dark:text-neutral-300">
                  <div>
                    <span className="text-[10px] text-neutral-400 block uppercase">Total Sales</span>
                    <strong className="text-neutral-900 dark:text-white font-bold">
                      {formatPrice(seller.revenue)}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-400 block uppercase">Rating</span>
                    <span className="text-amber-500 font-bold flex items-center gap-0.5">
                      <Star className="w-3 h-3 fill-current" />
                      <span>{seller.rating}</span>
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-400 block uppercase">Units Sold</span>
                    <strong className="text-neutral-900 dark:text-white font-bold">
                      {seller.totalSales}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-neutral-600 dark:text-neutral-400">
                <p className="line-clamp-2 max-w-xl">
                  {seller.storeDescription}
                </p>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/seller/store/${seller.id}`}
                    target="_blank"
                    className="px-3.5 py-1.5 rounded-full border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 text-xs font-semibold flex items-center gap-1 transition-all"
                  >
                    <span>Inspect Storefront</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>

                  {isPending && (
                    <>
                      <button
                        onClick={() => updateSellerStatus(seller.id, "APPROVED")}
                        className="px-4 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-xs transition-all flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approve Studio</span>
                      </button>
                      <button
                        onClick={() => updateSellerStatus(seller.id, "REJECTED")}
                        className="px-3 py-1.5 rounded-full bg-neutral-200 dark:bg-neutral-800 text-rose-600 text-xs font-medium hover:bg-rose-50 transition-all"
                      >
                        Reject
                      </button>
                    </>
                  )}

                  {isApproved && (
                    <button
                      onClick={() => updateSellerStatus(seller.id, "SUSPENDED")}
                      className="px-3 py-1.5 rounded-full text-neutral-400 hover:text-rose-600 text-xs font-medium transition-colors"
                    >
                      Suspend Store
                    </button>
                  )}

                  {isSuspended && (
                    <button
                      onClick={() => updateSellerStatus(seller.id, "APPROVED")}
                      className="px-3 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
                    >
                      Re-activate
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
