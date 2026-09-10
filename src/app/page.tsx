"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, ChevronRight, Shield, Zap, Headphones, Compass, ShoppingBag } from "lucide-react";
import { productApi, categoryApi } from "@/lib/api";
import { ProductResponse, CategoryResponse } from "@/types/api";
import { ProductCard } from "@/components/product/ProductCard";
import { useCart } from "@/context/CartContext";

export default function HomePage() {
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { openDrawer } = useCart();

  useEffect(() => {
    async function loadData() {
      try {
        const [prodRes, catRes] = await Promise.all([
          productApi.getAll({ limit: 12 }),
          categoryApi.getAll(),
        ]);
        setProducts(prodRes.products || []);
        setCategories(catRes || []);
      } catch (err) {
        console.error("Error loading home page:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredProducts = selectedCategory
    ? products.filter((p) => p.category_id === selectedCategory)
    : products;

  const heroProduct = products[0]; // Aurelian Studio Max

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* 1. Aurora Single-Focus Hero Section (Matches Screenshot) */}
      <section className="relative pt-2 sm:pt-6 text-center flex flex-col items-center">
        <div className="max-w-3xl space-y-4">
          {/* Tagline Badge (Matches Screenshot: 'Introducing the Aurora Collection') */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#0D6E5D] tracking-tight"
          >
            <span>Introducing the Aurora Collection</span>
          </motion.div>

          {/* Headline (Matches Screenshot: 'Designed to feel as good as it looks.') */}
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-[#111827] leading-[1.08]"
          >
            Designed to feel
            <br />
            as good as it looks.
          </motion.h1>

          {/* Subtitle (Matches Screenshot) */}
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="text-base sm:text-lg text-[#4B5563] font-medium max-w-xl mx-auto leading-relaxed"
          >
            Every material, curve, and detail considered — so the everyday feels a little more deliberate.
          </motion.p>

          {/* Buttons (Matches Screenshot: 'Shop the collection' & 'Watch the film') */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="pt-3 flex flex-wrap items-center justify-center gap-3.5"
          >
            <Link
              href="/catalog"
              className="aurora-btn-primary px-7 sm:px-8 py-3.5 text-sm font-semibold flex items-center gap-2"
            >
              <span>Shop the collection</span>
            </Link>

            <Link
              href={heroProduct ? `/product/${heroProduct.id}` : "/product/1"}
              className="aurora-btn-secondary px-6 sm:px-7 py-3.5 text-sm font-semibold flex items-center gap-2"
            >
              <span>Watch the film</span>
            </Link>
          </motion.div>
        </div>

        {/* Floating Glass Showcase Tray with Interactive Badges (Matches Screenshot) */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 sm:mt-12 w-full max-w-4xl p-3 sm:p-5 rounded-[36px] bg-gradient-to-b from-white/90 to-white/60 backdrop-blur-2xl border border-white/80 shadow-[0_20px_50px_rgba(0,0,0,0.06)]"
        >
          <div className="relative aspect-[16/10] sm:aspect-[2.2/1] max-h-[460px] rounded-[28px] overflow-hidden bg-neutral-100 flex items-center justify-center group">
            {heroProduct && heroProduct.image_url ? (
              <img
                src={heroProduct.image_url}
                alt="Aurora Studio Collection"
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
            ) : null}

            {/* Top-Left Floating Badge (Matches Screenshot: 'Now trending • Studio Chair / Max') */}
            <div className="absolute top-4 sm:top-6 left-4 sm:left-6 px-4 py-2.5 rounded-2xl bg-white/90 backdrop-blur-xl border border-white/80 shadow-md flex flex-col text-left">
              <span className="text-[11px] font-medium text-neutral-500">Now trending</span>
              <span className="text-xs sm:text-sm font-bold text-neutral-950">Studio Max Titanium</span>
            </div>

            {/* Bottom-Right Floating Badge (Matches Screenshot: 'In stock • Free shipping') */}
            <div className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6 px-4 py-2.5 rounded-2xl bg-white/90 backdrop-blur-xl border border-white/80 shadow-md flex flex-col text-right">
              <span className="text-[11px] font-medium text-neutral-500">In stock</span>
              <span className="text-xs sm:text-sm font-bold text-neutral-950">Free India Express</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 2. Category Rail */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950 dark:text-white">
              The Lineup
            </h2>
            <p className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 font-medium mt-1">
              Precision-crafted for creators, athletes, and executives.
            </p>
          </div>
          <Link
            href="/catalog"
            className="text-xs font-bold text-[#0071E3] hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            <span>View full catalogue</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.2]" />
          </Link>
        </div>

        {/* Category Pill Buttons with Aurora Glass Styling */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            suppressHydrationWarning
            onClick={() => setSelectedCategory(null)}
            className={`h-9 px-4 rounded-full text-xs font-semibold whitespace-nowrap transition-all active:scale-[0.97] ${
              selectedCategory === null
                ? "bg-[#0D6E5D] text-white shadow-sm font-bold"
                : "bg-white/80 backdrop-blur-md text-neutral-700 hover:text-neutral-950 border border-black/5 hover:border-black/10 shadow-xs"
            }`}
          >
            All Hardware
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              suppressHydrationWarning
              onClick={() => setSelectedCategory(cat.id)}
              className={`h-9 px-4 rounded-full text-xs font-semibold whitespace-nowrap transition-all active:scale-[0.97] ${
                selectedCategory === cat.id
                  ? "bg-[#0D6E5D] text-white shadow-sm font-bold"
                  : "bg-white/80 backdrop-blur-md text-neutral-700 hover:text-neutral-950 border border-black/5 hover:border-black/10 shadow-xs"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* 3. Featured Products Grid (4 columns in 1 row on desktop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
          {filteredProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* 4. Full-Bleed Gradient Mesh Editorial Banner */}
      <section className="relative rounded-[36px] overflow-hidden bg-gradient-to-br from-[#0F172A] to-[#0A2E25] text-white p-8 sm:p-14 lg:p-16 border border-white/10 shadow-2xl">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-emerald-500/20 via-teal-500/10 to-transparent blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-xl space-y-4">
          <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold">
            Acoustic Benchmark
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-[1.1]">
            Silence, redefined.
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-normal">
            Eight microphones continuously monitor ambient pressure and sound waves 48,000 times a second, neutralizing distractions before they reach your eardrum.
          </p>
          <div className="pt-2">
            <Link
              href="/catalog?category=1"
              className="inline-flex items-center gap-2 h-11 px-6 rounded-full bg-white text-neutral-950 text-xs font-bold hover:bg-neutral-100 transition-all active:scale-[0.97] shadow-lg"
            >
              <span>Explore Acoustic Line</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
