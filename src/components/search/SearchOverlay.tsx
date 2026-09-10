"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ArrowRight, ShoppingBag, Sparkles } from "lucide-react";
import { getStoredProducts } from "@/lib/mockData";
import { ProductResponse } from "@/types/api";
import { formatPrice } from "@/lib/utils";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ProductResponse[]>([]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const q = query.toLowerCase().trim();
    const all = getStoredProducts();
    const filtered = all.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        Boolean(p.description && p.description.toLowerCase().includes(q)) ||
        Boolean(p.category_name && p.category_name.toLowerCase().includes(q))
      );
    setResults(filtered.slice(0, 6));
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onClose();
      router.push(`/catalog?search=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleSelectProduct = (id: number) => {
    onClose();
    router.push(`/product/${id}`);
  };

  const quickPicks = ["Studio Max", "Titanium Watch", "Phone 16 Pro", "Studio Display", "AirPods"];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-start p-4 sm:p-6 pt-20 sm:pt-24">
          {/* Blurred Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-xl"
          />

          {/* Floating Glass Search Modal */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 w-full max-w-2xl bg-white/95 dark:bg-[#1C1C1E]/95 backdrop-blur-2xl rounded-[28px] border border-black/10 dark:border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.15)] overflow-hidden"
          >
            {/* Search Input Bar */}
            <form onSubmit={handleSubmit} className="relative flex items-center p-4 sm:p-5 border-b border-black/5 dark:border-white/10">
              <Search className="w-5 h-5 text-[#6E6E73] shrink-0 ml-2" />
              <input
                ref={inputRef}
                suppressHydrationWarning
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products, specs, titanium, audio..."
                className="w-full bg-transparent px-4 text-base sm:text-lg text-[#1D1D1F] dark:text-[#F5F5F7] placeholder-[#6E6E73] focus:outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="p-1 rounded-full text-[#6E6E73] hover:text-[#1D1D1F] transition-colors mr-2"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 rounded-[12px] bg-black/5 hover:bg-black/10 text-xs font-medium text-[#6E6E73] transition-colors"
              >
                Esc
              </button>
            </form>

            {/* Content Area */}
            <div className="max-h-[60vh] overflow-y-auto p-5 space-y-5">
              {/* If Query Active and Results Found */}
              {query.trim() && results.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-[#6E6E73] px-1 font-medium">
                    <span>Hardware Matches</span>
                    <span>{results.length} found</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {results.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => handleSelectProduct(p.id)}
                        className="group flex items-center gap-3 p-2.5 rounded-[20px] bg-black/[0.02] hover:bg-[#0071E3]/5 border border-black/5 hover:border-[#0071E3]/30 transition-all cursor-pointer"
                      >
                        <div className="w-12 h-12 rounded-[14px] bg-neutral-100 overflow-hidden shrink-0 border border-black/5">
                          {p.image_url ? (
                            <img src={p.image_url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                          ) : (
                            <ShoppingBag className="w-5 h-5 text-neutral-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] truncate group-hover:text-[#0071E3] transition-colors">
                            {p.name}
                          </h4>
                          <span className="text-xs font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
                            {formatPrice(p.price)}
                          </span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-[#6E6E73] group-hover:text-[#0071E3] group-hover:translate-x-0.5 transition-all mr-1" />
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-black/5 flex justify-end">
                    <button
                      onClick={handleSubmit}
                      className="text-xs font-semibold text-[#0071E3] hover:underline flex items-center gap-1"
                    >
                      <span>View all results for &quot;{query}&quot;</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* If Query Active but No Results */}
              {query.trim() && results.length === 0 && (
                <div className="py-12 text-center space-y-2">
                  <p className="text-sm font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
                    No hardware found for &quot;{query}&quot;
                  </p>
                  <p className="text-xs text-[#6E6E73]">
                    Try searching for headphones, watch, display, titanium, or pad.
                  </p>
                </div>
              )}

              {/* Quick Picks / Suggestions when empty query */}
              {!query.trim() && (
                <div className="space-y-4">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[#6E6E73] uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-[#0071E3]" />
                    <span>Popular Keynotes</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {quickPicks.map((pick) => (
                      <button
                        key={pick}
                        onClick={() => setQuery(pick)}
                        className="px-3.5 py-2 rounded-[14px] bg-neutral-100 hover:bg-neutral-200 text-xs font-medium text-[#1D1D1F] transition-colors"
                      >
                        {pick}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
