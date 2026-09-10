"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  RotateCcw,
  CheckCircle2,
  Clock,
  Truck,
  ArrowRight,
  ShieldCheck,
  Package,
  Calendar
} from "lucide-react";
import { getStoredReturns, saveStoredReturns, getStoredOrders } from "@/lib/mockData";
import { ReturnItem, OrderResponse } from "@/types/api";
import { useToast } from "@/context/ToastContext";
import { Modal } from "@/components/ui/Modal";
import { formatPrice } from "@/lib/utils";

export default function ReturnsRefundsPage() {
  const { success } = useToast();
  const [returns, setReturns] = useState<ReturnItem[]>([]);
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [requestOpen, setRequestOpen] = useState(false);

  // New Return Form
  const [selectedOrderId, setSelectedOrderId] = useState<number>(94821);
  const [returnReason, setReturnReason] = useState("Prefer different titanium finish");
  const [pickupDate, setPickupDate] = useState("2025-03-18");

  useEffect(() => {
    setReturns(getStoredReturns());
    setOrders(getStoredOrders());
  }, []);

  const handleCreateReturn = (e: React.FormEvent) => {
    e.preventDefault();
    const order = orders.find((o) => o.id === Number(selectedOrderId)) || orders[0];
    const item = order?.items?.[0];

    const newReturn: ReturnItem = {
      id: `ret_${Date.now()}`,
      orderId: order?.id || 94821,
      productId: item?.product_id || 1,
      productName: item?.product_name || "Aurelian Studio Max",
      reason: returnReason,
      status: "REQUESTED",
      requestedDate: new Date().toISOString().split("T")[0],
      refundAmount: order?.total_amount || 549,
      pickupScheduled: `${pickupDate} (Prepaid DHL Airbill Generated)`
    };

    const updated = [newReturn, ...returns];
    setReturns(updated);
    saveStoredReturns(updated);
    setRequestOpen(false);
    success(`Return request for Order #${newReturn.orderId} submitted! DHL courier booked for pickup.`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 tracking-wider uppercase">
            30-Day Guaranteed Returns
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Returns & Refund Center
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Complimentary doorstep courier pickup, zero restocking penalties, and instant refund disbursement.
          </p>
        </div>

        <button
          onClick={() => setRequestOpen(true)}
          className="px-5 py-2.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs transition-all shadow-md flex items-center gap-1.5 self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Start New Return</span>
        </button>
      </div>

      {/* Active Returns Timeline Cards */}
      <div className="space-y-6">
        <h2 className="text-base font-bold text-neutral-900 dark:text-white">
          Active Return Cases ({returns.length})
        </h2>

        {returns.map((ret) => (
          <div
            key={ret.id}
            className="p-6 sm:p-8 rounded-[32px] bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/10 shadow-sm space-y-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-black/5 dark:border-white/5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-neutral-900 dark:text-white">
                    Return #{ret.id}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/15 text-indigo-600 dark:text-indigo-400">
                    Order #{ret.orderId}
                  </span>
                </div>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Item: <strong>{ret.productName}</strong> • Reason: {ret.reason}
                </p>
              </div>

              <div className="text-left sm:text-right">
                <div className="text-base font-bold text-neutral-900 dark:text-white">
                  {formatPrice(ret.refundAmount)} Refund
                </div>
                <div className="text-[11px] text-neutral-400">
                  To Original Payment Method
                </div>
              </div>
            </div>

            {/* 4-Step Visual Progress Timeline */}
            <div className="space-y-2">
              <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block">
                Refund Lifecycle Progress
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <div>
                    <div className="font-bold">Requested</div>
                    <div className="text-[10px] opacity-80">{ret.requestedDate}</div>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <div>
                    <div className="font-bold">Airbill Created</div>
                    <div className="text-[10px] opacity-80">Prepaid DHL</div>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 font-semibold flex items-center gap-2">
                  <Clock className="w-4 h-4 shrink-0 animate-spin" />
                  <div>
                    <div className="font-bold">Courier Pickup</div>
                    <div className="text-[10px] opacity-80">In Transit to Lab</div>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-neutral-400 font-semibold flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <div>
                    <div className="font-bold">Refund Released</div>
                    <div className="text-[10px] opacity-80">Pending Arrival</div>
                  </div>
                </div>
              </div>
            </div>

            {ret.pickupScheduled && (
              <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 text-xs text-neutral-600 dark:text-neutral-300 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-indigo-500" />
                  <span>Doorstep Courier Pickup: <strong>{ret.pickupScheduled}</strong></span>
                </div>
                <span className="text-[10px] text-neutral-400">Keep original packaging ready</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Start Return Modal */}
      <Modal
        isOpen={requestOpen}
        onClose={() => setRequestOpen(false)}
        title="Initiate Hardware Return"
        description="Select your eligible delivered order and schedule courier pickup."
        maxWidth="md"
      >
        <form onSubmit={handleCreateReturn} className="space-y-4 pt-2 text-xs">
          <div>
            <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Select Delivered Order
            </label>
            <select
              value={selectedOrderId}
              onChange={(e) => setSelectedOrderId(Number(e.target.value))}
              className="w-full h-10 px-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs focus:outline-none"
            >
              {orders.map((o) => (
                <option key={o.id} value={o.id}>
                  Order #{o.id} — {formatPrice(o.total_amount)} ({o.items?.[0]?.product_name || "Hardware"})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Reason for Return
            </label>
            <select
              value={returnReason}
              onChange={(e) => setReturnReason(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs focus:outline-none"
            >
              <option>Prefer different titanium color finish</option>
              <option>Size or ergonomic fit preference</option>
              <option>Ordered by mistake / changed mind</option>
              <option>Performance / acoustic expectations</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Preferred Courier Pickup Date
            </label>
            <input
              type="date"
              required
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs focus:outline-none"
            />
          </div>

          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-[11px] leading-relaxed">
            A digital shipping label will be sent to your email. The courier will bring a printed airbill sticker at the time of pickup.
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs shadow-md transition-colors"
          >
            Confirm & Generate Prepaid Airbill
          </button>
        </form>
      </Modal>
    </div>
  );
}
