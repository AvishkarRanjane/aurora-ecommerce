"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { validateEmail, getPasswordStrength } from "@/lib/utils";
import {
  ShoppingBag,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Shield,
} from "lucide-react";
import { motion } from "framer-motion";

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/";
  const { user, login, register } = useAuth();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already logged in, redirect
  useEffect(() => {
    if (user && returnUrl !== "/auth") {
      // If user is admin or seller and went to generic profile
      if (user.is_admin && returnUrl === "/profile") {
        router.replace("/admin/dashboard");
      } else {
        router.replace(returnUrl);
      }
    }
  }, [user, router, returnUrl]);

  const passwordStrength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!validateEmail(email)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    if (mode === "register" && !name.trim()) {
      setErrorMessage("Please enter your full name.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (mode === "login") {
        await login(email.trim(), password);
      } else {
        await register(name.trim(), email.trim(), password);
      }
      router.push(returnUrl);
    } catch (err: any) {
      setErrorMessage(err.message || "Sign in failed. Please check your credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInstantJump = async (role: "customer" | "seller" | "admin") => {
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      if (role === "admin") {
        await login("user@apple.design", "admin123");
        router.push("/admin/dashboard");
      } else if (role === "seller") {
        await login("prime@aureliandesign.io", "seller123");
        router.push("/seller/dashboard");
      } else {
        await login("user@apple.design", "user123");
        router.push("/");
      }
    } catch {
      if (role === "admin") router.push("/admin/dashboard");
      else if (role === "seller") router.push("/seller/dashboard");
      else router.push("/");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto my-6 sm:my-10 space-y-6">
      {/* 1. Temporary Quick Role Switcher Cards (Requested for testing / interface navigation) */}
      <div className="aurora-glass-card p-6 sm:p-7 border border-black/5 shadow-md space-y-4">
        <div className="flex items-center justify-between border-b border-black/5 pb-3">
          <div>
            <span className="text-[11px] font-bold text-[#0D6E5D] uppercase tracking-wider">
              Instant Access
            </span>
            <h2 className="text-lg font-bold text-neutral-950">
              Choose an Interface to Open
            </h2>
          </div>
          <span className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-full font-semibold">
            One-Click Login
          </span>
        </div>

        <p className="text-xs text-neutral-600">
          Click any button below to immediately sign in and jump directly to that interface:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Customer Card */}
          <button
            type="button"
            onClick={() => handleInstantJump("customer")}
            disabled={isSubmitting}
            className="p-4 rounded-2xl bg-white hover:bg-emerald-50/50 border border-black/5 hover:border-emerald-300 text-left transition-all hover:shadow-md flex flex-col justify-between group active:scale-[0.98]"
          >
            <div className="space-y-1 mb-3">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-sm font-bold group-hover:scale-110 transition-transform">
                🛍️
              </div>
              <h3 className="font-bold text-sm text-neutral-950">Customer</h3>
              <p className="text-[11px] text-neutral-500 leading-tight font-normal">
                Browse products, add to cart & buy in Indian Rupees (₹)
              </p>
            </div>
            <span className="text-xs font-bold text-[#0D6E5D] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              <span>Open Store</span>
              <ArrowRight className="w-3 h-3" />
            </span>
          </button>

          {/* Seller Card */}
          <button
            type="button"
            onClick={() => handleInstantJump("seller")}
            disabled={isSubmitting}
            className="p-4 rounded-2xl bg-white hover:bg-indigo-50/50 border border-black/5 hover:border-indigo-300 text-left transition-all hover:shadow-md flex flex-col justify-between group active:scale-[0.98]"
          >
            <div className="space-y-1 mb-3">
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-800 flex items-center justify-center text-sm font-bold group-hover:scale-110 transition-transform">
                📦
              </div>
              <h3 className="font-bold text-sm text-neutral-950">Seller</h3>
              <p className="text-[11px] text-neutral-500 leading-tight font-normal">
                Upload products, manage stock & check earnings
              </p>
            </div>
            <span className="text-xs font-bold text-indigo-700 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              <span>Open Seller</span>
              <ArrowRight className="w-3 h-3" />
            </span>
          </button>

          {/* Admin Card */}
          <button
            type="button"
            onClick={() => handleInstantJump("admin")}
            disabled={isSubmitting}
            className="p-4 rounded-2xl bg-white hover:bg-amber-50/50 border border-black/5 hover:border-amber-300 text-left transition-all hover:shadow-md flex flex-col justify-between group active:scale-[0.98]"
          >
            <div className="space-y-1 mb-3">
              <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-sm font-bold group-hover:scale-110 transition-transform">
                ⚡
              </div>
              <h3 className="font-bold text-sm text-neutral-950">Admin</h3>
              <p className="text-[11px] text-neutral-500 leading-tight font-normal">
                Control store settings, manage users & approve sellers
              </p>
            </div>
            <span className="text-xs font-bold text-amber-800 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              <span>Open Admin</span>
              <ArrowRight className="w-3 h-3" />
            </span>
          </button>
        </div>
      </div>

      {/* 2. Standard Sign In / Register Form */}
      <div className="aurora-glass-card p-6 sm:p-9 border border-black/5 shadow-md relative overflow-hidden">
        <div className="flex flex-col items-center text-center mb-6">
          <h1 className="text-2xl font-extrabold text-neutral-950 tracking-tight">
            {mode === "login" ? "Sign In to Your Account" : "Create a New Account"}
          </h1>
          <p className="text-xs text-neutral-600 mt-1">
            {mode === "login"
              ? "Sign in with your email and password to access your saved orders"
              : "Join Aurora to get fast checkouts, free delivery, and order tracking"}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-black/[0.04] rounded-full mb-6 max-w-xs mx-auto">
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setErrorMessage(null);
            }}
            className={`py-2 text-xs font-bold rounded-full transition-all ${
              mode === "login"
                ? "bg-white text-neutral-950 shadow-xs"
                : "text-neutral-600 hover:text-neutral-950"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("register");
              setErrorMessage(null);
            }}
            className={`py-2 text-xs font-bold rounded-full transition-all ${
              mode === "register"
                ? "bg-white text-neutral-950 shadow-xs"
                : "text-neutral-600 hover:text-neutral-950"
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-start gap-2.5"
          >
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-800 block">
                Your Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. Avishkar Patel"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 bg-white/90 border border-black/10 rounded-2xl text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-[#0D6E5D] focus:ring-2 focus:ring-[#0D6E5D]/20 transition-all"
                />
                <User className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-neutral-800 block">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 pl-10 pr-4 bg-white/90 border border-black/10 rounded-2xl text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-[#0D6E5D] focus:ring-2 focus:ring-[#0D6E5D]/20 transition-all"
              />
              <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-neutral-800 block">
                Password
              </label>
              {mode === "login" && (
                <Link
                  href="/forgot-password"
                  className="text-[11px] font-semibold text-[#0D6E5D] hover:underline"
                >
                  Forgot password?
                </Link>
              )}
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 pl-10 pr-10 bg-white/90 border border-black/10 rounded-2xl text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-[#0D6E5D] focus:ring-2 focus:ring-[#0D6E5D]/20 transition-all"
              />
              <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-neutral-400 hover:text-neutral-700"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Password Strength Meter for Registration */}
            {mode === "register" && password && (
              <div className="pt-1 space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-neutral-400 font-medium">Password Strength</span>
                  <span className="font-bold text-neutral-700">{passwordStrength.label}</span>
                </div>
                <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden flex gap-1">
                  {[1, 2, 3, 4].map((step) => (
                    <div
                      key={step}
                      className={`h-full flex-1 rounded-full transition-colors ${
                        step <= passwordStrength.score ? passwordStrength.color : "bg-neutral-200"
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-11 rounded-full aurora-btn-primary font-bold text-xs sm:text-sm flex items-center justify-center gap-2 mt-4 disabled:opacity-60"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>{mode === "login" ? "Sign In" : "Complete Registration"}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-xs text-neutral-500">
          Loading sign in...
        </div>
      }
    >
      <AuthContent />
    </Suspense>
  );
}
