"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Package,
  Phone,
  ArrowLeft,
  ShieldCheck,
  Ban
} from "lucide-react";
import { getStoredOrders, saveStoredOrders } from "@/lib/mockData";
import { OrderResponse } from "@/types/api";
import { useToast } from "@/context/ToastContext";
import { Modal } from "@/components/ui/Modal";
import { formatPrice } from "@/lib/utils";

export default function OrderTrackingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const orderId = Number(resolvedParams.id);
  const { success } = useToast();

  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("Accidental duplicate order");

  useEffect(() => {
    const orders = getStoredOrders();
    const found = orders.find((o) => o.id === orderId) || orders[0];
    setOrder(found);
  }, [orderId]);

  if (!order) return null;

  const handleCancelOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const all = getStoredOrders();
    const updated = all.map((o) => {
      if (o.id === order.id) {
        return { ...o, status: "Cancelled" };
      }
      return o;
    });
    setOrder({ ...order, status: "Cancelled" });
    saveStoredOrders(updated);
    setCancelOpen(false);
    success(`Order #${order.id} cancelled. 100% refund initiated to your original payment method.`);
  };

  const isCancelled = order.status === "Cancelled";
  const isDelivered = order.status === "Delivered";
  const isInTransit = order.status === "In Transit";

  // Compute active milestone step
  const activeStep = isCancelled ? 0 : isDelivered ? 4 : isInTransit ? 3 : 2;

  const steps = [
    { title: "Order Confirmed", desc: "Payment settled via Apple Pay", time: "Day 1, 10:24 AM" },
    { title: "Studio Assembly", desc: "Acoustic inspection passed", time: "Day 1, 02:40 PM" },
    { title: "Dispatched (DHL Airbill)", desc: order.tracking_number || "EXP-DHL-994102", time: "Day 2, 08:15 AM" },
    { title: "Out for Delivery", desc: "With local courier van", time: "Estimated Tomorrow" },
    { title: "Delivered to Doorstep", desc: "Recipient signature required", time: "Completed" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6">
      {/* Back Link */}
      <Link
        href="/profile?tab=orders"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Order History</span>
      </Link>

      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-[32px] bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/10 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
              Shipment Tracking: #{order.id}
            </h1>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                isDelivered
                  ? "bg-emerald-500/15 text-emerald-600"
                  : isCancelled
                  ? "bg-rose-500/15 text-rose-600"
                  : "bg-indigo-500/15 text-indigo-600"
              }`}
            >
              {order.status}
            </span>
          </div>

          <p className="text-xs text-neutral-500">
            Courier: <strong>DHL Express Worldwide</strong> • Airbill:{" "}
            <span className="font-mono text-indigo-600 dark:text-indigo-400">
              {order.tracking_number || "AP-8921-9304"}
            </span>
          </p>
        </div>

        {!isCancelled && !isDelivered && (
          <button
            onClick={() => setCancelOpen(true)}
            className="px-4 py-2 rounded-full border border-neutral-200 dark:border-neutral-700 text-neutral-500 hover:text-rose-600 text-xs font-semibold hover:bg-rose-50 transition-colors self-start sm:self-auto"
          >
            Cancel Order
          </button>
        )}
      </div>

      {/* 5-Step Animated Timeline */}
      <div className="p-6 sm:p-8 rounded-[32px] bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/10 shadow-sm space-y-6">
        <h2 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
          <Truck className="w-4 h-4 text-indigo-500" />
          <span>Live Transit Milestones</span>
        </h2>

        <div className="space-y-6 relative pl-6 border-l-2 border-neutral-100 dark:border-neutral-800 ml-3">
          {steps.map((st, idx) => {
            const stepNum = idx + 1;
            const isCompleted = stepNum < activeStep || (stepNum === activeStep && isDelivered);
            const isCurrent = stepNum === activeStep && !isDelivered;

            return (
              <div key={idx} className="relative space-y-1">
                {/* Node Bullet */}
                <div
                  className={`absolute -left-[31px] top-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold shadow-xs transition-all ${
                    isCompleted
                      ? "bg-emerald-500 ring-4 ring-emerald-500/20"
                      : isCurrent
                      ? "bg-indigo-600 ring-4 ring-indigo-500/20 animate-pulse"
                      : "bg-neutral-200 dark:bg-neutral-800 text-neutral-400"
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : stepNum}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span
                    className={`font-semibold text-xs ${
                      isCompleted || isCurrent
                        ? "text-neutral-900 dark:text-white"
                        : "text-neutral-400"
                    }`}
                  >
                    {st.title}
                  </span>
                  <span className="text-[10px] text-neutral-400 font-medium">
                    {st.time}
                  </span>
                </div>

                <p className="text-[11px] text-neutral-500">
                  {st.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Destination & Order Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Shipping Destination */}
        <div className="p-6 rounded-[28px] bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/10 shadow-sm space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-indigo-500" />
            <span>Delivery Destination</span>
          </h3>

          <p className="text-xs font-semibold text-neutral-900 dark:text-white">
            {order.customer_name || "Avishkar Patel"}
          </p>
          <p className="text-xs text-neutral-500 leading-relaxed">
            {order.shipping_address || "One Infinite Loop, Cupertino, CA 95014"}
          </p>
          <p className="text-xs text-neutral-400">
            Payment Mode: {order.payment_method || "Apple Pay"}
          </p>
        </div>

        {/* Item Summary */}
        <div className="p-6 rounded-[28px] bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/10 shadow-sm space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
            <Package className="w-3.5 h-3.5 text-indigo-500" />
            <span>Package Contents</span>
          </h3>

          <div className="space-y-2">
            {order.items?.map((it) => (
              <div key={it.id} className="flex items-center justify-between text-xs">
                <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                  {it.product_name} (x{it.quantity})
                </span>
                <span className="font-bold text-neutral-900 dark:text-white">
                  ${(it.price || it.unit_price || 0) * it.quantity}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-xs font-bold">
            <span>Total Amount</span>
            <span className="text-sm font-bold text-[#0D6E5D]">{formatPrice(order.total_amount)}</span>
          </div>
        </div>
      </div>

      {/* Cancel Order Modal */}
      <Modal
        isOpen={cancelOpen}
        onClose={() => setCancelOpen(false)}
        title={`Cancel Order #${order.id}`}
        description="Are you sure you wish to cancel this shipment? A full refund will be processed immediately."
        maxWidth="md"
      >
        <form onSubmit={handleCancelOrder} className="space-y-4 pt-2 text-xs">
          <div>
            <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Cancellation Reason
            </label>
            <select
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs focus:outline-none"
            >
              <option>Accidental duplicate order</option>
              <option>Selected incorrect finish or address</option>
              <option>Need to change payment method</option>
              <option>Delivery timeframe too distant</option>
            </select>
          </div>

          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 text-[11px] leading-relaxed">
            Upon cancellation, our warehouse dispatch is notified and a refund of {formatPrice(order.total_amount)} is returned to your original payment method.
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setCancelOpen(false)}
              className="px-4 py-2 rounded-full text-neutral-500 hover:text-neutral-700 text-xs"
            >
              Keep Order
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-colors shadow-sm"
            >
              Confirm Cancellation
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
