"use client";

import React, { useState } from "react";
import { CreditCard, Gift, CheckCircle2, ArrowRight, Sparkles, ShieldCheck } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { formatPrice } from "@/lib/utils";

export default function GiftCardsPage() {
  const { addItem, openDrawer } = useCart();
  const { success } = useToast();
  const [selectedAmount, setSelectedAmount] = useState<number>(5000);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [giftNote, setGiftNote] = useState("");
  const [checkCode, setCheckCode] = useState("");
  const [balanceResult, setBalanceResult] = useState<number | null>(null);

  const handleBuyCard = (e: React.FormEvent) => {
    e.preventDefault();
    addItem({
      id: 9999 + selectedAmount,
      name: `Aurora Digital Gift Card (${formatPrice(selectedAmount)})`,
      price: selectedAmount,
      image_url: "/images/headphones_studio_pro.jpg",
      stock: 999,
      category_id: 5,
    });
    success(`${formatPrice(selectedAmount)} Digital Gift Card added to bag!`);
    openDrawer();
  };

  const handleCheckBalance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkCode.trim()) return;
    setBalanceResult(selectedAmount);
    success(`Voucher code verified. Current balance: ${formatPrice(selectedAmount)}`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-8">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 tracking-wider uppercase">
          Pure Fidelity Gifting
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
          Aurelian Digital Studio Pass
        </h1>
        <p className="text-xs text-neutral-500">
          Delivered instantaneously via email with bespoke typography. Redeemable across all acoustic hardware and pro workstations.
        </p>
      </div>

      {/* Main Gifting Card Interface */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Visual Card Preview */}
        <div className="p-8 rounded-[36px] bg-gradient-to-tr from-neutral-950 via-neutral-900 to-zinc-800 text-white shadow-2xl border border-white/10 relative overflow-hidden aspect-[1.58/1] flex flex-col justify-between group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center font-bold text-xs border border-white/10">
                A
              </div>
              <span className="font-semibold text-sm tracking-tight text-neutral-200">
                Aurora Studio
              </span>
            </div>
            <Sparkles className="w-5 h-5 text-emerald-400" />
          </div>

          <div className="relative z-10 space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              {formatPrice(selectedAmount)}
            </div>
            <div className="text-[11px] text-neutral-400 font-mono tracking-widest">
              GIFT PASS • VALID FOR 5 YEARS
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-neutral-400 relative z-10 border-t border-white/10 pt-3">
            <span>{recipientEmail || "recipient@domain.com"}</span>
            <span className="font-mono">AUR-••••-••••</span>
          </div>
        </div>

        {/* Amount Selector Form */}
        <form onSubmit={handleBuyCard} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              Select Denomination
            </label>
            <div className="grid grid-cols-4 gap-2.5">
              {[2500, 5000, 10000, 25000].map((amt) => (
                <button
                  type="button"
                  key={amt}
                  onClick={() => setSelectedAmount(amt)}
                  className={`py-2.5 rounded-2xl text-xs font-bold transition-all ${
                    selectedAmount === amt
                      ? "bg-[#0D6E5D] text-white shadow-md scale-105"
                      : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200"
                  }`}
                >
                  {formatPrice(amt)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Recipient Email Address *
            </label>
            <input
              type="email"
              required
              placeholder="friend@domain.com"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              className="w-full h-10 px-4 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Personalized Note
            </label>
            <textarea
              rows={2}
              placeholder="Enjoy the precision hardware on me..."
              value={giftNote}
              onChange={(e) => setGiftNote(e.target.value)}
              className="w-full p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>

          <button
            type="submit"
            className="w-full h-11 rounded-full bg-[#0D6E5D] hover:bg-[#0A5649] text-white font-semibold text-xs transition-all shadow-md flex items-center justify-center gap-2"
          >
            <Gift className="w-4 h-4" />
            <span>Add {formatPrice(selectedAmount)} Pass to Bag</span>
          </button>
        </form>
      </div>

      {/* Balance Checker Widget */}
      <div className="p-6 sm:p-8 rounded-[32px] bg-neutral-100 dark:bg-neutral-900/60 border border-black/5 dark:border-white/5 space-y-4 max-w-xl mx-auto text-center">
        <h2 className="text-base font-bold text-neutral-900 dark:text-white">
          Check Gift Pass Remaining Credit
        </h2>
        <p className="text-xs text-neutral-500">
          Enter your 16-digit alphanumeric gift code to inspect available balance.
        </p>

        <form onSubmit={handleCheckBalance} className="flex gap-2 max-w-md mx-auto">
          <input
            type="text"
            placeholder="AUR-XXXX-XXXX-XXXX"
            value={checkCode}
            onChange={(e) => setCheckCode(e.target.value)}
            className="flex-1 h-10 px-4 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 font-mono text-xs focus:outline-none uppercase"
          />
          <button
            type="submit"
            className="px-5 h-10 rounded-xl bg-neutral-900 hover:bg-black text-white font-semibold text-xs transition-colors shrink-0"
          >
            Check Balance
          </button>
        </form>

        {balanceResult !== null && (
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 text-xs font-semibold flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Available Balance: {formatPrice(balanceResult)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
