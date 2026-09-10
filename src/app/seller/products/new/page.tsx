"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  PackagePlus,
  ArrowRight,
  Upload,
  CheckCircle2,
  Sparkles,
  Layers,
  DollarSign
} from "lucide-react";
import { getStoredProducts } from "@/lib/mockData";
import { ProductDetailData } from "@/types/api";
import { useToast } from "@/context/ToastContext";

const PRESET_IMAGES = [
  { label: "Studio Pro Headphones", url: "/images/headphones_studio_pro.jpg" },
  { label: "Wireless Pods", url: "/images/earbuds_wireless_pods.jpg" },
  { label: "Titanium Pulse Watch", url: "/images/titanium_smartwatch_pulse.jpg" },
  { label: "Carbon Laptop Zenith", url: "/images/carbon_laptop_zenith.jpg" },
  { label: "Creator 4K Display", url: "/images/creator_monitor_4k.jpg" },
  { label: "Flagship Phone Pro", url: "/images/flagship_smartphone_pro.jpg" },
  { label: "Cinema Soundbar Sub", url: "/images/cinema_soundbar_sub.jpg" },
  { label: "GaN Power Station", url: "/images/gan_power_station.jpg" },
];

export default function NewProductUploadPage() {
  const router = useRouter();
  const { success } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    category_name: "Audio & Acoustics",
    category_id: 1,
    price: "",
    original_price: "",
    stock: "25",
    badge: "New Release",
    image_url: "/images/headphones_studio_pro.jpg",
    description: "",
    details: "",
    highlight1: "",
    highlight2: "",
    specMaterial: "Titanium Grade 5 & Sapphire Glass",
    specBattery: "36-Hour continuous runtime",
    specConnect: "Lossless USB-C & Bluetooth 5.4",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "category_name") {
      let catId = 1;
      if (value === "Wearables & Watch") catId = 2;
      if (value === "Computing & Displays") catId = 3;
      if (value === "Smartphones & Tablets") catId = 4;
      if (value === "MagCharge & Accessories") catId = 5;
      setForm({ ...form, category_name: value, category_id: catId });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    setTimeout(() => {
      const existing = getStoredProducts();
      const newId = Date.now();
      const slug = form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

      const newProduct: ProductDetailData = {
        id: newId,
        name: form.name || "Aurelian Precision Device",
        slug: slug || `product-${newId}`,
        category_id: form.category_id,
        category_name: form.category_name,
        price: Number(form.price) || 299,
        original_price: form.original_price ? Number(form.original_price) : undefined,
        stock: Number(form.stock) || 20,
        badge: form.badge || "New",
        image_url: form.image_url,
        description: form.description || "Masterpiece acoustic hardware crafted with titanium precision.",
        details: form.details || "Engineered for pure low-distortion dynamics with proprietary transducers.",
        rating: 5.0,
        review_count: 1,
        is_featured: true,
        highlights: [
          form.highlight1 || "Aerospace Grade 5 Titanium construction",
          form.highlight2 || "Lossless ultra-low harmonic distortion transducers",
          "Engineered in California by Aurelian Labs",
        ],
        specs: {
          "Materials": form.specMaterial,
          "Power & Battery": form.specBattery,
          "Connectivity": form.specConnect,
        },
        inTheBox: [
          `${form.name || "Hardware Unit"}`,
          "Braided USB-C to USB-C Cable (1.5m)",
          "Magnetic Travel Sleeve & Certificate of Authenticity",
        ],
      };

      const updated = [newProduct, ...existing];
      if (typeof window !== "undefined") {
        localStorage.setItem("aurelian_products_v2", JSON.stringify(updated));
      }

      setSubmitting(false);
      success(`"${newProduct.name}" published live to storefront!`);
      router.push("/seller/inventory");
    }, 500);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 tracking-wider uppercase">
            Catalog Publishing
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Upload Bespoke Hardware
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Published listings appear instantly on the buyer store and global search.
          </p>
        </div>

        <Link
          href="/seller/inventory"
          className="text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
        >
          Cancel & Exit
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Core Product Information */}
        <div className="p-8 rounded-[32px] bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/10 shadow-sm space-y-6">
          <h2 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <PackagePlus className="w-4 h-4 text-indigo-500" />
            <span>Product Identity</span>
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Product Title *
              </label>
              <input
                type="text"
                required
                name="name"
                placeholder="e.g. Aurelian Studio Master Headphones"
                value={form.name}
                onChange={handleChange}
                className="w-full h-10 px-4 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Category *
                </label>
                <select
                  name="category_name"
                  value={form.category_name}
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

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Product Badge (Pill)
                </label>
                <input
                  type="text"
                  name="badge"
                  placeholder="e.g. Flagship, Titanium, Limited"
                  value={form.badge}
                  onChange={handleChange}
                  className="w-full h-10 px-4 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Sale Price ($ USD) *
                </label>
                <input
                  type="number"
                  required
                  name="price"
                  placeholder="e.g. 549"
                  value={form.price}
                  onChange={handleChange}
                  className="w-full h-10 px-4 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs focus:outline-none focus:border-indigo-500 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Original / MSRP Price ($ USD)
                </label>
                <input
                  type="number"
                  name="original_price"
                  placeholder="e.g. 599"
                  value={form.original_price}
                  onChange={handleChange}
                  className="w-full h-10 px-4 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Stock Units Available *
                </label>
                <input
                  type="number"
                  required
                  name="stock"
                  placeholder="e.g. 25"
                  value={form.stock}
                  onChange={handleChange}
                  className="w-full h-10 px-4 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Short Summary (Card Tagline)
              </label>
              <input
                type="text"
                name="description"
                placeholder="Lossless acoustic architecture with electro-acoustic transducers..."
                value={form.description}
                onChange={handleChange}
                className="w-full h-10 px-4 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Detailed Engineering Overview
              </label>
              <textarea
                rows={3}
                name="details"
                placeholder="Describe material alloys, transducer coil specs, thermal management..."
                value={form.details}
                onChange={handleChange}
                className="w-full p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Media & Visual Asset Preset */}
        <div className="p-8 rounded-[32px] bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/10 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-500" />
            <span>High-Fidelity Imagery</span>
          </h2>

          <p className="text-xs text-neutral-500">
            Select a verified studio photographic preset or enter your custom image path:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {PRESET_IMAGES.map((img) => (
              <div
                key={img.url}
                onClick={() => setForm({ ...form, image_url: img.url })}
                className={`p-2 rounded-2xl cursor-pointer border transition-all text-center group ${
                  form.image_url === img.url
                    ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 ring-2 ring-indigo-500/20"
                    : "border-black/5 dark:border-white/10 hover:border-indigo-300"
                }`}
              >
                <div className="w-full h-20 relative rounded-xl overflow-hidden mb-1.5 bg-neutral-100 dark:bg-neutral-800">
                  <Image src={img.url} alt={img.label} fill className="object-cover" />
                </div>
                <span className="text-[10px] font-medium text-neutral-700 dark:text-neutral-300 line-clamp-1">
                  {img.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Technical Specifications */}
        <div className="p-8 rounded-[32px] bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/10 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span>Hardware Specifications</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Materials & Chassis
              </label>
              <input
                type="text"
                name="specMaterial"
                value={form.specMaterial}
                onChange={handleChange}
                className="w-full h-10 px-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Power & Battery Runtime
              </label>
              <input
                type="text"
                name="specBattery"
                value={form.specBattery}
                onChange={handleChange}
                className="w-full h-10 px-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Audio & Interface Protocol
              </label>
              <input
                type="text"
                name="specConnect"
                value={form.specConnect}
                onChange={handleChange}
                className="w-full h-10 px-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-between pt-4">
          <Link
            href="/seller/inventory"
            className="text-xs text-neutral-500 hover:text-neutral-700 font-medium"
          >
            ← Back to Inventory
          </Link>

          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-3.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-xl hover:scale-105 flex items-center gap-2"
          >
            {submitting ? (
              <span>Publishing Listing...</span>
            ) : (
              <>
                <span>Publish to Storefront</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
