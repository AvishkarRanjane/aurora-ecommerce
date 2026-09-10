"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  User,
  Package,
  MapPin,
  Tag,
  Shield,
  CheckCircle2,
  Clock,
  Truck,
  Copy,
  Plus,
  Trash2,
  Edit2,
  Save,
  ShoppingBag,
  CreditCard,
  Lock,
  Bell,
  Link2,
  AlertTriangle,
  RotateCcw,
  Gift,
  Crown
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { orderApi, authApi } from "@/lib/api";
import { OrderResponse } from "@/types/api";
import {
  getStoredAddresses,
  saveStoredAddresses,
  AVAILABLE_COUPONS,
  DEMO_USER,
} from "@/lib/mockData";
import { Modal } from "@/components/ui/Modal";
import { formatPrice } from "@/lib/utils";

function ProfileContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") || "profile";

  const { user, refreshUser } = useAuth();
  const { success, info, error: toastError } = useToast();

  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [addresses, setAddresses] = useState(getStoredAddresses());
  const [isLoading, setIsLoading] = useState(true);

  // Profile Form State
  const [profileData, setProfileData] = useState({
    name: user?.name || DEMO_USER.name,
    email: user?.email || DEMO_USER.email,
    phone: user?.phone || DEMO_USER.phone,
    address: user?.address || DEMO_USER.address,
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // New Address State
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddr, setNewAddr] = useState({
    label: "Office",
    fullName: profileData.name,
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "United States",
    phone: profileData.phone,
  });

  // Saved Payments state
  const [savedCards, setSavedCards] = useState([
    { id: "c1", brand: "Mastercard", last4: "4242", expiry: "08/28", isDefault: true },
    { id: "c2", brand: "Visa Platinum", last4: "8821", expiry: "11/27", isDefault: false },
  ]);

  // Security / Settings state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [notifyOrderSMS, setNotifyOrderSMS] = useState(true);
  const [notifyMarketing, setNotifyMarketing] = useState(false);

  useEffect(() => {
    async function loadAccountData() {
      setIsLoading(true);
      try {
        const myOrders = await orderApi.getMyOrders();
        setOrders(myOrders);
        const me = await authApi.getMe();
        if (me) {
          setProfileData({
            name: me.name,
            email: me.email,
            phone: me.phone || DEMO_USER.phone,
            address: me.address || DEMO_USER.address,
          });
        }
      } catch (err) {
        console.error("Account error:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadAccountData();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      await authApi.updateMe(profileData);
      await refreshUser();
      success("Account details saved successfully");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleCopyCode = (code: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code);
      info(`Copied promo code ${code}`);
    }
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddr.street || !newAddr.city) return;

    const created = {
      id: "addr_" + Date.now(),
      label: newAddr.label,
      fullName: newAddr.fullName,
      street: newAddr.street,
      city: newAddr.city,
      state: newAddr.state,
      postalCode: newAddr.postalCode,
      country: newAddr.country,
      phone: newAddr.phone || "+1 (415) 890-2345",
      isDefault: false,
    };
    const updated = [...addresses, created];
    setAddresses(updated);
    saveStoredAddresses(updated);
    setShowAddAddress(false);
    success("New delivery address added");
  };

  const handleDeleteAddress = (id: string) => {
    const updated = addresses.filter((a) => a.id !== id);
    setAddresses(updated);
    saveStoredAddresses(updated);
    info("Address removed");
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) return;
    success("Hardware account password updated successfully.");
    setCurrentPassword("");
    setNewPassword("");
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "orders", label: `Orders (${orders.length})`, icon: Package },
    { id: "addresses", label: `Addresses (${addresses.length})`, icon: MapPin },
    { id: "payments", label: "Saved Payments", icon: CreditCard },
    { id: "security", label: "Security & Prefs", icon: Lock },
    { id: "coupons", label: "Coupons", icon: Tag },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Account Hero Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-[32px] bg-white/70 dark:bg-[#18181A]/70 backdrop-blur-xl border border-black/[0.06] shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#0071E3] to-[#47A3FF] text-white flex items-center justify-center font-bold text-xl shadow-sm">
            {(profileData.name || "A").charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#1D1D1F] dark:text-white">
                {profileData.name}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 text-[10px] font-bold">
                GOLD VIP
              </span>
            </div>
            <p className="text-xs text-[#6E6E73]">{profileData.email}</p>
          </div>
        </div>

        {/* Quick Links to Loyalty & Referral */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/loyalty"
            className="px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs font-semibold flex items-center gap-1.5 hover:bg-amber-500/20 transition-colors"
          >
            <Crown className="w-3.5 h-3.5 text-amber-500" />
            <span>1,250 Club Points</span>
          </Link>

          <Link
            href="/referral"
            className="px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 text-xs font-semibold flex items-center gap-1.5 hover:bg-indigo-100 transition-colors"
          >
            <Gift className="w-3.5 h-3.5" />
            <span>Refer a Friend (₹2,500)</span>
          </Link>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-black/5 pb-2 overflow-x-auto scrollbar-none">
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`h-10 px-4 rounded-[14px] text-xs font-semibold flex items-center gap-2 transition-all active:scale-[0.97] whitespace-nowrap ${
                activeTab === t.id
                  ? "bg-[#1D1D1F] text-white shadow-xs"
                  : "text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-black/5"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT PANES */}
      <div className="p-6 sm:p-8 rounded-[28px] bg-white/70 dark:bg-[#18181A]/70 backdrop-blur-xl border border-black/[0.06] shadow-sm">
        {/* 1. PROFILE TAB */}
        {activeTab === "profile" && (
          <form onSubmit={handleSaveProfile} className="space-y-6 max-w-xl">
            <div className="border-b border-black/5 pb-4">
              <h2 className="text-base font-semibold text-[#1D1D1F] dark:text-white">
                Personal Information
              </h2>
              <p className="text-xs text-[#6E6E73] mt-0.5">
                Update your contact information for order receipts and shipping updates.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1D1D1F] dark:text-white">Full Name</label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className="w-full h-10 px-3.5 rounded-[12px] bg-neutral-100 dark:bg-neutral-800 border border-black/5 text-xs text-[#1D1D1F] focus:outline-none focus:border-[#0071E3]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1D1D1F] dark:text-white">Email Address</label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className="w-full h-10 px-3.5 rounded-[12px] bg-neutral-100 dark:bg-neutral-800 border border-black/5 text-xs text-[#1D1D1F] focus:outline-none focus:border-[#0071E3]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1D1D1F] dark:text-white">Phone</label>
                <input
                  type="text"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  className="w-full h-10 px-3.5 rounded-[12px] bg-neutral-100 dark:bg-neutral-800 border border-black/5 text-xs text-[#1D1D1F] focus:outline-none focus:border-[#0071E3]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1D1D1F] dark:text-white">Default Shipping Note</label>
                <input
                  type="text"
                  value={profileData.address}
                  onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                  className="w-full h-10 px-3.5 rounded-[12px] bg-neutral-100 dark:bg-neutral-800 border border-black/5 text-xs text-[#1D1D1F] focus:outline-none focus:border-[#0071E3]"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSavingProfile}
                className="h-10 px-5 rounded-[14px] bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs font-semibold flex items-center gap-2 transition-all active:scale-[0.97]"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            </div>
          </form>
        )}

        {/* 2. ORDERS TAB */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-black/5 pb-4">
              <div>
                <h2 className="text-base font-semibold text-[#1D1D1F] dark:text-white">
                  Purchase History & Tracking
                </h2>
                <p className="text-xs text-[#6E6E73] mt-0.5">
                  Track live shipments, cancel active orders, and request 30-day returns.
                </p>
              </div>

              <Link
                href="/returns"
                className="px-3.5 py-1.5 rounded-full border border-neutral-200 dark:border-neutral-700 text-xs font-semibold hover:bg-neutral-50 flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5 text-emerald-500" />
                <span>Returns & Refunds</span>
              </Link>
            </div>

            {orders.length === 0 ? (
              <div className="py-12 text-center text-xs text-[#6E6E73]">
                No past orders found in local history.
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((o) => (
                  <div
                    key={o.id}
                    className="p-5 rounded-[22px] bg-neutral-50/80 dark:bg-neutral-900/50 border border-black/5 space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs border-b border-black/5 pb-3">
                      <div>
                        <span className="font-semibold text-[#1D1D1F] dark:text-white">
                          Order #{o.id}
                        </span>
                        <span className="text-[#6E6E73] ml-2">
                          {o.created_at ? new Date(o.created_at).toLocaleDateString() : "Recent"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2.5 py-0.5 rounded-full font-semibold text-[11px] ${
                            o.status === "Delivered"
                              ? "bg-[#2FA84F]/10 text-[#2FA84F]"
                              : o.status === "In Transit"
                              ? "bg-[#0071E3]/10 text-[#0071E3]"
                              : o.status === "Cancelled"
                              ? "bg-rose-500/10 text-rose-600"
                              : "bg-amber-500/10 text-amber-600"
                          }`}
                        >
                          {o.status}
                        </span>
                        <span className="font-bold text-[#1D1D1F] dark:text-white">
                          {formatPrice(o.total_amount)}
                        </span>
                      </div>
                    </div>

                    {/* Actions Row */}
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2 text-neutral-500">
                        <Truck className="w-3.5 h-3.5 text-indigo-500" />
                        <span>Tracking: <strong>{o.tracking_number || "EXP-DHL-9941"}</strong></span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          href={`/orders/${o.id}/track`}
                          className="px-3 py-1 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors"
                        >
                          Track Live Timeline →
                        </Link>
                      </div>
                    </div>

                    {/* Order items */}
                    <div className="space-y-2 pt-1">
                      {o.items?.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs">
                          <span className="text-[#1D1D1F] dark:text-white font-medium">
                            {item.product_name} x {item.quantity}
                          </span>
                          <span className="text-[#6E6E73]">
                            ${(item.unit_price || item.price || 0) * item.quantity}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 3. ADDRESSES TAB */}
        {activeTab === "addresses" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-black/5 pb-4">
              <div>
                <h2 className="text-base font-semibold text-[#1D1D1F] dark:text-white">
                  Saved Destinations
                </h2>
                <p className="text-xs text-[#6E6E73] mt-0.5">
                  Manage primary residence and studio shipping destinations.
                </p>
              </div>
              <button
                onClick={() => setShowAddAddress(!showAddAddress)}
                className="h-9 px-4 rounded-[12px] bg-[#0071E3] text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Address</span>
              </button>
            </div>

            {showAddAddress && (
              <form onSubmit={handleAddAddress} className="p-5 rounded-[20px] bg-neutral-100 dark:bg-neutral-800 space-y-4">
                <h4 className="text-xs font-bold text-[#1D1D1F] uppercase">New Address Details</h4>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Address Label (e.g. Vacation Home)"
                    value={newAddr.label}
                    onChange={(e) => setNewAddr({ ...newAddr, label: e.target.value })}
                    className="h-9 px-3 rounded-[10px] bg-white border border-black/10 text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={newAddr.fullName}
                    onChange={(e) => setNewAddr({ ...newAddr, fullName: e.target.value })}
                    className="h-9 px-3 rounded-[10px] bg-white border border-black/10 text-xs"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Street Address"
                  value={newAddr.street}
                  onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })}
                  className="w-full h-9 px-3 rounded-[10px] bg-white border border-black/10 text-xs"
                />
                <div className="grid grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="City"
                    value={newAddr.city}
                    onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                    className="h-9 px-3 rounded-[10px] bg-white border border-black/10 text-xs"
                  />
                  <input
                    type="text"
                    placeholder="State"
                    value={newAddr.state}
                    onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                    className="h-9 px-3 rounded-[10px] bg-white border border-black/10 text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Postal Code"
                    value={newAddr.postalCode}
                    onChange={(e) => setNewAddr({ ...newAddr, postalCode: e.target.value })}
                    className="h-9 px-3 rounded-[10px] bg-white border border-black/10 text-xs"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddAddress(false)}
                    className="h-8 px-3 rounded-[10px] bg-neutral-200 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="h-8 px-4 rounded-[10px] bg-[#0071E3] text-white text-xs font-semibold"
                  >
                    Save Address
                  </button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className="p-4 rounded-[20px] bg-neutral-50 dark:bg-neutral-800/50 border border-black/5 flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#1D1D1F] dark:text-white">{addr.label}</span>
                      {addr.isDefault && (
                        <span className="text-[10px] font-semibold text-[#0071E3] bg-[#0071E3]/10 px-2 py-0.5 rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#1D1D1F] dark:text-neutral-200 font-semibold">{addr.fullName}</p>
                    <p className="text-xs text-[#6E6E73] leading-relaxed">
                      {addr.street}
                      <br />
                      {addr.city}, {addr.state} {addr.postalCode}
                    </p>
                  </div>

                  <div className="flex justify-end pt-2 border-t border-black/5">
                    <button
                      onClick={() => handleDeleteAddress(addr.id)}
                      className="text-xs text-[#E8635A] hover:underline flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. SAVED PAYMENTS TAB */}
        {activeTab === "payments" && (
          <div className="space-y-6">
            <div className="border-b border-black/5 pb-4">
              <h2 className="text-base font-semibold text-[#1D1D1F] dark:text-white">
                Saved Payment Methods
              </h2>
              <p className="text-xs text-[#6E6E73] mt-0.5">
                Cards securely encrypted via hardware tokenization.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {savedCards.map((card) => (
                <div
                  key={card.id}
                  className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-800 border border-black/5 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-neutral-900 dark:text-white">
                      {card.brand}
                    </span>
                    {card.isDefault && (
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        Primary
                      </span>
                    )}
                  </div>
                  <div className="font-mono text-sm tracking-wider text-neutral-700 dark:text-neutral-300">
                    •••• •••• •••• {card.last4}
                  </div>
                  <div className="text-[11px] text-neutral-400">Expires: {card.expiry}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. SECURITY & PREFERENCES TAB */}
        {activeTab === "security" && (
          <div className="space-y-8 max-w-xl">
            {/* Password Change */}
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="border-b border-black/5 pb-2">
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                  Change Account Password
                </h3>
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2 rounded-full bg-neutral-900 text-white font-semibold text-xs hover:bg-neutral-800 transition-colors"
              >
                Update Password
              </button>
            </form>

            {/* Notification Preferences */}
            <div className="space-y-3 pt-4 border-t border-black/5">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                Notification Preferences
              </h3>
              <div className="space-y-2 text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifyOrderSMS}
                    onChange={(e) => setNotifyOrderSMS(e.target.checked)}
                    className="rounded text-indigo-600"
                  />
                  <span>Receive real-time courier airbill SMS updates</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifyMarketing}
                    onChange={(e) => setNotifyMarketing(e.target.checked)}
                    className="rounded text-indigo-600"
                  />
                  <span>Notify on private keynote invitations and drops</span>
                </label>
              </div>
            </div>

            {/* Danger Zone: Delete Account */}
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 space-y-2">
              <span className="font-bold text-xs text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                <span>Delete Account & Erase Personal Data</span>
              </span>
              <p className="text-[11px] text-neutral-600 dark:text-neutral-400">
                Permanently purge all saved hardware warranties, address books, and order histories under GDPR / CCPA.
              </p>
              <button
                onClick={() => setDeleteModalOpen(true)}
                className="px-4 py-1.5 rounded-full bg-rose-600 text-white font-semibold text-xs hover:bg-rose-500 transition-colors"
              >
                Delete Account
              </button>
            </div>
          </div>
        )}

        {/* 6. COUPONS TAB */}
        {activeTab === "coupons" && (
          <div className="space-y-6">
            <div className="border-b border-black/5 pb-4">
              <h2 className="text-base font-semibold text-[#1D1D1F] dark:text-white">
                Exclusive Promotional Vouchers
              </h2>
              <p className="text-xs text-[#6E6E73] mt-0.5">
                Apply these codes during checkout or in your slide-in shopping bag drawer.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {AVAILABLE_COUPONS.map((c) => (
                <div
                  key={c.code}
                  className="p-5 rounded-[20px] bg-gradient-to-tr from-blue-50/50 to-indigo-50/50 border border-blue-100 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-sm font-bold text-[#0071E3] tracking-wider">
                        {c.code}
                      </span>
                      <span className="text-xs font-semibold text-[#2FA84F]">
                        {c.discountPercent > 0 ? `${c.discountPercent}% OFF` : "FREE SHIPPING"}
                      </span>
                    </div>
                    <p className="text-xs text-[#1D1D1F] font-medium">{c.description}</p>
                    {c.minSpend > 0 && (
                      <p className="text-[11px] text-[#6E6E73]">Minimum spend: ${c.minSpend}</p>
                    )}
                  </div>

                  <button
                    onClick={() => handleCopyCode(c.code)}
                    className="w-full h-9 rounded-[12px] bg-white border border-blue-200 text-xs font-semibold text-[#0071E3] hover:bg-blue-50 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Code</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Delete Account Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Account Deletion"
        description="Are you sure you want to permanently delete your Aurelian profile? This action cannot be undone."
        maxWidth="sm"
      >
        <div className="space-y-4 pt-2 text-xs">
          <p className="text-neutral-600 dark:text-neutral-400">
            All stored addresses, saved payment cards, and warranty certificates will be erased from local storage immediately.
          </p>
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => setDeleteModalOpen(false)}
              className="px-4 py-2 rounded-full text-neutral-500 hover:text-neutral-700"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                setDeleteModalOpen(false);
                success("Account deleted. Reverted to guest session.");
              }}
              className="px-4 py-2 rounded-full bg-rose-600 text-white font-semibold shadow-xs"
            >
              Permanently Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-[#6E6E73]">Loading account...</div>}>
      <ProfileContent />
    </Suspense>
  );
}
