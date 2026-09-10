"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  Menu,
  X,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import { useSearch } from "@/context/SearchContext";
import { SellerNav } from "@/components/layout/SellerNav";
import { AdminNav } from "@/components/layout/AdminNav";

export function Navbar() {
  const pathname = usePathname();
  const { totalCount, openDrawer } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { user, logout } = useAuth();
  const { openSearch } = useSearch();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (pathname?.startsWith("/seller")) {
    return <SellerNav />;
  }

  if (pathname?.startsWith("/admin")) {
    return <AdminNav />;
  }

  const navLinks = [
    { name: "Shop", href: "/catalog" },
    { name: "Collections", href: "/catalog?category=all" },
    { name: "Stories", href: "/deals" },
    { name: "Support", href: "/help" },
  ];

  return (
    <header className="fixed top-4 sm:top-5 inset-x-0 mx-auto w-[calc(100%-2rem)] max-w-4xl z-50 transition-all duration-300 pointer-events-none">
      <div
        className={`pointer-events-auto rounded-full px-5 sm:px-7 py-2.5 sm:py-3 transition-all duration-300 flex items-center justify-between gap-4 ${
          scrolled
            ? "aurora-nav-pill scrolled"
            : "aurora-nav-pill"
        }`}
      >
        {/* Brand Name on Left (Matches Screenshot: 'Aurora') */}
        <Link
          href="/"
          className="flex items-center gap-2 group shrink-0"
          title="Aurora Home"
        >
          <span className="font-extrabold text-base sm:text-lg tracking-tight text-neutral-950 hover:opacity-85 transition-opacity">
            Aurora
          </span>
        </Link>

        {/* Center Desktop Links (Matches Screenshot: Shop, Collections, Stories, Support) */}
        <nav className="hidden md:flex items-center gap-5 lg:gap-7 text-[13px]">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href.split("?")[0]);
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`transition-colors py-1 relative font-medium ${
                  isActive
                    ? "text-neutral-950 font-bold"
                    : "text-neutral-600 hover:text-neutral-950"
                }`}
              >
                <span>{link.name}</span>
                {isActive && (
                  <motion.div
                    layoutId="activePillIndicator"
                    className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#0D6E5D] rounded-full"
                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions: Professional Icons + Shopping Bag Pill */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Search Button */}
          <button
            suppressHydrationWarning
            onClick={openSearch}
            className="w-8 h-8 rounded-full bg-black/[0.03] hover:bg-black/[0.08] text-neutral-700 hover:text-neutral-950 transition-all flex items-center justify-center"
            aria-label="Search catalog"
            title="Search products"
          >
            <Search className="w-4 h-4 stroke-[2]" />
          </button>

          {/* Wishlist Link */}
          <Link
            href="/wishlist"
            className="w-8 h-8 rounded-full bg-black/[0.03] hover:bg-black/[0.08] text-neutral-700 hover:text-neutral-950 transition-all flex items-center justify-center relative"
            aria-label={`Wishlist with ${wishlistCount} saved items`}
            title="Saved wishlist"
          >
            <Heart className="w-4 h-4 stroke-[2]" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-1 bg-[#0D6E5D] text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-xs">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Shopping Bag Icon Button (Matches Screenshot Right Icon) */}
          <button
            suppressHydrationWarning
            onClick={openDrawer}
            className="h-8 px-3 rounded-full bg-neutral-950 hover:bg-neutral-800 text-white transition-all flex items-center gap-1.5 shadow-sm active:scale-95 text-xs font-semibold"
            aria-label={`Shopping bag with ${totalCount} items`}
            title="Open shopping bag"
          >
            <ShoppingBag className="w-3.5 h-3.5 stroke-[2.2]" />
            {totalCount > 0 && (
              <span className="min-w-[16px] h-[16px] px-1 bg-[#0D6E5D] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {totalCount}
              </span>
            )}
          </button>

          {/* Profile / Account */}
          <Link
            href={user ? "/profile" : "/login"}
            className="w-8 h-8 rounded-full bg-black/[0.03] hover:bg-black/[0.08] text-neutral-700 hover:text-neutral-950 transition-all flex items-center justify-center"
            aria-label={user ? `Profile: ${user.name}` : "Sign In"}
            title={user ? `Account: ${user.name}` : "Sign In / Register"}
          >
            <User className="w-4 h-4 stroke-[2]" />
          </Link>

          {/* Mobile Menu Button */}
          <button
            suppressHydrationWarning
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-8 h-8 rounded-full bg-black/[0.04] hover:bg-black/[0.08] text-neutral-950 flex items-center justify-center transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-auto md:hidden mt-2 p-4 rounded-3xl bg-white/95 backdrop-blur-2xl border border-black/10 shadow-2xl space-y-2"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-4 py-2.5 rounded-2xl text-xs font-semibold text-neutral-800 hover:bg-black/5 transition-colors"
              >
                <span>{link.name}</span>
                <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
              </Link>
            ))}

            <div className="pt-2 border-t border-black/5 flex items-center justify-between px-3">
              <span className="text-xs text-neutral-500 font-medium">
                {user ? `Signed in as ${user.name.split(" ")[0]}` : "Welcome to Aurora"}
              </span>
              {user ? (
                <button
                  suppressHydrationWarning
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs text-rose-600 font-semibold flex items-center gap-1"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Sign Out</span>
                </button>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs text-[#0D6E5D] font-bold"
                >
                  Sign In
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
