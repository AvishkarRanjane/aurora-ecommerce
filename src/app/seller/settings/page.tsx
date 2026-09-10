"use client";

import React, { useState } from "react";
import { Settings, Shield, Building2, Truck, Bell, Check } from "lucide-react";
import { useToast } from "@/context/ToastContext";

export default function SellerSettingsPage() {
  const { success } = useToast();
  const [saved, setSaved] = useState(false);

  const [settings, setSettings] = useState({
    businessName: "Aurelian Prime Direct",
    ownerName: "Marcus Aurelius",
    supportEmail: "prime@aureliandesign.io",
    phone: "+1 (800) 555-0199",
    category: "Audio & Acoustics",
    defaultCourier: "DHL Express Airbill",
    dispatchWindow: "Within 24 Hours",
    returnPolicyDays: "30-Day Guaranteed Returns",
    payoutBank: "Silicon Valley Bank •••• 8821",
    emailNotifyOrders: true,
    emailNotifyReviews: true,
    emailNotifyPayouts: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    success("Seller studio preferences successfully saved.");
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
          Studio Account Settings
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          Configure fulfillment rules, courier integrations, and merchant notifications.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Studio Identity */}
        <div className="p-6 rounded-[28px] bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/10 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <Building2 className="w-4 h-4 text-indigo-500" />
            <span>Studio Identity & Concierge</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Studio Display Name
              </label>
              <input
                type="text"
                value={settings.businessName}
                onChange={(e) => setSettings({ ...settings, businessName: e.target.value })}
                className="w-full h-10 px-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Support Concierge Email
              </label>
              <input
                type="email"
                value={settings.supportEmail}
                onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                className="w-full h-10 px-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Fulfillment & Courier Policies */}
        <div className="p-6 rounded-[28px] bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/10 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <Truck className="w-4 h-4 text-indigo-500" />
            <span>Shipping & Return Rules</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Default Courier Service
              </label>
              <select
                value={settings.defaultCourier}
                onChange={(e) => setSettings({ ...settings, defaultCourier: e.target.value })}
                className="w-full h-10 px-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs focus:outline-none"
              >
                <option>DHL Express Airbill</option>
                <option>FedEx Priority Freight</option>
                <option>UPS Worldwide Saver</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Dispatch SLA
              </label>
              <select
                value={settings.dispatchWindow}
                onChange={(e) => setSettings({ ...settings, dispatchWindow: e.target.value })}
                className="w-full h-10 px-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs focus:outline-none"
              >
                <option>Within 24 Hours</option>
                <option>Within 48 Hours</option>
                <option>Same-Day Dispatch (by 2 PM)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="p-6 rounded-[28px] bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/10 shadow-sm space-y-3">
          <h2 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <Bell className="w-4 h-4 text-indigo-500" />
            <span>Merchant Alerts</span>
          </h2>

          <div className="space-y-2 text-xs">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.emailNotifyOrders}
                onChange={(e) => setSettings({ ...settings, emailNotifyOrders: e.target.checked })}
                className="rounded border-neutral-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-neutral-700 dark:text-neutral-300">Instant email when a new customer order is placed</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.emailNotifyReviews}
                onChange={(e) => setSettings({ ...settings, emailNotifyReviews: e.target.checked })}
                className="rounded border-neutral-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-neutral-700 dark:text-neutral-300">Notify when a customer publishes a verified review</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.emailNotifyPayouts}
                onChange={(e) => setSettings({ ...settings, emailNotifyPayouts: e.target.checked })}
                className="rounded border-neutral-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-neutral-700 dark:text-neutral-300">Receive weekly remittance PDF statements via email</span>
            </label>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-md flex items-center gap-1.5"
          >
            {saved ? <Check className="w-4 h-4" /> : null}
            <span>{saved ? "Preferences Saved" : "Save Preferences"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
