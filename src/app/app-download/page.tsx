"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Smartphone, QrCode, ArrowRight, CheckCircle2, Sparkles, Shield, Send } from "lucide-react";
import { useToast } from "@/context/ToastContext";

export default function AppDownloadPage() {
  const { success } = useToast();
  const [phone, setPhone] = useState("");
  const [sent, setSent] = useState(false);

  const handleSendLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;
    setSent(true);
    success(`SMS download link dispatched to ${phone}!`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-8">
      {/* Keynote App Banner */}
      <div className="p-8 sm:p-14 rounded-[36px] bg-gradient-to-b from-neutral-900 to-black text-white border border-white/10 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="space-y-4 max-w-md">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold">
            <Smartphone className="w-3.5 h-3.5" />
            <span>Aurelian iOS & Android</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            The full studio experience in your pocket.
          </h1>

          <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed">
            Configure custom 10-band parametric EQ curves, receive live sub-second courier dispatch updates, and tap-to-pair with your Aurelian hardware via NFC.
          </p>

          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={() => success("Redirecting to Apple App Store...")}
              className="px-5 py-2.5 rounded-full bg-white text-neutral-950 font-semibold text-xs shadow-md hover:scale-105 transition-all"
            >
               App Store
            </button>
            <button
              onClick={() => success("Redirecting to Google Play Store...")}
              className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium text-xs backdrop-blur-md border border-white/10 transition-all"
            >
              ▶ Google Play
            </button>
          </div>
        </div>

        {/* QR Code Card */}
        <div className="p-6 rounded-[28px] bg-white text-neutral-950 text-center shadow-xl space-y-3 shrink-0 w-64 border border-neutral-200">
          <div className="w-36 h-36 mx-auto bg-neutral-100 rounded-2xl flex items-center justify-center p-2 border border-neutral-300">
            {/* High visual stylized SVG QR code */}
            <svg viewBox="0 0 100 100" className="w-full h-full text-neutral-900 fill-current">
              <rect x="10" y="10" width="25" height="25" rx="4" />
              <rect x="65" y="10" width="25" height="25" rx="4" />
              <rect x="10" y="65" width="25" height="25" rx="4" />
              <rect x="15" y="15" width="15" height="15" fill="white" rx="2" />
              <rect x="70" y="15" width="15" height="15" fill="white" rx="2" />
              <rect x="15" y="70" width="15" height="15" fill="white" rx="2" />
              <rect x="18" y="18" width="9" height="9" rx="1" />
              <rect x="73" y="18" width="9" height="9" rx="1" />
              <rect x="18" y="73" width="9" height="9" rx="1" />
              <circle cx="48" cy="48" r="7" />
              <rect x="42" y="20" width="6" height="12" />
              <rect x="42" y="68" width="8" height="15" />
              <rect x="65" y="48" width="18" height="8" />
              <rect x="20" y="42" width="12" height="6" />
            </svg>
          </div>
          <div className="text-[11px] font-bold tracking-tight text-neutral-900">
            Scan to download immediately
          </div>
          <p className="text-[10px] text-neutral-500">
            Compatible with iOS 17+ and Android 14+
          </p>
        </div>
      </div>

      {/* Send Link Via SMS */}
      <div className="p-8 rounded-[32px] bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/10 shadow-sm text-center max-w-lg mx-auto space-y-4">
        <h2 className="text-base font-bold text-neutral-900 dark:text-white">
          Send download link to your mobile phone
        </h2>
        <p className="text-xs text-neutral-500">
          We will text a single-use secure install link straight to your mobile device.
        </p>

        {sent ? (
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 text-xs font-semibold flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>Download SMS link dispatched! Check your messages.</span>
          </div>
        ) : (
          <form onSubmit={handleSendLink} className="flex gap-2">
            <input
              type="tel"
              required
              placeholder="+1 (555) 000-0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="flex-1 h-10 px-4 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              className="px-5 h-10 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs transition-colors shrink-0 flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Link</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
