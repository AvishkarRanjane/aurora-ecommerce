"use client";

import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { orderApi, productApi } from "@/lib/api";
import { OrderResponse, OrderStatus } from "@/types/api";
import { useToast } from "@/context/ToastContext";
import { Modal } from "@/components/ui/Modal";
import { formatPrice } from "@/lib/utils";
import {
  ShoppingBag,
  Search,
  Eye,
  CheckCircle2,
  Package,
  Truck,
  RotateCcw,
  Clock,
  ShieldCheck
} from "lucide-react";

const ALL_STATUSES = ["ALL", "PENDING", "In Transit", "Delivered", "Cancelled"];

export default function AdminOrdersPage() {
  const { success, error: toastError } = useToast();
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [inspectingOrder, setInspectingOrder] = useState<OrderResponse | null>(null);

  const loadOrders = useCallback(async () => {
    try {
      const data = await orderApi.getAllOrders();
      setOrders(data || []);
    } catch {
      setOrders([]);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      const updated = await orderApi.updateStatus(orderId, { status: newStatus as any });
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
      if (inspectingOrder && inspectingOrder.id === orderId) {
        setInspectingOrder(updated);
      }
      success(`Order #${orderId} status updated to: ${newStatus}`);
    } catch {
      toastError("Failed to update order status");
    }
  };

  const filteredOrders = orders.filter((ord) => {
    const matchesStatus =
      selectedStatusFilter === "ALL" ||
      (selectedStatusFilter === "PENDING" && ord.status !== "In Transit" && ord.status !== "Delivered" && ord.status !== "Cancelled") ||
      ord.status === selectedStatusFilter;

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      String(ord.id).includes(q) ||
      (ord.customer_name || ord.user?.name || "").toLowerCase().includes(q) ||
      (ord.customer_email || ord.user?.email || "").toLowerCase().includes(q);

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 py-2">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
          Global Order Governance & Disputes
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          Supervise global merchant fulfillment, track airbills, and arbitrate refund disputes.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-[24px] bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/10 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by Order ID, Buyer name, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-4 rounded-full bg-neutral-50 dark:bg-neutral-800 text-xs focus:outline-none focus:border-amber-500 border border-transparent"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {ALL_STATUSES.map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatusFilter(st)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                selectedStatusFilter === st
                  ? "bg-amber-500 text-neutral-950 font-bold shadow-xs"
                  : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-[28px] bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/10 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 dark:bg-neutral-800/50 text-neutral-500 uppercase tracking-wider font-semibold border-b border-black/5 dark:border-white/5">
              <tr>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Items</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status & Status Override</th>
                <th className="py-3 px-4 text-right">Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/5">
              {filteredOrders.map((ord) => {
                const isDelivered = ord.status === "Delivered";
                const isTransit = ord.status === "In Transit";

                return (
                  <tr key={ord.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-neutral-900 dark:text-white">
                      #{ord.id}
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-semibold text-neutral-900 dark:text-white">
                        {ord.customer_name || ord.user?.name || "Customer"}
                      </div>
                      <div className="text-[10px] text-neutral-400">
                        {ord.customer_email || ord.user?.email || "user@apple.design"}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400 font-medium">
                      {ord.items?.length || 1} item(s)
                    </td>

                    <td className="py-3 px-4 font-bold text-neutral-900 dark:text-white">
                      {formatPrice(ord.total_amount)}
                    </td>

                    <td className="py-3 px-4">
                      <select
                        value={ord.status}
                        onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                        className="h-7 px-2.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-xs font-semibold text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-700 cursor-pointer"
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="In Transit">In Transit</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setInspectingOrder(ord)}
                        className="px-3 py-1 rounded-full text-xs font-semibold text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Details</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Modal */}
      <Modal
        isOpen={inspectingOrder !== null}
        onClose={() => setInspectingOrder(null)}
        title={inspectingOrder ? `Audit Breakdown: Order #${inspectingOrder.id}` : ""}
        description="Verify delivery escrow, airbill dispatch, and buyer details."
        maxWidth="lg"
      >
        {inspectingOrder && (
          <div className="space-y-4 pt-2 text-xs">
            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-black/5 dark:border-white/5 space-y-1">
              <span className="font-bold text-neutral-900 dark:text-white block">
                Destination Address:
              </span>
              <p className="text-neutral-600 dark:text-neutral-400">
                {inspectingOrder.shipping_address || "One Infinite Loop, Cupertino, CA 95014"}
              </p>
              {inspectingOrder.tracking_number && (
                <p className="font-mono text-indigo-600 dark:text-indigo-400 pt-1">
                  Airbill: {inspectingOrder.tracking_number}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <span className="font-bold text-neutral-900 dark:text-white block">
                Order Items:
              </span>
              {inspectingOrder.items?.map((it) => (
                <div
                  key={it.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/10"
                >
                  <span className="font-semibold text-neutral-900 dark:text-white">
                    {it.product_name || `Product #${it.product_id}`} (x{it.quantity})
                  </span>
                  <span className="font-bold text-neutral-900 dark:text-white">
                    {formatPrice((it.price || it.unit_price || 0) * it.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-black/5 dark:border-white/5 flex items-center justify-between font-bold text-sm">
              <span>Order Total</span>
              <span className="text-[#0D6E5D] font-bold">{formatPrice(inspectingOrder.total_amount)}</span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
