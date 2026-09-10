"use client";

import React, { useState, useEffect } from "react";
import {
  DollarSign,
  TrendingUp,
  Download,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ShieldCheck
} from "lucide-react";
import { getStoredSellerPayouts, saveStoredSellers } from "@/lib/mockData";
import { SellerPayout } from "@/types/api";
import { useToast } from "@/context/ToastContext";
import { formatPrice } from "@/lib/utils";

export default function SellerEarningsPage() {
  const { success } = useToast();
  const [payouts, setPayouts] = useState<SellerPayout[]>([]);
  const [availableBalance, setAvailableBalance] = useState(98450);
  const [requesting, setRequesting] = useState(false);

  useEffect(() => {
    setPayouts(getStoredSellerPayouts());
  }, []);

  const handleInstantPayout = () => {
    if (availableBalance <= 0) return;
    setRequesting(true);

    setTimeout(() => {
      const newPayout: SellerPayout = {
        id: `po_${Date.now()}`,
        sellerId: "seller_1",
        amount: availableBalance,
        date: new Date().toISOString().split("T")[0],
        status: "PROCESSED",
        bankRef: `INSTANT-ACH-${Math.floor(1000000 + Math.random() * 9000000)}`
      };

      const updated = [newPayout, ...payouts];
      setPayouts(updated);
      setAvailableBalance(0);
      setRequesting(false);
      success(`Disbursed ${formatPrice(newPayout.amount)} directly to your bank account!`);
    }, 600);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Earnings & Payout Ledger
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Track gross merchandise sales, net deductions, and direct bank deposits.
          </p>
        </div>

        <button
          onClick={handleInstantPayout}
          disabled={availableBalance === 0 || requesting}
          className="px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold text-xs shadow-md transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <ArrowUpRight className="w-4 h-4" />
          <span>{requesting ? "Disbursing..." : "Request Instant Payout"}</span>
        </button>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-[28px] bg-gradient-to-br from-emerald-900 to-neutral-950 text-white shadow-xl space-y-4 relative overflow-hidden border border-emerald-500/20">
          <div className="text-xs font-semibold uppercase tracking-wider text-emerald-300">
            Available For Payout
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            {formatPrice(availableBalance)}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-neutral-300">
            <Building2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>HDFC Bank •••• 8821</span>
          </div>
        </div>

        <div className="p-6 rounded-[28px] bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/10 shadow-sm space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Lifetime Settled Revenue
          </div>
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
            ₹49,20,000
          </div>
          <div className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>100% on-time settlement</span>
          </div>
        </div>

        <div className="p-6 rounded-[28px] bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/10 shadow-sm space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Platform Fee (10%)
          </div>
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
            ₹4,92,000
          </div>
          <div className="text-xs text-neutral-400">
            Includes payment processing & gateway fees
          </div>
        </div>
      </div>

      {/* Payout Schedule Notice */}
      <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-500/20 flex items-center justify-between gap-3 text-xs text-emerald-900 dark:text-emerald-200">
        <div className="flex items-center gap-2.5">
          <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Next scheduled automatic bank transfer: <strong>Tuesday at 09:00 AM IST</strong></span>
        </div>
        <span className="hidden sm:inline-block font-mono text-[11px] text-emerald-600">
          IFSC: HDFC0001234
        </span>
      </div>

      {/* Disbursement Ledger */}
      <div className="rounded-[28px] bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/10 shadow-sm overflow-hidden space-y-4 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-neutral-900 dark:text-white">
            Disbursement History & Remittance Advice
          </h2>
          <span className="text-xs text-neutral-400">Showing last 30 days</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-neutral-500 uppercase tracking-wider font-semibold border-b border-black/5 dark:border-white/5 pb-2">
              <tr>
                <th className="py-2.5">Transfer Ref</th>
                <th className="py-2.5">Date</th>
                <th className="py-2.5">Disbursement Method</th>
                <th className="py-2.5">Net Amount</th>
                <th className="py-2.5">Status</th>
                <th className="py-2.5 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/5">
              {payouts.map((p) => (
                <tr key={p.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors">
                  <td className="py-3 font-mono font-medium text-neutral-900 dark:text-white">
                    {p.bankRef}
                  </td>
                  <td className="py-3 text-neutral-500">{p.date}</td>
                  <td className="py-3 text-neutral-600 dark:text-neutral-400">Direct Transfer (NEFT / IMPS)</td>
                  <td className="py-3 font-bold text-neutral-900 dark:text-white">
                    {formatPrice(p.amount)}
                  </td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        p.status === "PROCESSED"
                          ? "bg-emerald-500/15 text-emerald-600"
                          : "bg-amber-500/15 text-amber-600"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => success(`Remittance receipt #${p.bankRef} downloaded!`)}
                      className="inline-flex items-center gap-1 text-neutral-500 hover:text-neutral-900 dark:hover:text-white p-1 rounded hover:bg-black/5"
                      title="Download PDF"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span className="text-[11px]">PDF</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
