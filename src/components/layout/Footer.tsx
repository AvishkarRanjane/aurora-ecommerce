"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck, Truck, RotateCcw, Headphones } from "lucide-react";
import { useToast } from "@/context/ToastContext";

export function Footer() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { success } = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
      success("You are subscribed to Aurelian Keynotes & Releases.");
      setEmail("");
    }
  };

  return (
    <footer className="w-full mt-24 border-t border-neutral-300/80 bg-[#F4F5F7] text-neutral-700 text-xs">
      {/* Trust Badges */}
      <div className="border-b border-black/5 dark:border-white/5 py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div className="flex items-start gap-3">
              <Truck className="w-5 h-5 text-[#0D6E5D] shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-[#1D1D1F] dark:text-white">
                  Express Delivery
                </h4>
                <p className="text-[11px] mt-0.5">Complimentary across India on orders over ₹999</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#0D6E5D] shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-[#1D1D1F] dark:text-white">
                  2-Year AuroraCare
                </h4>
                <p className="text-[11px] mt-0.5">Comprehensive hardware protection</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <RotateCcw className="w-5 h-5 text-[#0D6E5D] shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-[#1D1D1F] dark:text-white">
                  30-Day Returns
                </h4>
                <p className="text-[11px] mt-0.5">Hassle-free return pickup</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Headphones className="w-5 h-5 text-[#0D6E5D] shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-[#1D1D1F] dark:text-white">
                  Expert Concierge
                </h4>
                <p className="text-[11px] mt-0.5">24/7 dedicated hardware support</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Directory Columns */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand Column & Newsletter */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-[8px] bg-[#1D1D1F] text-white flex items-center justify-center font-bold text-xs">
                A
              </div>
              <span className="font-semibold text-sm text-[#1D1D1F] dark:text-white tracking-tight">
                Aurelian Systems
              </span>
            </div>
            <p className="text-xs text-[#6E6E73] leading-relaxed max-w-sm">
              Engineered for absolute fidelity, precision titanium ergonomics, and calm industrial craftsmanship.
            </p>

            <div className="pt-2">
              <p className="text-xs font-semibold text-[#1D1D1F] dark:text-white mb-2">
                Subscribe to Keynote Announcements
              </p>
              {isSubscribed ? (
                <div className="flex items-center gap-2 text-[#2FA84F] font-medium bg-[#2FA84F]/10 px-3 py-2 rounded-[12px]">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>You are on our private announcement list.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm">
                  <input
                    suppressHydrationWarning
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 h-9 px-3.5 rounded-[12px] bg-white dark:bg-[#1E1E20] border border-black/10 dark:border-white/10 text-xs text-[#1D1D1F] dark:text-white placeholder-[#6E6E73] focus:outline-none focus:border-[#0071E3]"
                  />
                  <button
                    suppressHydrationWarning
                    type="submit"
                    className="h-9 px-4 rounded-[12px] bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs font-semibold shrink-0 transition-colors"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Shop Hardware */}
          <div className="space-y-3">
            <h4 className="font-semibold text-[#1D1D1F] dark:text-white text-xs uppercase tracking-wider">
              Explore & Shop
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/catalog" className="hover:text-[#1D1D1F] dark:hover:text-white transition-colors">
                  All Hardware
                </Link>
              </li>
              <li>
                <Link href="/deals" className="hover:text-[#1D1D1F] dark:hover:text-white transition-colors flex items-center gap-1.5">
                  <span>Flash Deals & Drops</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 text-[9px] font-bold">HOT</span>
                </Link>
              </li>
              <li>
                <Link href="/compare" className="hover:text-[#1D1D1F] dark:hover:text-white transition-colors">
                  Compare Specs
                </Link>
              </li>
              <li>
                <Link href="/brands" className="hover:text-[#1D1D1F] dark:hover:text-white transition-colors">
                  Design Houses & Brands
                </Link>
              </li>
              <li>
                <Link href="/gift-cards" className="hover:text-[#1D1D1F] dark:hover:text-white transition-colors">
                  Gift Cards
                </Link>
              </li>
              <li>
                <Link href="/stores" className="hover:text-[#1D1D1F] dark:hover:text-white transition-colors">
                  Store Locator
                </Link>
              </li>
            </ul>
          </div>

          {/* Account & Perks */}
          <div className="space-y-3">
            <h4 className="font-semibold text-[#1D1D1F] dark:text-white text-xs uppercase tracking-wider">
              Buyer Hub & Perks
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/profile" className="hover:text-[#1D1D1F] dark:hover:text-white transition-colors">
                  My Account Hub
                </Link>
              </li>
              <li>
                <Link href="/profile?tab=orders" className="hover:text-[#1D1D1F] dark:hover:text-white transition-colors">
                  Order History & Tracking
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-[#1D1D1F] dark:hover:text-white transition-colors">
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link href="/loyalty" className="hover:text-[#1D1D1F] dark:hover:text-white transition-colors">
                  Aurora Club Rewards
                </Link>
              </li>
              <li>
                <Link href="/referral" className="hover:text-[#1D1D1F] dark:hover:text-white transition-colors">
                  Refer a Friend (₹2,500)
                </Link>
              </li>
              <li>
                <Link href="/help" className="hover:text-[#1D1D1F] dark:hover:text-white transition-colors">
                  Customer Support & FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Merchant & Platform */}
          <div className="space-y-3">
            <h4 className="font-semibold text-[#1D1D1F] dark:text-white text-xs uppercase tracking-wider">
              Ecosystem
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/seller" className="hover:text-[#1D1D1F] dark:hover:text-white transition-colors font-medium text-indigo-600 dark:text-indigo-400">
                  Become a Seller →
                </Link>
              </li>
              <li>
                <Link href="/seller/dashboard" className="hover:text-[#1D1D1F] dark:hover:text-white transition-colors">
                  Seller Central
                </Link>
              </li>
              <li>
                <Link href="/admin/dashboard" className="hover:text-[#1D1D1F] dark:hover:text-white transition-colors text-amber-600 dark:text-amber-400">
                  ⚡ Admin Console
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-[#1D1D1F] dark:hover:text-white transition-colors">
                  Engineering Journal (Blog)
                </Link>
              </li>
              <li>
                <Link href="/app-download" className="hover:text-[#1D1D1F] dark:hover:text-white transition-colors">
                  iOS & Android App
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-black/5 dark:border-white/5 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#6E6E73]">
          <p suppressHydrationWarning>
            Copyright © {new Date().getFullYear()} Aurelian Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="hover:underline cursor-pointer">Privacy Policy</span>
            <span className="hover:underline cursor-pointer">Terms of Sale</span>
            <span className="hover:underline cursor-pointer">Legal</span>
            <span className="hover:underline cursor-pointer">Site Map</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
