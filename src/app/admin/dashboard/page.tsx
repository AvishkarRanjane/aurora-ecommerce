"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  TrendingUp,
  Users,
  Building2,
  PackageCheck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowUpRight,
  Activity,
  IndianRupee,
  Clock,
  Sparkles
} from "lucide-react";
import { getStoredSellers, saveStoredSellers, getStoredOrders, getStoredAdminUsers } from "@/lib/mockData";
import { SellerProfile, OrderResponse, AdminUserRecord } from "@/types/api";
import { useToast } from "@/context/ToastContext";
import { formatPrice } from "@/lib/utils";

export default function AdminDashboardPage() {
  const { success, error: toastError } = useToast();
  const [sellers, setSellers] = useState<SellerProfile[]>([]);
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [users, setUsers] = useState<AdminUserRecord[]>([]);

  useEffect(() => {
    setSellers(getStoredSellers());
    setOrders(getStoredOrders());
    setUsers(getStoredAdminUsers());
  }, []);

  const pendingSellers = sellers.filter((s) => s.status === "PENDING");

  const handleApproveSeller = (sellerId: string) => {
    const updated = sellers.map((s) => {
      if (s.id === sellerId) return { ...s, status: "APPROVED" as const };
      return s;
    });
    setSellers(updated);
    saveStoredSellers(updated);
    success("Seller application approved! Their shop is now open.");
  };

  const handleRejectSeller = (sellerId: string) => {
    const updated = sellers.map((s) => {
      if (s.id === sellerId) return { ...s, status: "REJECTED" as const };
      return s;
    });
    setSellers(updated);
    saveStoredSellers(updated);
    toastError("Seller application declined.");
  };

  return (
    <div className="space-y-6 py-2">
      {/* Platform Health Status (Easy English) */}
      <div className="p-4 rounded-3xl aurora-glass-card border border-black/5 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-bold text-neutral-950">
            Store Status: All systems working normally
          </span>
          <span className="text-neutral-500 hidden sm:inline">• 100% server uptime • Payment gateways active</span>
        </div>

        <div className="flex items-center gap-4 text-neutral-600 font-medium">
          <span>Safe Payments in Escrow: <strong className="text-neutral-950 font-bold">{formatPrice(2184000)}</strong></span>
          <span>Store Earnings: <strong className="text-neutral-950 font-bold">{formatPrice(1560620)}</strong></span>
        </div>
      </div>

      {/* Global KPIs (Indian Currency & Plain English) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 sm:p-6 rounded-3xl aurora-glass-card border border-black/5 space-y-2">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Sales</span>
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#0D6E5D] flex items-center justify-center font-bold">
              ₹
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950">
            {formatPrice(12485000)}
          </div>
          <div className="flex items-center gap-1 text-xs text-emerald-700 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+24.8% growth this month</span>
          </div>
        </div>

        <div className="p-5 sm:p-6 rounded-3xl aurora-glass-card border border-black/5 space-y-2">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Registered Users</span>
            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950">
            8,420
          </div>
          <div className="text-xs text-neutral-500 font-medium">
            Active buyers and sellers across India
          </div>
        </div>

        <div className="p-5 sm:p-6 rounded-3xl aurora-glass-card border border-black/5 space-y-2">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Sellers</span>
            <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950">
            {sellers.filter((s) => s.status === "APPROVED").length} Verified
          </div>
          <div className="text-xs text-amber-700 font-semibold">
            {pendingSellers.length > 0 ? `${pendingSellers.length} waiting for approval` : "All shops approved"}
          </div>
        </div>

        <div className="p-5 sm:p-6 rounded-3xl aurora-glass-card border border-black/5 space-y-2">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Delivery Success</span>
            <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center">
              <PackageCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950">
            99.2%
          </div>
          <div className="text-xs text-neutral-500 font-medium">
            Orders delivered on time
          </div>
        </div>
      </div>

      {/* Grid: Pending Seller Approvals & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Seller Applications */}
        <div className="lg:col-span-2 p-6 sm:p-7 rounded-[32px] aurora-glass-card border border-black/5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-neutral-950 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#0D6E5D]" />
                <span>New Seller Applications</span>
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Review new store owners wanting to sell on Aurora
              </p>
            </div>
            <Link
              href="/admin/sellers"
              className="text-xs text-[#0D6E5D] font-bold hover:underline"
            >
              See All Sellers →
            </Link>
          </div>

          {pendingSellers.length === 0 ? (
            <div className="p-6 text-center text-xs text-neutral-500 rounded-2xl bg-black/[0.02] border border-black/5">
              🎉 No pending applications! All seller shops are reviewed and active.
            </div>
          ) : (
            <div className="space-y-3">
              {pendingSellers.map((seller) => (
                <div
                  key={seller.id}
                  className="p-4 rounded-2xl bg-white/90 border border-black/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-neutral-950">
                        {seller.businessName}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-800">
                        Waiting for Approval
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-600">
                      Owner: <strong>{seller.ownerName}</strong> ({seller.email}) • Category: {seller.category}
                    </p>
                    <p className="text-[11px] text-neutral-500 italic line-clamp-1">
                      &quot;{seller.storeDescription}&quot;
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleApproveSeller(seller.id)}
                      className="px-4 py-1.5 rounded-full bg-[#0D6E5D] hover:bg-[#0A584A] text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => handleRejectSeller(seller.id)}
                      className="px-3.5 py-1.5 rounded-full bg-neutral-100 hover:bg-rose-50 text-neutral-700 hover:text-rose-600 text-xs font-semibold transition-all flex items-center gap-1"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Decline</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Global Store Activity Feed */}
        <div className="p-6 sm:p-7 rounded-[32px] aurora-glass-card border border-black/5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-neutral-950 flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#0D6E5D]" />
              <span>Recent Store Activity</span>
            </h2>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
              LIVE
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            {[
              { text: "Order #94821 delivered to Bandra, Mumbai", time: "4m ago", tag: "Order" },
              { text: `Payout of ${formatPrice(285400)} cleared for Aurora Prime`, time: "18m ago", tag: "Payout" },
              { text: "Customer Elena Rostova completed order review", time: "32m ago", tag: "Review" },
              { text: "Spring launch banner activated on homepage", time: "1h ago", tag: "Banner" },
              { text: "Aurora Studio Max stock replenished (+15 units)", time: "2h ago", tag: "Inventory" },
            ].map((ev, idx) => (
              <div
                key={idx}
                className="p-3 rounded-2xl bg-white/75 border border-black/5 space-y-1"
              >
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-bold text-[#0D6E5D]">{ev.tag}</span>
                  <span className="text-neutral-400 font-medium">{ev.time}</span>
                </div>
                <p className="text-neutral-800 font-medium">
                  {ev.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
