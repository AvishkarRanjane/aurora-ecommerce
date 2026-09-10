"use client";

import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  TrendingUp,
  Globe2,
  DollarSign,
  Package,
  Headphones,
  CheckCircle2,
  ArrowRight,
  Store
} from "lucide-react";

export default function BecomeSellerPage() {
  const perks = [
    {
      icon: Globe2,
      title: "Reach 2.4M+ Fidelity Enthusiasts",
      desc: "Instant access to verified hardware buyers seeking titanium acoustic gear, premium monitors, and precision accessories."
    },
    {
      icon: DollarSign,
      title: "Industry-Low 12.5% Commission",
      desc: "Transparent fees with zero hidden listing charges. Keep 87.5% of every transaction disbursed weekly via ACH."
    },
    {
      icon: TrendingUp,
      title: "Automated Global Logistics",
      desc: "Print discounted courier labels, dispatch via DHL Express or FedEx, and provide buyers with sub-second tracking."
    },
    {
      icon: ShieldCheck,
      title: "Zero-Fraud Merchant Protection",
      desc: "AI chargeback mitigation and guaranteed escrow settlements safeguard your studio against fraudulent claims."
    }
  ];

  const steps = [
    {
      step: "01",
      title: "Register Your Studio",
      desc: "Provide your business entity, tax ID, and verified payout bank account in under 4 minutes."
    },
    {
      step: "02",
      title: "Upload Your Catalog",
      desc: "Create bespoke listings with high-resolution imagery, lossless audio specs, and inventory counts."
    },
    {
      step: "03",
      title: "Fulfill & Receive Payouts",
      desc: "Pack and dispatch with automated shipping labels. Enjoy automatic 7-day rolling bank payouts."
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-16 py-6 sm:py-12">
      {/* Keynote Hero */}
      <section className="relative rounded-[36px] overflow-hidden aurora-glass-card p-8 sm:p-14 border border-white/80 shadow-[0_10px_35px_rgba(0,0,0,0.04)]">
        <div className="absolute -right-24 -top-24 w-96 h-96 bg-emerald-400/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-teal-400/15 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-2xl relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 text-[#0D6E5D] border border-emerald-500/20 text-xs font-bold shadow-xs">
            <Store className="w-3.5 h-3.5 text-[#0D6E5D]" />
            <span>Aurora Merchant Network</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-[1.12] text-neutral-950">
            Sell to the most discerning hardware audience in the world.
          </h1>

          <p className="text-neutral-600 text-sm sm:text-base font-medium leading-relaxed">
            Partner with Aurora to distribute master-crafted audio, titanium peripherals, and studio computing to millions of high-intent buyers.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <Link
              href="/seller/register"
              className="px-6 py-3.5 rounded-full aurora-btn-primary font-bold text-sm shadow-md hover:scale-[1.02] transition-all flex items-center gap-2"
            >
              <span>Apply to Sell</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/seller/login"
              className="px-6 py-3.5 rounded-full bg-white/80 hover:bg-white text-neutral-800 font-bold text-sm backdrop-blur-md border border-black/5 hover:border-black/15 transition-all shadow-xs"
            >
              Seller Login
            </Link>
          </div>
        </div>
      </section>

      {/* Metrics Banner */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {[
          { label: "Active Buyers", value: "2.4M+" },
          { label: "Average Order Value", value: "₹41,200" },
          { label: "Rolling Payout Cycle", value: "7 Days" },
          { label: "Seller Net Satisfaction", value: "98.4%" },
        ].map((m, idx) => (
          <div
            key={idx}
            className="p-6 rounded-[28px] aurora-glass-card border border-white/80 shadow-xs text-center"
          >
            <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950">
              {m.value}
            </div>
            <div className="text-xs text-neutral-500 mt-1 font-semibold">{m.label}</div>
          </div>
        ))}
      </section>

      {/* Value Pillars */}
      <section className="space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Built for engineering and design studios.
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500">
            Everything you need to scale from artisanal small batches to global warehouse fulfillment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {perks.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="p-8 rounded-[32px] bg-white dark:bg-neutral-900/80 backdrop-blur-xl border border-black/5 dark:border-white/10 shadow-sm hover:shadow-md transition-shadow space-y-4"
              >
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                  {p.title}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {p.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3 Simple Steps */}
      <section className="rounded-[36px] bg-neutral-100 dark:bg-neutral-900/50 p-8 sm:p-12 border border-black/5 dark:border-white/5 space-y-10">
        <div className="text-center max-w-md mx-auto space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Start selling in 3 simple steps
          </h2>
          <p className="text-xs text-neutral-500">Fast onboarding with human concierge verification.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((s, idx) => (
            <div key={idx} className="space-y-3">
              <span className="text-3xl font-extrabold text-indigo-600/30 dark:text-indigo-400/30">
                {s.step}
              </span>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                {s.title}
              </h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                {s.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="pt-4 text-center">
          <Link
            href="/seller/register"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs transition-all shadow-lg hover:scale-105"
          >
            <span>Begin Registration</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
