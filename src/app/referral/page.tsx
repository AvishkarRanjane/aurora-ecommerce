"use client";

import React, { useState } from "react";
import { Users, Copy, Check, Gift, DollarSign, Share2, ArrowRight } from "lucide-react";
import { useToast } from "@/context/ToastContext";

export default function ReferralProgramPage() {
  const { success } = useToast();
  const [copied, setCopied] = useState(false);
  const referralLink = "https://aurelian.design/join?ref=AVISHKAR-VIP";

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    success("Personal referral link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-8">
      {/* Header Banner */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 tracking-wider uppercase">
          Client Referral Rewards
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white leading-tight">
          Give ₹2,500. Get ₹2,500.
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
          Introduce colleagues and friends to Aurora. They receive ₹2,500 off their first hardware order, and you earn ₹2,500 in store credit.
        </p>
      </div>

      {/* Referral Link Card */}
      <div className="p-8 rounded-[36px] bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/10 shadow-lg max-w-xl mx-auto space-y-4 text-center">
        <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
          Your Exclusive VIP Invitation Link
        </label>

        <div className="flex items-center gap-2 p-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 border border-black/5">
          <input
            type="text"
            readOnly
            value={referralLink}
            className="flex-1 bg-transparent px-4 text-xs font-mono text-neutral-700 dark:text-neutral-300 focus:outline-none"
          />
          <button
            onClick={handleCopy}
            className="px-5 py-2.5 rounded-full bg-[#0D6E5D] hover:bg-[#0A5649] text-white font-semibold text-xs transition-all shadow-xs flex items-center gap-1.5 shrink-0"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied" : "Copy Link"}</span>
          </button>
        </div>

        <p className="text-[11px] text-neutral-400">
          Share directly on WhatsApp, LinkedIn, X, or via direct messaging.
        </p>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
        {[
          { label: "Friends Invited", val: "6 Friends" },
          { label: "Total Earned", val: "₹15,000" },
          { label: "Available Credit", val: "₹7,500" },
        ].map((m, idx) => (
          <div
            key={idx}
            className="p-6 rounded-[24px] bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/10 shadow-xs text-center space-y-1"
          >
            <div className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
              {m.val}
            </div>
            <div className="text-[11px] text-neutral-500 font-medium">{m.label}</div>
          </div>
        ))}
      </div>

      {/* How it works */}
      <div className="p-8 sm:p-10 rounded-[36px] bg-neutral-100 dark:bg-neutral-900/50 border border-black/5 dark:border-white/5 space-y-8">
        <h2 className="text-xl font-bold text-center text-neutral-900 dark:text-white">
          Three simple steps
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="space-y-2">
            <span className="w-8 h-8 rounded-full bg-[#0D6E5D] text-white text-xs font-bold flex items-center justify-center mx-auto">
              1
            </span>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
              Share Your Link
            </h3>
            <p className="text-xs text-neutral-500">
              Send your personal invitation URL to friends, creators, or colleagues.
            </p>
          </div>

          <div className="space-y-2">
            <span className="w-8 h-8 rounded-full bg-[#0D6E5D] text-white text-xs font-bold flex items-center justify-center mx-auto">
              2
            </span>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
              They Get ₹2,500 Off
            </h3>
            <p className="text-xs text-neutral-500">
              They receive an automatic ₹2,500 discount on their first hardware order.
            </p>
          </div>

          <div className="space-y-2">
            <span className="w-8 h-8 rounded-full bg-[#0D6E5D] text-white text-xs font-bold flex items-center justify-center mx-auto">
              3
            </span>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
              You Receive ₹2,500 Credit
            </h3>
            <p className="text-xs text-neutral-500">
              Once their order ships, ₹2,500 store credit drops automatically into your balance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
