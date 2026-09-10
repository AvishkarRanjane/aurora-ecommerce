"use client";

import React, { useState, useEffect } from "react";
import { Crown, Sparkles, Gift, Check, ArrowRight, ShieldCheck, Star } from "lucide-react";
import { getStoredLoyalty, saveStoredLoyalty } from "@/lib/mockData";
import { LoyaltyAccount } from "@/types/api";
import { useToast } from "@/context/ToastContext";

export default function LoyaltyProgramPage() {
  const { success, error: toastError } = useToast();
  const [loyalty, setLoyalty] = useState<LoyaltyAccount>({
    points: 1250,
    tier: "GOLD",
    lifetimeSpent: 4290,
    rewardsAvailable: []
  });

  useEffect(() => {
    setLoyalty(getStoredLoyalty());
  }, []);

  const handleRedeem = (rewardId: string, cost: number, title: string) => {
    if (loyalty.points < cost) {
      toastError(`Insufficient points! You need ${cost} points for this perk.`);
      return;
    }

    const updated: LoyaltyAccount = {
      ...loyalty,
      points: loyalty.points - cost,
      rewardsAvailable: loyalty.rewardsAvailable.filter((r) => r.id !== rewardId)
    };

    setLoyalty(updated);
    saveStoredLoyalty(updated);
    success(`Claimed reward: "${title}"! Use voucher at checkout.`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 py-8">
      {/* Keynote Membership Banner */}
      <div className="p-8 sm:p-12 rounded-[36px] bg-gradient-to-tr from-neutral-950 via-zinc-900 to-amber-950/40 text-white border border-amber-500/20 shadow-2xl space-y-6 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
              <Crown className="w-3.5 h-3.5 fill-current" />
              <span>Aurelian Club Membership</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              {loyalty.tier} TIER STATUS
            </h1>
            <p className="text-xs text-neutral-300">
              Account: Avishkar Patel • Lifetime hardware investment: ${loyalty.lifetimeSpent.toLocaleString()}
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 text-center sm:text-right shrink-0">
            <span className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider block">
              Available Rewards Balance
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-amber-400">
              {loyalty.points} <span className="text-sm font-semibold text-white">PTS</span>
            </div>
            <span className="text-[11px] text-emerald-400 font-medium">
              Earning 1 pt per ₹10 spent
            </span>
          </div>
        </div>

        {/* Tier Progress Bar */}
        <div className="space-y-2 relative z-10 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between text-xs text-neutral-300 font-medium">
            <span>BRONZE</span>
            <span>SILVER</span>
            <span className="text-amber-400 font-bold">GOLD (Current)</span>
            <span>TITANIUM</span>
          </div>
          <div className="h-2.5 rounded-full bg-neutral-800 overflow-hidden">
            <div style={{ width: "75%" }} className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full" />
          </div>
          <div className="text-[11px] text-neutral-400 flex items-center justify-between">
            <span>750 pts to Titanium status</span>
            <span>Unlocks private studio drop concierge</span>
          </div>
        </div>
      </div>

      {/* Unlocked Tier Privileges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: Sparkles, title: "Private Pre-Order Window", desc: "Access limited production hardware 48 hours before public launch" },
          { icon: ShieldCheck, title: "AurelianCare+ Extended", desc: "Complimentary extra year of acoustic transducer coverage" },
          { icon: Gift, title: "Bespoke Birthday Gift", desc: "Receive an exclusive titanium desk artifact every calendar year" },
        ].map((p, idx) => {
          const Icon = p.icon;
          return (
            <div
              key={idx}
              className="p-6 rounded-[28px] bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/10 shadow-xs space-y-2"
            >
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
                {p.title}
              </h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                {p.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* Redeemable Rewards Store */}
      <div className="p-6 sm:p-8 rounded-[32px] bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/10 shadow-sm space-y-6">
        <div>
          <h2 className="text-base font-bold text-neutral-900 dark:text-white">
            Redeem Points for Hardware Credit & Perks
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Instant digital coupon codes generated and stored in your account.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {loyalty.rewardsAvailable.map((rw) => (
            <div
              key={rw.id}
              className="p-5 rounded-2xl border border-black/5 dark:border-white/10 bg-neutral-50 dark:bg-neutral-800/60 space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">
                  {rw.pointsNeeded} Points
                </span>
                <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
                  {rw.title}
                </h3>
                <span className="font-mono text-[11px] text-neutral-400 block pt-1">
                  Voucher: {rw.code}
                </span>
              </div>

              <button
                onClick={() => handleRedeem(rw.id, rw.pointsNeeded, rw.title)}
                disabled={loyalty.points < rw.pointsNeeded}
                className="w-full py-2 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 hover:bg-neutral-800 text-xs font-semibold disabled:opacity-40 transition-all"
              >
                {loyalty.points >= rw.pointsNeeded ? "Claim Reward" : "Need More Points"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
