"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";

export default function PortalBanner() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isSeller = pathname?.startsWith("/seller");
  const isAdmin = pathname?.startsWith("/admin");
  const isCustomer = !isSeller && !isAdmin;

  return (
    <aside aria-label="Portal switcher" className="fixed bottom-5 right-5 z-50">
      {open ? (
        <div className="p-3.5 rounded-2xl bg-white/95 dark:bg-neutral-900/95 backdrop-blur-2xl border border-black/10 dark:border-white/15 shadow-2xl space-y-2.5 max-w-xs animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center justify-between gap-2 border-b border-black/5 pb-2">
            <span className="text-xs font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
              <span>Switch Interface</span>
            </span>
            <button
              onClick={() => setOpen(false)}
              className="text-neutral-400 hover:text-neutral-700 text-xs p-1 rounded hover:bg-neutral-100"
              aria-label="Close switcher"
            >
              ✕
            </button>
          </div>
          <div className="flex flex-col gap-1 text-xs">
            <a
              href="/"
              className={`px-3 py-2 rounded-xl font-semibold transition-all flex items-center justify-between ${
                isCustomer ? "bg-emerald-50 text-emerald-800 font-bold" : "hover:bg-neutral-100 text-neutral-700"
              }`}
            >
              <span>🛍️ Buyer Store</span>
              {isCustomer && <span className="text-[10px] bg-emerald-200 text-emerald-800 px-1.5 py-0.5 rounded-full">Active</span>}
            </a>
            <a
              href="/seller/dashboard"
              className={`px-3 py-2 rounded-xl font-semibold transition-all flex items-center justify-between ${
                isSeller ? "bg-indigo-50 text-indigo-800 font-bold" : "hover:bg-neutral-100 text-neutral-700"
              }`}
            >
              <span>📦 Seller Central</span>
              {isSeller && <span className="text-[10px] bg-indigo-200 text-indigo-800 px-1.5 py-0.5 rounded-full">Active</span>}
            </a>
            <a
              href="/admin/dashboard"
              className={`px-3 py-2 rounded-xl font-semibold transition-all flex items-center justify-between ${
                isAdmin ? "bg-amber-50 text-amber-800 font-bold" : "hover:bg-neutral-100 text-neutral-700"
              }`}
            >
              <span>⚡ Admin Console</span>
              {isAdmin && <span className="text-[10px] bg-amber-200 text-amber-800 px-1.5 py-0.5 rounded-full">Active</span>}
            </a>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/90 dark:bg-neutral-900/90 text-neutral-900 dark:text-white text-xs font-bold backdrop-blur-xl border border-black/10 dark:border-white/20 shadow-lg hover:shadow-xl hover:scale-105 transition-all"
          title="Switch Portal"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Switch: {isAdmin ? "Admin" : isSeller ? "Seller" : "Store"}</span>
        </button>
      )}
    </aside>
  );
}
