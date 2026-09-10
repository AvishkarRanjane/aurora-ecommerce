"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Flame,
  Clock,
  Tag,
  ArrowRight,
  Repeat,
  Zap,
  Sparkles,
  CheckCircle2
} from "lucide-react";
import { getStoredProducts } from "@/lib/mockData";
import { ProductDetailData } from "@/types/api";
import ProductCard from "@/components/product/ProductCard";
import { useToast } from "@/context/ToastContext";
import { Modal } from "@/components/ui/Modal";
import { formatPrice } from "@/lib/utils";

export default function DealsOffersPage() {
  const { success } = useToast();
  const [products, setProducts] = useState<ProductDetailData[]>([]);
  const [exchangeOpen, setExchangeOpen] = useState(false);
  const [exchangeQuote, setExchangeQuote] = useState<number | null>(null);
  const [exchangeDevice, setExchangeDevice] = useState("Apple AirPods Max");
  const [exchangeCondition, setExchangeCondition] = useState("Flawless");

  const [timeLeft, setTimeLeft] = useState({
    hours: 14,
    minutes: 42,
    seconds: 15,
  });

  useEffect(() => {
    setProducts(getStoredProducts());

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleCalculateExchange = (e: React.FormEvent) => {
    e.preventDefault();
    let base = 18000;
    if (exchangeCondition === "Flawless") base += 6000;
    if (exchangeCondition === "Good") base += 3000;
    setExchangeQuote(base);
  };

  const flashDeals = products.slice(0, 4);

  return (
    <div className="space-y-12 py-4">
      {/* Keynote Flash Sale Hero - Aurora Ultra Glass */}
      <section className="relative rounded-[36px] overflow-hidden ultra-glass p-8 sm:p-12 border border-white/90 shadow-[0_12px_40px_rgba(0,0,0,0.04)] space-y-6">
        {/* Soft atmospheric ambient glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-rose-300/20 via-orange-200/15 to-transparent rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-emerald-300/20 via-teal-200/15 to-transparent rounded-full blur-3xl pointer-events-none -ml-16 -mb-16" />

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full ultra-glass-pill text-rose-700 border border-rose-200/60 text-xs font-bold uppercase tracking-wider shadow-xs">
            <Flame className="w-3.5 h-3.5 fill-rose-500 text-rose-600 animate-pulse" />
            <span>24-Hour Flash Keynote Drop</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-[1.12] text-neutral-950">
            Up to ₹20,000 Off Titanium Acoustics & Pro Hardware.
          </h1>

          <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed max-w-lg font-medium">
            Limited batch allocations straight from our engineering lab. Includes complimentary express India delivery and 2-year AuroraCare+.
          </p>

          {/* Countdown Clock - Frosted Glass Pills */}
          <div className="pt-2 flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 ultra-glass-pill px-4 py-2 rounded-2xl border border-white/95 shadow-sm text-center">
              <span className="font-mono text-xl font-extrabold text-neutral-950">
                {String(timeLeft.hours).padStart(2, "0")}
              </span>
              <span className="text-[10px] text-neutral-500 uppercase font-bold">hrs</span>
            </div>
            <span className="font-extrabold text-neutral-400 text-base">:</span>
            <div className="flex items-center gap-1.5 ultra-glass-pill px-4 py-2 rounded-2xl border border-white/95 shadow-sm text-center">
              <span className="font-mono text-xl font-extrabold text-neutral-950">
                {String(timeLeft.minutes).padStart(2, "0")}
              </span>
              <span className="text-[10px] text-neutral-500 uppercase font-bold">min</span>
            </div>
            <span className="font-extrabold text-neutral-400 text-base">:</span>
            <div className="flex items-center gap-1.5 ultra-glass-pill px-4 py-2 rounded-2xl border border-white/95 shadow-sm text-center">
              <span className="font-mono text-xl font-extrabold text-neutral-950">
                {String(timeLeft.seconds).padStart(2, "0")}
              </span>
              <span className="text-[10px] text-neutral-500 uppercase font-bold">sec</span>
            </div>
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={() => {
                const el = document.getElementById("flash-grid");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-6 py-3.5 rounded-full aurora-btn-primary font-bold text-xs shadow-md hover:scale-105 transition-all"
            >
              Shop Flash Deals
            </button>

            <button
              onClick={() => setExchangeOpen(true)}
              className="px-5 py-3.5 rounded-full ultra-glass-pill text-neutral-900 font-bold text-xs border border-white/90 hover:bg-white transition-all flex items-center gap-1.5 shadow-xs"
            >
              <Repeat className="w-3.5 h-3.5 text-neutral-600" />
              <span>Calculate Trade-in / Exchange</span>
            </button>
          </div>
        </div>
      </section>

      {/* Promo Code Badges Rail */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { code: "APPLE10", off: "10% OFF", desc: "Across all acoustic and wearable releases", min: "No min spend" },
          { code: "PRO20", off: "20% OFF", desc: "On 6K Displays and Book Pro workstations", min: "Orders over ₹40,000" },
          { code: "FREESHIP", off: "EXPRESS AIR", desc: "Complimentary priority express courier", min: "All India" },
        ].map((promo, idx) => (
          <div
            key={idx}
            onClick={() => {
              navigator.clipboard.writeText(promo.code);
              success(`Copied coupon code ${promo.code} to clipboard!`);
            }}
            className="p-5 rounded-[24px] ultra-glass hover:border-emerald-500/40 cursor-pointer transition-all duration-300 hover:scale-[1.02] space-y-2 group shadow-xs"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono font-extrabold text-sm text-neutral-950 group-hover:text-[#0D6E5D] transition-colors">
                {promo.code}
              </span>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-700 border border-rose-500/20">
                {promo.off}
              </span>
            </div>
            <p className="text-xs font-medium text-neutral-600">{promo.desc}</p>
            <span className="text-[10px] text-neutral-400 font-semibold block pt-1 border-t border-black/5">
              {promo.min} • Tap to copy
            </span>
          </div>
        ))}
      </section>

      {/* Flash Sale Hardware Products */}
      <section id="flash-grid" className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-rose-500" />
              <span>Limited Drop Price Cuts</span>
            </h2>
            <p className="text-xs text-neutral-500">
              Prices automatically discounted. Add to bag for instant checkout savings.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {flashDeals.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* Trade-in / Exchange Offer Modal */}
      <Modal
        isOpen={exchangeOpen}
        onClose={() => {
          setExchangeOpen(false);
          setExchangeQuote(null);
        }}
        title="Hardware Exchange & Trade-in Program"
        description="Trade in your current device for instant credit toward any Aurelian flagship."
        maxWidth="md"
      >
        <form onSubmit={handleCalculateExchange} className="space-y-4 pt-2 text-xs">
          <div>
            <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Select Device to Trade In
            </label>
            <select
              value={exchangeDevice}
              onChange={(e) => setExchangeDevice(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs focus:outline-none"
            >
              <option>Apple AirPods Max</option>
              <option>Sony WH-1000XM5</option>
              <option>Bose QuietComfort Ultra</option>
              <option>Apple Watch Ultra (Gen 1)</option>
              <option>MacBook Pro 14&quot; M2</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Hardware Functional Condition
            </label>
            <select
              value={exchangeCondition}
              onChange={(e) => setExchangeCondition(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs focus:outline-none"
            >
              <option value="Flawless">Flawless (No scratches, all original packaging)</option>
              <option value="Good">Good (Minor signs of normal wear, functional)</option>
              <option value="Fair">Fair (Noticeable scratches, degraded battery)</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full h-10 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs transition-colors"
          >
            Calculate Instant Credit Quote
          </button>

          {exchangeQuote && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-2">
              <span className="text-[11px] uppercase font-bold text-emerald-600 block">
                Estimated Trade-in Credit Value
              </span>
              <div className="text-3xl font-extrabold text-neutral-950">
                {formatPrice(exchangeQuote)}
              </div>
              <p className="text-[11px] text-neutral-500 font-medium">
                Applied as an instant deduction at checkout. We provide a prepaid shipping return kit for your old device.
              </p>
              <button
                type="button"
                onClick={() => {
                  success(`${formatPrice(exchangeQuote)} trade-in voucher claimed!`);
                  setExchangeOpen(false);
                }}
                className="px-5 py-2.5 rounded-full aurora-btn-primary font-bold text-xs transition-all shadow-xs"
              >
                Apply Voucher to Cart
              </button>
            </div>
          )}
        </form>
      </Modal>
    </div>
  );
}
