"use client";

import React, { useEffect, useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  SlidersHorizontal,
  X,
  Search,
  Check,
  Star,
  RotateCcw,
  ArrowUpDown,
  ShoppingBag,
} from "lucide-react";
import { productApi, categoryApi } from "@/lib/api";
import { ProductResponse, CategoryResponse } from "@/types/api";
import { ProductCard } from "@/components/product/ProductCard";
import { formatPrice } from "@/lib/utils";

function CatalogContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category");
  const initialSearch = searchParams.get("search");

  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState<number | null>(
    initialCategory ? Number(initialCategory) : null
  );
  const [searchQuery, setSearchQuery] = useState(initialSearch || "");
  const [maxPrice, setMaxPrice] = useState<number>(250000);
  const [minRating, setMinRating] = useState<number>(0);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>("featured");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState<boolean>(false);

  useEffect(() => {
    async function loadCatalog() {
      setIsLoading(true);
      try {
        const [prodRes, catRes] = await Promise.all([
          productApi.getAll(),
          categoryApi.getAll(),
        ]);
        setProducts(prodRes.products || []);
        setCategories(catRes || []);
      } catch (e) {
        console.error("Error loading catalog:", e);
      } finally {
        setIsLoading(false);
      }
    }
    loadCatalog();
  }, []);

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(Number(initialCategory));
    }
    if (initialSearch) {
      setSearchQuery(initialSearch);
    }
  }, [initialCategory, initialSearch]);

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (selectedCategory && p.category_id !== selectedCategory) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchName = p.name.toLowerCase().includes(q);
          const matchDesc = Boolean(p.description && p.description.toLowerCase().includes(q));
          if (!matchName && !matchDesc) return false;
        }
        if (p.price > maxPrice) return false;
        if (minRating > 0 && (p.rating || 0) < minRating) return false;
        if (inStockOnly && p.stock <= 0) return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price_asc") return a.price - b.price;
        if (sortBy === "price_desc") return b.price - a.price;
        if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
        return b.id - a.id; // default featured/newest
      });
  }, [products, selectedCategory, searchQuery, maxPrice, minRating, inStockOnly, sortBy]);

  const resetFilters = () => {
    setSelectedCategory(null);
    setSearchQuery("");
    setMaxPrice(3000);
    setMinRating(0);
    setInStockOnly(false);
    setSortBy("featured");
  };

  const hasActiveFilters =
    selectedCategory !== null ||
    searchQuery.trim() !== "" ||
    maxPrice < 3000 ||
    minRating > 0 ||
    inStockOnly;

  return (
    <div className="space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-black/5 pb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#1D1D1F] dark:text-white">
            Store Catalogue
          </h1>
          <p className="text-xs sm:text-sm text-[#6E6E73] mt-1">
            Explore engineering perfection across our entire hardware lineup.
          </p>
        </div>

        {/* Mobile Filter Toggle & Sort Dropdown */}
        <div className="flex items-center gap-3">
          <button
            suppressHydrationWarning
            onClick={() => setMobileFiltersOpen(true)}
            className="lg:hidden h-10 px-4 rounded-[14px] bg-white dark:bg-[#1E1E20] border border-black/10 text-xs font-semibold flex items-center gap-2"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#0071E3]" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-[#0071E3]" />
            )}
          </button>

          <div className="relative flex items-center gap-2">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#6E6E73] pointer-events-none absolute left-3" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-10 pl-8 pr-8 rounded-[14px] bg-white dark:bg-[#1E1E20] border border-black/10 dark:border-white/10 text-xs font-semibold text-[#1D1D1F] dark:text-white focus:outline-none focus:border-[#0071E3] appearance-none cursor-pointer"
            >
              <option value="featured">Featured First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block space-y-6 sticky top-24 p-6 rounded-[28px] bg-white/70 dark:bg-[#18181A]/70 backdrop-blur-xl border border-black/[0.06] shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-black/5">
            <span className="text-xs font-bold text-[#1D1D1F] dark:text-white uppercase tracking-wider">
              Filter By
            </span>
            {hasActiveFilters && (
              <button
                suppressHydrationWarning
                onClick={resetFilters}
                className="text-[11px] font-semibold text-[#0071E3] hover:underline flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Search inside catalog */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#1D1D1F]">Keyword</label>
            <div className="relative">
              <input
                suppressHydrationWarning
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search models..."
                className="w-full h-9 pl-8 pr-3 rounded-[12px] bg-neutral-100 border border-black/5 text-xs text-[#1D1D1F] focus:outline-none focus:border-[#0071E3]"
              />
              <Search className="w-3.5 h-3.5 text-[#6E6E73] absolute left-2.5 top-3" />
            </div>
          </div>

          {/* Categories Filter */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#1D1D1F]">Category</label>
            <div className="space-y-1">
              <button
                suppressHydrationWarning
                onClick={() => setSelectedCategory(null)}
                className={`w-full text-left px-3 py-2 rounded-[10px] text-xs transition-colors flex items-center justify-between ${
                  selectedCategory === null
                    ? "bg-[#0071E3] text-white font-bold shadow-xs"
                    : "text-neutral-700 hover:text-black hover:bg-neutral-100 font-semibold"
                }`}
              >
                <span>All Categories</span>
                {selectedCategory === null && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  suppressHydrationWarning
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full text-left px-3 py-2 rounded-[10px] text-xs transition-colors flex items-center justify-between ${
                    selectedCategory === cat.id
                      ? "bg-[#0071E3] text-white font-bold shadow-xs"
                      : "text-neutral-700 hover:text-black hover:bg-neutral-100 font-semibold"
                  }`}
                >
                  <span>{cat.name}</span>
                  {selectedCategory === cat.id && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-[#1D1D1F]">
              <span>Max Price</span>
              <span className="text-[#0D6E5D] font-bold">{formatPrice(maxPrice)}</span>
            </div>
            <input
              type="range"
              min="4999"
              max="250000"
              step="2500"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#0D6E5D] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#6E6E73]">
              <span>₹4,999</span>
              <span>₹2,50,000+</span>
            </div>
          </div>

          {/* Rating Filter */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#1D1D1F]">Minimum Rating</label>
            <div className="grid grid-cols-4 gap-1">
              {[0, 4.5, 4.8, 4.9].map((rating) => (
                <button
                  key={rating}
                  suppressHydrationWarning
                  onClick={() => setMinRating(rating)}
                  className={`py-1.5 rounded-[10px] text-xs font-medium transition-colors flex items-center justify-center gap-0.5 ${
                    minRating === rating
                      ? "bg-[#0071E3] text-white"
                      : "bg-neutral-100 text-[#6E6E73] hover:bg-neutral-200"
                  }`}
                >
                  {rating === 0 ? "All" : `${rating}★`}
                </button>
              ))}
            </div>
          </div>

          {/* In Stock Toggle */}
          <div className="pt-2 border-t border-black/5 flex items-center justify-between">
            <span className="text-xs font-medium text-[#1D1D1F]">In Stock Only</span>
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="w-4 h-4 accent-[#0071E3] cursor-pointer rounded"
            />
          </div>
        </aside>

        {/* Product Grid / Empty State */}
        <div className="lg:col-span-3">
          {filteredProducts.length === 0 ? (
            <div className="p-12 text-center rounded-[28px] bg-white/60 backdrop-blur-xl border border-black/5 space-y-4">
              <div className="w-14 h-14 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 mx-auto">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-[#1D1D1F]">
                  No matching hardware found
                </h3>
                <p className="text-xs text-[#6E6E73] max-w-sm mx-auto">
                  Try clearing some filters or search keywords to see our full catalogue.
                </p>
              </div>
              <button
                suppressHydrationWarning
                onClick={resetFilters}
                className="h-10 px-5 rounded-[16px] bg-[#0071E3] text-white text-xs font-semibold hover:bg-[#0077ED] transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-[#6E6E73]">Loading catalogue...</div>}>
      <CatalogContent />
    </Suspense>
  );
}
