"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { orderApi, productApi } from "@/lib/api";
import { OrderResponse, ShippingAddress } from "@/types/api";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatPrice } from "@/lib/utils";
import {
  CheckCircle2,
  Clock,
  Package,
  MapPin,
  CreditCard,
  ArrowRight,
  ShoppingBag,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");

  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress | null>(null);
  const [productDetails, setProductDetails] = useState<Record<number, any>>({});
  const [isLoading, setIsLoading] = useState(true);

  // 15-minute countdown timer state
  const [timeLeft, setTimeLeft] = useState<{ minutes: number; seconds: number }>({
    minutes: 14,
    seconds: 59,
  });

  useEffect(() => {
    // Trigger celebratory confetti burst on mount
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#FB641B", "#FF8A00", "#172337", "#15803D"],
      });
    } catch {}

    async function loadOrder() {
      setIsLoading(true);
      try {
        let loadedOrder: OrderResponse | null = null;

        if (orderId) {
          try {
            loadedOrder = await orderApi.getOrderById(Number(orderId));
          } catch {
            // Fallback to myorders
            const myOrders = await orderApi.getMyOrders();
            loadedOrder = myOrders.find((o) => String(o.id) === String(orderId)) || null;
          }
        }

        // Fallback to localStorage latest order
        if (!loadedOrder && typeof window !== "undefined") {
          const raw = localStorage.getItem("aurelian_latest_order");
          if (raw) {
            loadedOrder = JSON.parse(raw);
          }
        }

        if (loadedOrder) {
          setOrder(loadedOrder);

          // Fetch product names/images for order items
          const details: Record<number, any> = {};
          await Promise.all(
            (loadedOrder.items || []).map(async (item) => {
              try {
                const p = await productApi.getById(item.product_id);
                details[item.product_id] = p;
              } catch {}
            })
          );
          setProductDetails(details);
        }

        // Load shipping address from localStorage
        if (typeof window !== "undefined") {
          const rawAddr = localStorage.getItem("aurelian_shipping_address");
          if (rawAddr) {
            setShippingAddress(JSON.parse(rawAddr));
          }
        }
      } catch (err) {
        console.error("Failed to load order details:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadOrder();
  }, [orderId]);

  // Working Countdown Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { minutes: prev.minutes - 1, seconds: 59 };
        } else {
          clearInterval(timer);
          return { minutes: 0, seconds: 0 };
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto my-12 p-8 bg-white rounded-[32px] shadow-diffused border border-slate-100 animate-pulse space-y-6">
        <div className="h-16 w-16 bg-slate-200 rounded-full mx-auto" />
        <div className="h-6 w-1/2 bg-slate-200 rounded-lg mx-auto" />
        <div className="h-40 bg-slate-100 rounded-2xl" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto my-12 text-center bg-white rounded-[32px] p-8 sm:p-12 shadow-diffused border border-slate-100 space-y-4">
        <Package className="w-12 h-12 text-slate-400 mx-auto" />
        <h2 className="font-display font-bold text-xl text-slate-900">
          Order Details Not Found
        </h2>
        <p className="text-xs text-slate-500">
          We could not find the specified order receipt. Check your order history in your account profile.
        </p>
        <Link
          href="/profile"
          className="btn-primary shadow-primary-glow px-6 py-2.5 rounded-xl font-semibold text-xs inline-flex items-center gap-2"
        >
          <span>Go to My Profile</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto my-6 sm:my-10 space-y-8">
      {/* Success Hero Header */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-[32px] p-6 sm:p-10 shadow-diffused-lg border border-slate-100 text-center space-y-4"
      >
        <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <div className="space-y-1">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#FB641B]">
            Order Receipt & Verification
          </span>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900">
            Thank You! Your Order is Confirmed
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            Order identifier <strong className="text-slate-900 font-bold">#AUR-{order.id}</strong> has been transmitted to our warehouse fulfillment team.
          </p>
        </div>

        {/* Live Reservation Countdown Timer */}
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs font-semibold">
          <Clock className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            Hardware Stock Reserved:{" "}
            <strong className="font-mono text-sm text-amber-950 font-bold">
              {String(timeLeft.minutes).padStart(2, "0")}:
              {String(timeLeft.seconds).padStart(2, "0")}
            </strong>
          </span>
        </div>
      </motion.div>

      {/* Order Details & Summary Card */}
      <div className="bg-white rounded-[28px] p-6 sm:p-8 shadow-diffused border border-slate-100 space-y-6">
        {/* Meta Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <span className="text-xs text-slate-400 font-medium block">
              Order Number
            </span>
            <span className="font-display font-bold text-lg text-slate-900">
              #AUR-{order.id}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <StatusBadge status={order.status} />
            <span className="font-display font-black text-lg text-slate-900 tabular-nums">
              {formatPrice(order.total_amount)}
            </span>
          </div>
        </div>

        {/* Ordered Items List */}
        <div className="space-y-4">
          <h3 className="font-display font-bold text-sm text-slate-900">
            Items in This Shipment
          </h3>
          <div className="space-y-3">
            {(order.items || []).map((item) => {
              const p = productDetails[item.product_id];
              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-100"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-white shrink-0 overflow-hidden border border-slate-200 flex items-center justify-center">
                      {p?.image_url ? (
                        <img
                          src={p.image_url}
                          alt={p.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ShoppingBag className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-xs sm:text-sm text-slate-900">
                        {p?.name || `Hardware Unit #${item.product_id}`}
                      </h4>
                      <span className="text-xs text-slate-500">
                        Qty: {item.quantity} × {formatPrice(item.price || item.unit_price || 0)}
                      </span>
                    </div>
                  </div>
                  <span className="font-display font-bold text-xs sm:text-sm text-slate-900 tabular-nums">
                    {formatPrice((item.price || item.unit_price || 0) * item.quantity)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Shipping & Payment Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
              <MapPin className="w-4 h-4 text-[#FB641B]" />
              <span>Shipping Destination</span>
            </div>
            {shippingAddress ? (
              <div className="text-xs text-slate-600 space-y-0.5">
                <p className="font-bold text-slate-900">
                  {shippingAddress.fullName}
                </p>
                <p>{shippingAddress.streetAddress}</p>
                {shippingAddress.apartment && <p>{shippingAddress.apartment}</p>}
                <p>
                  {shippingAddress.city}, {shippingAddress.state} -{" "}
                  {shippingAddress.pincode}
                </p>
                <p className="pt-1 text-slate-500">
                  Contact: {shippingAddress.phoneNumber}
                </p>
              </div>
            ) : (
              <p className="text-xs text-slate-500">
                Express Courier Delivery registered
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
              <CreditCard className="w-4 h-4 text-[#FB641B]" />
              <span>Payment Confirmation</span>
            </div>
            <div className="text-xs text-slate-600 space-y-1">
              <p>
                Status: <strong className="text-emerald-700 font-bold">Authorized / Confirmed</strong>
              </p>
              <p>Customer: {order.user?.name} ({order.user?.email})</p>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 pt-1">
                <ShieldCheck className="w-4 h-4 text-[#FB641B]" />
                <span>2-Year Hardware Assurance Activated</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-slate-100">
          <Link
            href={`/orders/${order.id}/track`}
            className="w-full h-11 rounded-2xl bg-[#172337] hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors focus-ring"
          >
            <Package className="w-4 h-4 text-[#FB641B]" />
            <span>Track Live Shipment</span>
          </Link>
          <Link
            href="/catalog"
            className="w-full h-11 rounded-2xl btn-primary shadow-primary-glow font-bold text-xs flex items-center justify-center gap-2 transition-all focus-ring"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-xs text-slate-500">
          Loading order receipt...
        </div>
      }
    >
      <OrderConfirmationContent />
    </Suspense>
  );
}
