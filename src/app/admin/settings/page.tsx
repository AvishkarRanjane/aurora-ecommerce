"use client";

import React, { useState, useEffect } from "react";
import {
  Sliders,
  DollarSign,
  Truck,
  RotateCcw,
  Check,
  AlertTriangle,
  Building,
  ShieldAlert
} from "lucide-react";
import { getStoredSiteSettings, saveStoredSiteSettings } from "@/lib/mockData";
import { AdminSiteSettings } from "@/types/api";
import { useToast } from "@/context/ToastContext";

export default function AdminSettingsPage() {
  const { success } = useToast();
  const [settings, setSettings] = useState<AdminSiteSettings>({
    siteName: "Aurora Store & Marketplace",
    supportEmail: "support@auroradesign.io",
    commissionRate: 10.0,
    freeShippingThreshold: 999,
    returnWindowDays: 14,
    taxRate: 18.0,
    maintenanceMode: false,
    currency: "INR (₹)"
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSettings(getStoredSiteSettings());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveStoredSiteSettings(settings);
    setSaved(true);
    success("Global platform governance settings saved.");
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-2">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
          Platform Governance & System Settings
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          Adjust global merchant commission rates, free shipping criteria, tax schedules, and maintenance modes.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Core Marketplace Parameters */}
        <div className="p-6 rounded-[28px] bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/10 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <Building className="w-4 h-4 text-amber-500" />
            <span>Marketplace Identity</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Ecosystem Name
              </label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                className="w-full h-10 px-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Concierge Support Email
              </label>
              <input
                type="email"
                value={settings.supportEmail}
                onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                className="w-full h-10 px-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Financial & Fee Rules */}
        <div className="p-6 rounded-[28px] bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/10 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-amber-500" />
            <span>Monetization & Taxation Rules</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Platform Commission (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={settings.commissionRate}
                onChange={(e) => setSettings({ ...settings, commissionRate: Number(e.target.value) })}
                className="w-full h-10 px-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs focus:outline-none focus:border-amber-500 font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Standard Sales Tax (%)
              </label>
              <input
                type="number"
                step="0.01"
                value={settings.taxRate}
                onChange={(e) => setSettings({ ...settings, taxRate: Number(e.target.value) })}
                className="w-full h-10 px-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs focus:outline-none focus:border-amber-500 font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Free Delivery Minimum (₹)
              </label>
              <input
                type="number"
                value={settings.freeShippingThreshold}
                onChange={(e) => setSettings({ ...settings, freeShippingThreshold: Number(e.target.value) })}
                className="w-full h-10 px-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs focus:outline-none focus:border-emerald-500 font-semibold"
              />
            </div>
          </div>
        </div>

        {/* Consumer Protection */}
        <div className="p-6 rounded-[28px] bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/10 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-emerald-600" />
            <span>Customer Return Policy</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Return Window (Days)
              </label>
              <select
                value={settings.returnWindowDays}
                onChange={(e) => setSettings({ ...settings, returnWindowDays: Number(e.target.value) })}
                className="w-full h-10 px-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs focus:outline-none"
              >
                <option value={7}>7 Days</option>
                <option value={14}>14 Days (Standard)</option>
                <option value={30}>30 Days (Customer Friendly)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Store Currency
              </label>
              <select
                value={settings.currency}
                onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                className="w-full h-10 px-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs focus:outline-none"
              >
                <option>INR (₹)</option>
                <option>USD ($)</option>
                <option>EUR (€)</option>
                <option>GBP (£)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Emergency Maintenance Toggle */}
        <div className="p-6 rounded-[28px] bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="font-bold text-xs text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>Platform Maintenance Override</span>
            </span>
            <p className="text-[11px] text-amber-700 dark:text-amber-400">
              When enabled, incoming buyer checkouts are temporarily paused for database migration.
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.maintenanceMode}
              onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-neutral-300 peer-focus:outline-none rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500" />
          </label>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-full bg-[#0D6E5D] hover:bg-[#0A5649] text-white font-bold text-xs transition-all shadow-md flex items-center gap-1.5"
          >
            {saved ? <Check className="w-4 h-4" /> : null}
            <span>{saved ? "Settings Saved" : "Save Settings"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
