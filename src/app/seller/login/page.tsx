"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Store, ArrowRight, ShieldCheck, KeyRound } from "lucide-react";
import { useToast } from "@/context/ToastContext";

export default function SellerLoginPage() {
  const router = useRouter();
  const { success } = useToast();
  const [email, setEmail] = useState("prime@aureliandesign.io");
  const [password, setPassword] = useState("••••••••••••");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      success("Logged in as Aurelian Prime Direct");
      router.push("/seller/dashboard");
    }, 400);
  };

  return (
    <div className="max-w-md mx-auto py-12 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 mx-auto flex items-center justify-center">
          <Store className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
          Seller Central Login
        </h1>
        <p className="text-xs text-neutral-500">
          Access your hardware inventory, order queue, and earnings ledger.
        </p>
      </div>

      <form
        onSubmit={handleLogin}
        className="p-8 rounded-[32px] bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/10 shadow-lg space-y-4"
      >
        <div>
          <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
            Merchant Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-10 px-4 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
            Studio Security Key / Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-10 px-4 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs focus:outline-none focus:border-indigo-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-11 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-md flex items-center justify-center gap-1.5"
        >
          {loading ? "Authenticating..." : "Sign In to Seller Central"}
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <div className="pt-2 text-center text-xs text-neutral-500">
          Not yet registered?{" "}
          <Link href="/seller/register" className="text-indigo-600 font-semibold hover:underline">
            Apply to become a seller
          </Link>
        </div>
      </form>

      {/* Demo Credentials Quick-card */}
      <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200/50 dark:border-indigo-500/20 text-xs text-indigo-900 dark:text-indigo-300 space-y-1">
        <div className="font-semibold flex items-center gap-1.5">
          <KeyRound className="w-3.5 h-3.5" />
          <span>Demo Merchant Account Pre-filled</span>
        </div>
        <p className="text-[11px] text-neutral-600 dark:text-neutral-400">
          Click <strong>Sign In</strong> to explore full merchant order fulfillment, stock adjusting, and payout statements.
        </p>
      </div>
    </div>
  );
}
