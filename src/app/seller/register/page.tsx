"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, ArrowRight, Building, CreditCard, Store, Shield } from "lucide-react";
import { getStoredSellers, saveStoredSellers } from "@/lib/mockData";
import { SellerProfile } from "@/types/api";
import { useToast } from "@/context/ToastContext";

export default function SellerRegistrationPage() {
  const router = useRouter();
  const { success } = useToast();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    businessName: "",
    ownerName: "",
    email: "",
    phone: "",
    category: "Audio & Acoustics",
    taxId: "",
    bankAccount: "",
    bankRouting: "",
    storeDescription: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    setTimeout(() => {
      const existing = getStoredSellers();
      const newSeller: SellerProfile = {
        id: `seller_${Date.now()}`,
        businessName: formData.businessName || "New Audio Studio",
        ownerName: formData.ownerName || "Merchant Partner",
        email: formData.email || "seller@studio.design",
        phone: formData.phone || "+1 (555) 019-4821",
        category: formData.category,
        status: "APPROVED", // instant approval for demo experience
        rating: 5.0,
        totalSales: 0,
        revenue: 0,
        bankAccount: formData.bankAccount ? `Bank •••• ${formData.bankAccount.slice(-4)}` : "Silicon Valley Bank •••• 9921",
        registeredDate: new Date().toISOString().split("T")[0],
        storeDescription: formData.storeDescription || "Independent precision electronics lab.",
        logoUrl: "/images/headphones_studio_pro.jpg",
        bannerUrl: "/images/cinema_soundbar_sub.jpg"
      };

      saveStoredSellers([newSeller, ...existing]);
      setSubmitting(false);
      setDone(true);
      success("Seller Studio registered and approved!");
    }, 600);
  };

  if (done) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 mx-auto flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Welcome to Seller Central!
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 max-w-md mx-auto">
            Your store <strong>{formData.businessName || "New Studio"}</strong> has been registered and verified. You can now manage your catalog, review incoming orders, and set up your payouts.
          </p>
        </div>
        <div className="pt-4 flex items-center justify-center gap-4">
          <Link
            href="/seller/dashboard"
            className="px-6 py-3 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-md"
          >
            Launch Seller Dashboard →
          </Link>
          <Link
            href="/seller/products/new"
            className="px-6 py-3 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white text-xs font-semibold hover:bg-neutral-200 transition-all"
          >
            Add First Product
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 tracking-wider uppercase">
          Merchant Onboarding
        </span>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
          Register Your Hardware Studio
        </h1>
        <p className="text-xs text-neutral-500">
          Step {step} of 3 • Takes less than 3 minutes
        </p>
      </div>

      {/* Step Indicators */}
      <div className="flex items-center justify-center gap-2">
        {[
          { num: 1, label: "Studio Info" },
          { num: 2, label: "Banking & Tax" },
          { num: 3, label: "Storefront" },
        ].map((s) => (
          <div
            key={s.num}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              step === s.num
                ? "bg-indigo-500 text-white shadow-sm"
                : step > s.num
                ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                : "bg-neutral-100 dark:bg-neutral-800 text-neutral-400"
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-white/20 text-[10px] flex items-center justify-center font-bold">
              {s.num}
            </span>
            <span>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Form Container */}
      <form
        onSubmit={step === 3 ? handleSubmit : (e) => { e.preventDefault(); setStep(step + 1); }}
        className="p-8 rounded-[32px] bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/10 shadow-lg space-y-6"
      >
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <Building className="w-4 h-4 text-indigo-500" />
              <span>Studio & Contact Information</span>
            </h2>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Studio / Business Name *
              </label>
              <input
                type="text"
                required
                name="businessName"
                placeholder="e.g. Apex Acoustics Lab"
                value={formData.businessName}
                onChange={handleChange}
                className="w-full h-10 px-4 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Primary Contact / Owner *
                </label>
                <input
                  type="text"
                  required
                  name="ownerName"
                  placeholder="e.g. Marcus Aurelius"
                  value={formData.ownerName}
                  onChange={handleChange}
                  className="w-full h-10 px-4 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Primary Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full h-10 px-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs focus:outline-none focus:border-indigo-500"
                >
                  <option>Audio & Acoustics</option>
                  <option>Wearables & Watch</option>
                  <option>Computing & Displays</option>
                  <option>Smartphones & Tablets</option>
                  <option>MagCharge & Accessories</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Business Email *
                </label>
                <input
                  type="email"
                  required
                  name="email"
                  placeholder="contact@studio.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full h-10 px-4 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  name="phone"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full h-10 px-4 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-indigo-500" />
              <span>Direct Deposit Bank & Tax Details</span>
            </h2>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Employer Identification / Tax ID (EIN) *
              </label>
              <input
                type="text"
                required
                name="taxId"
                placeholder="XX-XXXXXXX"
                value={formData.taxId}
                onChange={handleChange}
                className="w-full h-10 px-4 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Routing Transit Number (ABA) *
                </label>
                <input
                  type="text"
                  required
                  name="bankRouting"
                  placeholder="9-digit routing"
                  value={formData.bankRouting}
                  onChange={handleChange}
                  className="w-full h-10 px-4 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Bank Account Number *
                </label>
                <input
                  type="password"
                  required
                  name="bankAccount"
                  placeholder="Checking account #"
                  value={formData.bankAccount}
                  onChange={handleChange}
                  className="w-full h-10 px-4 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-700 dark:text-amber-300 flex items-start gap-2">
              <Shield className="w-4 h-4 shrink-0 mt-0.5" />
              <span>All banking credentials are encrypted with AES-256 and settled automatically every Tuesday.</span>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <Store className="w-4 h-4 text-indigo-500" />
              <span>Public Storefront Preview</span>
            </h2>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Studio Philosophy / Store Description
              </label>
              <textarea
                rows={3}
                name="storeDescription"
                placeholder="Describe your design principles, engineering tolerances, and acoustic materials..."
                value={formData.storeDescription}
                onChange={handleChange}
                className="w-full p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-black/5 dark:border-white/5 space-y-2">
              <span className="text-[11px] font-bold text-neutral-500 uppercase">Review Terms</span>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                By completing registration, you agree to the Aurelian Merchant Standards: 30-day buyer returns, &lt;24hr dispatch SLA, and a 12.5% platform fee on settled sales.
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-black/5 dark:border-white/5">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 rounded-full text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              ← Back
            </button>
          ) : (
            <Link
              href="/seller"
              className="text-xs text-neutral-500 hover:text-neutral-700"
            >
              Cancel
            </Link>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-all flex items-center gap-1.5"
          >
            {submitting ? (
              <span>Registering Studio...</span>
            ) : step === 3 ? (
              <span>Complete Registration</span>
            ) : (
              <>
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
