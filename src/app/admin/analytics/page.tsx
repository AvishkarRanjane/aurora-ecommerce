"use client";

import React from "react";
import {
  BarChart3,
  TrendingUp,
  Download,
  Globe2,
  PieChart,
  DollarSign,
  ArrowUpRight,
  ShoppingBag
} from "lucide-react";
import { useToast } from "@/context/ToastContext";

export default function AdminAnalyticsPage() {
  const { success } = useToast();

  const handleExportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Date,Total_Orders,GMV_USD,Platform_Fee_USD,Avg_Basket\n" +
      "2025-03-01,142,58490,7311,411.90\n" +
      "2025-03-02,168,69210,8651,411.96\n" +
      "2025-03-03,155,63900,7987,412.25\n" +
      "2025-03-04,194,79930,9991,412.01\n";

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Aurelian_Analytics_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    success("Comprehensive GMV and merchant settlement CSV exported.");
  };

  return (
    <div className="space-y-8 py-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Executive Analytics & Financial Intelligence
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Omnichannel volume trends, category margin distribution, and regional demand density.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2 rounded-full bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs shadow-md transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Financial CSV</span>
        </button>
      </div>

      {/* Primary KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-6 rounded-[28px] bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/10 shadow-sm space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Total Sales (Past 30 Days)
          </span>
          <div className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
            ₹1,24,85,000
          </div>
          <div className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+24.8% growth vs last month</span>
          </div>
        </div>

        <div className="p-6 rounded-[28px] bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/10 shadow-sm space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Average Order Value
          </span>
          <div className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
            ₹41,230
          </div>
          <div className="text-xs text-neutral-400">
            Across audio, computing & watch bundles
          </div>
        </div>

        <div className="p-6 rounded-[28px] bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/10 shadow-sm space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Order Conversion Rate
          </span>
          <div className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
            3.84%
          </div>
          <div className="text-xs text-emerald-600 font-semibold">
            High buyer purchase completion
          </div>
        </div>
      </div>

      {/* Category Contribution & Regional Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category Contribution */}
        <div className="p-6 rounded-[32px] bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/10 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <PieChart className="w-4 h-4 text-emerald-500" />
            <span>Sales by Hardware Category</span>
          </h2>

          <div className="space-y-3 pt-2 text-xs">
            {[
              { cat: "Audio & Acoustics", pct: 42, rev: "₹52,43,700", color: "bg-emerald-600" },
              { cat: "Wearables & Watch", pct: 28, rev: "₹34,95,800", color: "bg-teal-500" },
              { cat: "Computing & Displays", pct: 22, rev: "₹27,46,700", color: "bg-indigo-500" },
              { cat: "Accessories", pct: 8, rev: "₹9,98,800", color: "bg-amber-500" },
            ].map((row, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                    {row.cat}
                  </span>
                  <span className="text-neutral-500">{row.rev} ({row.pct}%)</span>
                </div>
                <div className="h-2 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                  <div style={{ width: `${row.pct}%` }} className={`h-full ${row.color} rounded-full`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Regional Volume */}
        <div className="p-6 rounded-[32px] bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/10 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <Globe2 className="w-4 h-4 text-amber-500" />
            <span>Global Shipment Destinations</span>
          </h2>

          <div className="space-y-3 pt-2 text-xs">
            {[
              { region: "North America (US / CA)", pct: 58, orders: "2,849 Orders", flag: "🇺🇸" },
              { region: "European Union & UK", pct: 26, orders: "1,277 Orders", flag: "🇪🇺" },
              { region: "Asia-Pacific (JP / SG / IN)", pct: 16, orders: "786 Orders", flag: "🇯🇵" },
            ].map((row, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
                    <span>{row.flag}</span>
                    <span>{row.region}</span>
                  </span>
                  <span className="text-neutral-500">{row.orders} ({row.pct}%)</span>
                </div>
                <div className="h-2 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                  <div style={{ width: `${row.pct}%` }} className="h-full bg-neutral-900 dark:bg-neutral-300 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
