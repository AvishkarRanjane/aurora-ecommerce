"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import confetti from "canvas-confetti";
import {
  Check,
  ChevronRight,
  ShieldCheck,
  Truck,
  CreditCard,
  ShoppingBag,
  ArrowRight,
  MapPin,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { orderApi } from "@/lib/api";
import { getStoredAddresses } from "@/lib/mockData";
import { formatPrice } from "@/lib/utils";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalCount, subtotal, total, discount, coupon, shipping, clearCart } = useCart();
  const { user } = useAuth();
  const { success, error } = useToast();

  const savedAddresses = getStoredAddresses();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderComplete, setOrderComplete] = useState<any | null>(null);

  // Form State
  const [address, setAddress] = useState({
    fullName: user?.name || savedAddresses[0]?.fullName || "Avishkar Patel",
    email: user?.email || "user@apple.design",
    phone: savedAddresses[0]?.phone || "+1 (415) 890-2345",
    street: savedAddresses[0]?.street || "One Infinite Loop, Suite 400",
    city: savedAddresses[0]?.city || "Cupertino",
    state: savedAddresses[0]?.state || "CA",
    postalCode: savedAddresses[0]?.postalCode || "95014",
    country: "United States",
  });

  const [paymentMethod, setPaymentMethod] = useState<"apple_pay" | "card" | "wire" | "cod">("apple_pay");
  const [emiTenure, setEmiTenure] = useState<number>(0); // 0 = full, 3, 6, 12
  const [giftWrap, setGiftWrap] = useState(false);
  const [giftNote, setGiftNote] = useState("");
  const [cardDetails, setCardDetails] = useState({
    number: "•••• •••• •••• 4242",
    exp: "12/28",
    cvc: "888",
    name: "Avishkar Patel",
  });

  const handleSelectSavedAddress = (saved: typeof savedAddresses[0]) => {
    setAddress({
      fullName: saved.fullName,
      email: address.email,
      phone: saved.phone,
      street: saved.street,
      city: saved.city,
      state: saved.state,
      postalCode: saved.postalCode,
      country: saved.country,
    });
  };

  const handlePlaceOrder = async () => {
    if (isPlacingOrder) return;
    setIsPlacingOrder(true);

    try {
      const fullAddressStr = `${address.street}, ${address.city}, ${address.state} ${address.postalCode}, ${address.country}`;
      const newOrder = await orderApi.checkout({
        shipping_address: fullAddressStr,
        payment_method:
          paymentMethod === "apple_pay"
            ? "Apple Pay"
            : paymentMethod === "card"
            ? "Mastercard ending in 4242"
            : paymentMethod === "wire"
            ? "Direct Bank Wire"
            : "Cash on Delivery",
      });

      // Trigger Confetti
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#0071E3", "#2FA84F", "#FF8A00", "#1D1D1F"],
        });
      } catch {}

      clearCart();
      setOrderComplete(newOrder);
      success("Order confirmed successfully!");
    } catch (err: any) {
      error(err?.message || "Failed to place order");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  // If user has placed the order successfully
  if (orderComplete) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-[#2FA84F]/10 text-[#2FA84F] flex items-center justify-center mx-auto">
          <Check className="w-10 h-10 stroke-[2.5]" />
        </div>

        <div className="space-y-2">
          <span className="text-xs uppercase tracking-widest text-[#0071E3] font-bold">
            Order Confirmed
          </span>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#1D1D1F] dark:text-white">
            Thank you for your order.
          </h1>
          <p className="text-xs sm:text-sm text-[#6E6E73] max-w-md mx-auto">
            Your tracking number is{" "}
            <strong className="text-[#1D1D1F] dark:text-white font-mono">
              {orderComplete.tracking_number}
            </strong>
            . We have sent receipt details to {address.email}.
          </p>
        </div>

        <div className="p-6 rounded-[28px] bg-white/70 dark:bg-[#18181A]/70 backdrop-blur-xl border border-black/[0.06] text-left space-y-4 shadow-sm">
          <div className="flex justify-between text-xs border-b border-black/5 pb-3">
            <span className="text-[#6E6E73]">Order Reference</span>
            <span className="font-semibold text-[#1D1D1F] dark:text-white">
              #{orderComplete.id}
            </span>
          </div>

          <div className="flex justify-between text-xs border-b border-black/5 pb-3">
            <span className="text-[#6E6E73]">Shipping Destination</span>
            <span className="font-semibold text-[#1D1D1F] dark:text-white text-right max-w-xs truncate">
              {orderComplete.shipping_address}
            </span>
          </div>

          <div className="flex justify-between text-xs border-b border-black/5 pb-3">
            <span className="text-[#6E6E73]">Payment Method</span>
            <span className="font-semibold text-[#1D1D1F] dark:text-white">
              {orderComplete.payment_method}
            </span>
          </div>

          <div className="flex justify-between text-sm font-bold pt-1">
            <span>Total Paid</span>
            <span className="text-[#0D6E5D] font-bold">{formatPrice(total)}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href={`/orders/${orderComplete.id}/track`}
            className="h-11 px-6 rounded-[16px] bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs font-semibold flex items-center gap-2 transition-all active:scale-[0.97] shadow-md"
          >
            <Truck className="w-4 h-4" />
            <span>Track Live Shipment</span>
          </Link>
          <Link
            href="/profile?tab=orders"
            className="h-11 px-6 rounded-[16px] bg-neutral-100 hover:bg-neutral-200 text-neutral-900 text-xs font-semibold flex items-center gap-2 transition-all"
          >
            <span>View All Orders</span>
          </Link>
          <Link
            href="/catalog"
            className="h-11 px-6 rounded-[16px] bg-black/5 hover:bg-black/10 text-[#1D1D1F] dark:text-white text-xs font-semibold flex items-center transition-all"
          >
            <span>Return to Store</span>
          </Link>
        </div>
      </div>
    );
  }

  // If cart is empty on fresh visit
  if (items.length === 0) {
    return (
      <div className="py-20 text-center rounded-[32px] bg-white/60 backdrop-blur-xl border border-black/5 space-y-4 max-w-md mx-auto p-8">
        <div className="w-14 h-14 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400">
          <ShoppingBag className="w-6 h-6 stroke-[1.8]" />
        </div>
        <h2 className="text-lg font-semibold text-[#1D1D1F]">
          Your bag is empty
        </h2>
        <p className="text-xs text-[#6E6E73]">
          Please add hardware products to your shopping bag before proceeding to checkout.
        </p>
        <Link
          href="/catalog"
          className="inline-flex items-center gap-2 h-10 px-5 rounded-[14px] bg-[#0071E3] text-white text-xs font-semibold"
        >
          Browse Catalogue
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-10 max-w-5xl mx-auto">
      {/* Stepper Header Bar */}
      <div className="space-y-4 text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-[#1D1D1F] dark:text-white">
          Express Checkout
        </h1>

        {/* Stepper Tabs */}
        <div className="inline-flex items-center gap-2 p-1.5 rounded-full bg-white/70 dark:bg-[#18181A]/70 backdrop-blur-xl border border-black/5 shadow-xs">
          {[
            { step: 1, label: "1. Shipping" },
            { step: 2, label: "2. Payment" },
            { step: 3, label: "3. Review" },
          ].map((s) => (
            <button
              key={s.step}
              suppressHydrationWarning
              onClick={() => {
                if (s.step < currentStep) setCurrentStep(s.step as any);
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                currentStep === s.step
                  ? "bg-[#0071E3] text-white shadow-xs"
                  : currentStep > s.step
                  ? "text-[#2FA84F] hover:bg-black/5"
                  : "text-[#6E6E73]"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Step Panels (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* STEP 1: SHIPPING ADDRESS */}
          {currentStep === 1 && (
            <div className="p-6 sm:p-8 rounded-[28px] bg-white/70 dark:bg-[#18181A]/70 backdrop-blur-xl border border-black/[0.06] shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-black/5 pb-4">
                <h2 className="text-lg font-semibold text-[#1D1D1F] dark:text-white">
                  Where should we send your hardware?
                </h2>
                <span className="text-xs text-[#6E6E73]">Step 1 of 3</span>
              </div>

              {/* Saved Addresses quick-pill */}
              {savedAddresses.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-[#6E6E73] block">
                    Quick Select Saved Address
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {savedAddresses.map((addr) => (
                      <div
                        key={addr.id}
                        onClick={() => handleSelectSavedAddress(addr)}
                        className={`p-3 rounded-[16px] border text-xs cursor-pointer transition-all ${
                          address.street === addr.street
                            ? "border-[#0071E3] bg-[#0071E3]/5 text-[#1D1D1F] font-semibold"
                            : "border-black/5 bg-neutral-50 text-[#6E6E73] hover:border-black/20"
                        }`}
                      >
                        <div className="font-semibold text-[#1D1D1F]">{addr.label}</div>
                        <div className="text-[11px] truncate mt-0.5">{addr.street}, {addr.city}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Address Form Inputs */}
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#1D1D1F] dark:text-white">Full Name</label>
                    <input
                      suppressHydrationWarning
                      type="text"
                      value={address.fullName}
                      onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                      className="w-full h-10 px-3.5 rounded-[12px] bg-neutral-100 dark:bg-neutral-800 border border-black/5 text-xs text-[#1D1D1F] focus:outline-none focus:border-[#0071E3]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#1D1D1F] dark:text-white">Phone Number</label>
                    <input
                      suppressHydrationWarning
                      type="text"
                      value={address.phone}
                      onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                      className="w-full h-10 px-3.5 rounded-[12px] bg-neutral-100 dark:bg-neutral-800 border border-black/5 text-xs text-[#1D1D1F] focus:outline-none focus:border-[#0071E3]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#1D1D1F] dark:text-white">Street Address</label>
                  <input
                    suppressHydrationWarning
                    type="text"
                    value={address.street}
                    onChange={(e) => setAddress({ ...address, street: e.target.value })}
                    className="w-full h-10 px-3.5 rounded-[12px] bg-neutral-100 dark:bg-neutral-800 border border-black/5 text-xs text-[#1D1D1F] focus:outline-none focus:border-[#0071E3]"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#1D1D1F] dark:text-white">City</label>
                    <input
                      suppressHydrationWarning
                      type="text"
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      className="w-full h-10 px-3.5 rounded-[12px] bg-neutral-100 dark:bg-neutral-800 border border-black/5 text-xs text-[#1D1D1F] focus:outline-none focus:border-[#0071E3]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#1D1D1F] dark:text-white">State</label>
                    <input
                      suppressHydrationWarning
                      type="text"
                      value={address.state}
                      onChange={(e) => setAddress({ ...address, state: e.target.value })}
                      className="w-full h-10 px-3.5 rounded-[12px] bg-neutral-100 dark:bg-neutral-800 border border-black/5 text-xs text-[#1D1D1F] focus:outline-none focus:border-[#0071E3]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#1D1D1F] dark:text-white">Postal Code</label>
                    <input
                      suppressHydrationWarning
                      type="text"
                      value={address.postalCode}
                      onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                      className="w-full h-10 px-3.5 rounded-[12px] bg-neutral-100 dark:bg-neutral-800 border border-black/5 text-xs text-[#1D1D1F] focus:outline-none focus:border-[#0071E3]"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-black/5 flex justify-end">
                <button
                  suppressHydrationWarning
                  onClick={() => setCurrentStep(2)}
                  className="h-11 px-6 rounded-[16px] bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs font-semibold flex items-center gap-2 transition-all active:scale-[0.97]"
                >
                  <span>Continue to Payment</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: PAYMENT METHOD */}
          {currentStep === 2 && (
            <div className="p-6 sm:p-8 rounded-[28px] bg-white/70 dark:bg-[#18181A]/70 backdrop-blur-xl border border-black/[0.06] shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-black/5 pb-4">
                <h2 className="text-lg font-semibold text-[#1D1D1F] dark:text-white">
                  Select payment method
                </h2>
                <span className="text-xs text-[#6E6E73]">Step 2 of 3</span>
              </div>

              {/* Payment Selectors */}
              <div className="space-y-3">
                {[
                  {
                    id: "apple_pay",
                    name: "Apple Pay",
                    desc: "One-touch biometric payment via Touch ID / Face ID",
                  },
                  {
                    id: "card",
                    name: "Credit or Debit Card",
                    desc: "Visa, Mastercard, Amex, Titanium Card",
                  },
                  {
                    id: "wire",
                    name: "Bank Wire Transfer",
                    desc: "Direct enterprise treasury transfer",
                  },
                  {
                    id: "cod",
                    name: "Cash / Card on Delivery",
                    desc: "Pay securely when the express courier arrives",
                  },
                ].map((m) => (
                  <div
                    key={m.id}
                    onClick={() => setPaymentMethod(m.id as any)}
                    className={`p-4 rounded-[18px] border flex items-center justify-between cursor-pointer transition-all ${
                      paymentMethod === m.id
                        ? "border-[#0071E3] bg-[#0071E3]/5 shadow-xs"
                        : "border-black/5 bg-neutral-50/60 hover:border-black/15"
                    }`}
                  >
                    <div>
                      <h4 className="text-xs font-semibold text-[#1D1D1F] dark:text-white">
                        {m.name}
                      </h4>
                      <p className="text-[11px] text-[#6E6E73] mt-0.5">{m.desc}</p>
                    </div>
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        paymentMethod === m.id
                          ? "border-[#0071E3] bg-[#0071E3]"
                          : "border-black/20"
                      }`}
                    >
                      {paymentMethod === m.id && (
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Card Inputs if card selected */}
              {paymentMethod === "card" && (
                <div className="p-4 rounded-[20px] bg-neutral-100 dark:bg-neutral-800 space-y-3">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-[#1D1D1F]">Card Number</label>
                    <input
                      suppressHydrationWarning
                      type="text"
                      value={cardDetails.number}
                      onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                      className="w-full h-9 px-3 rounded-[10px] bg-white border border-black/10 text-xs font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-[#1D1D1F]">Expires</label>
                      <input
                        suppressHydrationWarning
                        type="text"
                        value={cardDetails.exp}
                        onChange={(e) => setCardDetails({ ...cardDetails, exp: e.target.value })}
                        className="w-full h-9 px-3 rounded-[10px] bg-white border border-black/10 text-xs font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-[#1D1D1F]">CVC</label>
                      <input
                        suppressHydrationWarning
                        type="text"
                        value={cardDetails.cvc}
                        onChange={(e) => setCardDetails({ ...cardDetails, cvc: e.target.value })}
                        className="w-full h-9 px-3 rounded-[10px] bg-white border border-black/10 text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* EMI Tenure Options */}
              <div className="p-4 rounded-[20px] bg-neutral-100/80 dark:bg-neutral-800/60 space-y-2.5">
                <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 block">
                  Studio 0% Interest Financing (EMI)
                </span>
                <div className="grid grid-cols-4 gap-2 text-xs">
                  {[
                    { mos: 0, label: "Full Amount" },
                    { mos: 3, label: "3 Mos 0%" },
                    { mos: 6, label: "6 Mos 0%" },
                    { mos: 12, label: "12 Mos 0%" },
                  ].map((ten) => (
                    <button
                      type="button"
                      key={ten.mos}
                      onClick={() => setEmiTenure(ten.mos)}
                      className={`py-2 rounded-xl text-xs font-semibold transition-all ${
                        emiTenure === ten.mos
                          ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 shadow-xs"
                          : "bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border border-black/5"
                      }`}
                    >
                      {ten.label}
                    </button>
                  ))}
                </div>
                {emiTenure > 0 && (
                  <p className="text-[11px] text-emerald-600 font-semibold pt-1">
                    Your monthly installment will be ${(total / emiTenure).toFixed(2)}/mo.
                  </p>
                )}
              </div>

              {/* Gift Wrap Option */}
              <div className="p-4 rounded-[20px] bg-neutral-50 dark:bg-neutral-800/40 border border-black/5 space-y-2 text-xs">
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-neutral-800 dark:text-neutral-200">
                  <input
                    type="checkbox"
                    checked={giftWrap}
                    onChange={(e) => setGiftWrap(e.target.checked)}
                    className="rounded text-indigo-600"
                  />
                  <span>Add Luxury Gift Wrap & Greeting Card (+₹499)</span>
                </label>
                {giftWrap && (
                  <input
                    type="text"
                    placeholder="Handwritten greeting message on card..."
                    value={giftNote}
                    onChange={(e) => setGiftNote(e.target.value)}
                    className="w-full h-8 px-3 rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs focus:outline-none"
                  />
                )}
              </div>

              <div className="pt-4 border-t border-black/5 flex items-center justify-between">
                <button
                  suppressHydrationWarning
                  onClick={() => setCurrentStep(1)}
                  className="text-xs text-[#6E6E73] hover:underline"
                >
                  Back to Address
                </button>
                <button
                  suppressHydrationWarning
                  onClick={() => setCurrentStep(3)}
                  className="h-11 px-6 rounded-[16px] bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs font-semibold flex items-center gap-2 transition-all active:scale-[0.97]"
                >
                  <span>Review Order</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: REVIEW & CONFIRM */}
          {currentStep === 3 && (
            <div className="p-6 sm:p-8 rounded-[28px] bg-white/70 dark:bg-[#18181A]/70 backdrop-blur-xl border border-black/[0.06] shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-black/5 pb-4">
                <h2 className="text-lg font-semibold text-[#1D1D1F] dark:text-white">
                  Review and place your order
                </h2>
                <span className="text-xs text-[#6E6E73]">Step 3 of 3</span>
              </div>

              {/* Verified Shipping Summary */}
              <div className="p-4 rounded-[18px] bg-neutral-50 flex items-start justify-between text-xs">
                <div>
                  <h4 className="font-semibold text-[#1D1D1F]">Shipping to</h4>
                  <p className="text-[#6E6E73] mt-1">
                    {address.fullName} ({address.phone})<br />
                    {address.street}, {address.city}, {address.state} {address.postalCode}
                  </p>
                </div>
                <button
                  suppressHydrationWarning
                  onClick={() => setCurrentStep(1)}
                  className="text-[#0071E3] font-semibold underline"
                >
                  Edit
                </button>
              </div>

              {/* Payment Summary */}
              <div className="p-4 rounded-[18px] bg-neutral-50 flex items-start justify-between text-xs">
                <div>
                  <h4 className="font-semibold text-[#1D1D1F]">Payment</h4>
                  <p className="text-[#6E6E73] mt-1 capitalize">
                    {paymentMethod === "apple_pay" ? "Apple Pay (Authorized)" : paymentMethod}
                  </p>
                </div>
                <button
                  suppressHydrationWarning
                  onClick={() => setCurrentStep(2)}
                  className="text-[#0071E3] font-semibold underline"
                >
                  Edit
                </button>
              </div>

              {/* Items in order */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-[#1D1D1F]">Hardware in this order</h4>
                {items.map((i) => (
                  <div key={i.id} className="flex items-center justify-between text-xs py-2 border-b border-black/5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-[10px] bg-neutral-100 overflow-hidden shrink-0 border border-black/5">
                        {i.image_url ? (
                          <img src={i.image_url} alt={i.product_name} className="w-full h-full object-cover" />
                        ) : null}
                      </div>
                      <div>
                        <span className="font-semibold text-[#1D1D1F]">{i.product_name}</span>
                        <span className="text-[#6E6E73] block">Qty: {i.quantity}</span>
                      </div>
                    </div>
                    <span className="font-semibold text-[#1D1D1F]">{formatPrice(i.product_price * i.quantity)}</span>
                  </div>
                ))}
              </div>

              {/* Place Order CTA */}
              <div className="pt-4 border-t border-black/5 flex items-center justify-between">
                <button
                  suppressHydrationWarning
                  onClick={() => setCurrentStep(2)}
                  className="text-xs text-[#6E6E73] hover:underline"
                >
                  Back to Payment
                </button>
                <button
                  suppressHydrationWarning
                  onClick={handlePlaceOrder}
                  disabled={isPlacingOrder}
                  className="h-12 px-8 rounded-full bg-[#0D6E5D] hover:bg-[#0A5649] text-white text-xs font-semibold flex items-center gap-2 transition-all active:scale-[0.98] shadow-md hover:shadow-lg"
                >
                  {isPlacingOrder ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>Place Order • {formatPrice(total)}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary Sticky Rail (5 cols) */}
        <div className="lg:col-span-5 space-y-4 sticky top-24">
          <div className="p-6 rounded-[28px] bg-white/70 dark:bg-[#18181A]/70 backdrop-blur-xl border border-black/[0.06] shadow-sm space-y-4">
            <h3 className="text-base font-semibold text-[#1D1D1F] dark:text-white">
              Summary ({totalCount} items)
            </h3>

            <div className="space-y-2.5 text-xs text-[#6E6E73] border-b border-black/5 pb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-[#1D1D1F] dark:text-white">{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-[#2FA84F]">
                  <span>Promo Discount</span>
                  <span className="font-semibold">-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Express Worldwide Shipping</span>
                <span className="font-semibold text-[#1D1D1F] dark:text-white">
                  {shipping === 0 ? "FREE" : formatPrice(shipping)}
                </span>
              </div>
            </div>

            <div className="flex justify-between text-base font-bold text-[#1D1D1F] dark:text-white">
              <span>Total Due</span>
              <span className="text-[#0D6E5D] font-bold">{formatPrice(total)}</span>
            </div>

            <div className="pt-2 text-[11px] text-[#6E6E73] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#0D6E5D] shrink-0" />
              <span>256-bit encrypted checkout. 30-day money-back guarantee.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
