"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShieldCheck,
  Users,
  Building2,
  PackageCheck,
  ClipboardList,
  Layers,
  Sliders,
  Menu,
  X,
  ExternalLink,
  ChevronRight,
  ArrowUpRight
} from "lucide-react";

export function AdminNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { name: "Dashboard", href: "/admin/dashboard", icon: ShieldCheck },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Sellers", href: "/admin/sellers", icon: Building2 },
    { name: "Products", href: "/admin/inventory", icon: PackageCheck },
    { name: "Orders", href: "/admin/orders", icon: ClipboardList },
    { name: "Promotions", href: "/admin/content", icon: Layers },
    { name: "Settings", href: "/admin/settings", icon: Sliders },
  ];

  return (
    <header className="fixed top-4 sm:top-5 inset-x-0 mx-auto w-[calc(100%-2rem)] max-w-6xl xl:max-w-7xl z-50 transition-all duration-300 pointer-events-none">
      <div
        className={`pointer-events-auto rounded-full px-5 sm:px-7 py-2.5 sm:py-3 transition-all duration-300 flex items-center justify-between gap-4 ${
          scrolled
            ? "aurora-nav-pill scrolled"
            : "aurora-nav-pill"
        }`}
      >
        {/* Admin Brand Logo */}
        <Link
          href="/admin/dashboard"
          className="flex items-center gap-2 group shrink-0"
          title="Aurora Admin Dashboard"
        >
          <span className="font-extrabold text-base sm:text-lg tracking-tight text-neutral-950">
            Aurora
          </span>
          <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-800 border border-amber-500/20 text-[10px] font-bold tracking-wide uppercase">
            Admin
          </span>
        </Link>

        {/* Center Desktop Navigation - Single Line */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-xs font-semibold text-neutral-700">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-1.5 py-1.5 px-3 rounded-full transition-all whitespace-nowrap shrink-0 ${
                  isActive
                    ? "bg-[#0D6E5D] text-white font-bold shadow-xs"
                    : "text-neutral-700 hover:text-neutral-950 hover:bg-black/[0.04]"
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span className="whitespace-nowrap">{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Action: Customer Store Link & Mobile Toggle */}
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/"
            target="_blank"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-800 hover:text-neutral-950 bg-black/[0.04] hover:bg-black/[0.08] px-3.5 py-1.5 rounded-full border border-black/5 transition-all"
            title="View Live Customer Store"
          >
            <span>Buyer Store</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-neutral-500" />
          </Link>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden w-8 h-8 rounded-full bg-black/[0.04] hover:bg-black/[0.08] flex items-center justify-center text-neutral-950 transition-colors"
            aria-label="Toggle admin menu"
          >
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="pointer-events-auto lg:hidden mt-2 p-4 rounded-3xl bg-white/95 backdrop-blur-2xl border border-black/10 shadow-2xl space-y-1.5 animate-in fade-in slide-in-from-top-2">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center justify-between px-4 py-2.5 rounded-2xl text-xs font-semibold transition-colors ${
                  isActive
                    ? "bg-[#0D6E5D] text-white font-bold"
                    : "text-neutral-800 hover:bg-black/5"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  <span>{link.name}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
              </Link>
            );
          })}
          <div className="pt-2 border-t border-black/5">
            <Link
              href="/"
              target="_blank"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-between px-4 py-2 text-xs font-bold text-neutral-700 hover:text-neutral-950"
            >
              <span>View Customer Storefront</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
