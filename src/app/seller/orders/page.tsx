"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShoppingBag,
  Truck,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  Package,
  Printer,
  Ban
} from "lucide-react";
import { getStoredOrders, saveStoredOrders } from "@/lib/mockData";
import { OrderResponse } from "@/types/api";
import { useToast } from "@/context/ToastContext";
import { formatPrice } from "@/lib/utils";

export default function SellerOrdersPage() {
  const { success } = useToast();
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [search, setSearch] = useState("");

  useEffect(() => {
    setOrders(getStoredOrders());
  }, []);

  const updateOrderStatus = (orderId: number, newStatus: string) => {
    const updated = orders.map((o) => {
      if (o.id === orderId) {
        return {
          ...o,
          status: newStatus,
          tracking_number:
            newStatus === "In Transit" && !o.tracking_number
              ? `EXP-DHL-${Math.floor(100000 + Math.random() * 900000)}`
              : o.tracking_number,
        };
      }
      return o;
    });

    setOrders(updated);
    saveStoredOrders(updated);
    success(`Order #${orderId} status updated to: ${newStatus}`);
  };

  const filteredOrders = orders.filter((o) => {
    const matchStatus =
      filterStatus === "ALL" ||
      (filterStatus === "PENDING" && o.status !== "In Transit" && o.status !== "Delivered" && o.status !== "Cancelled") ||
      (filterStatus === "IN_TRANSIT" && o.status === "In Transit") ||
      (filterStatus === "DELIVERED" && o.status === "Delivered");

    const matchSearch =
      o.id.toString().includes(search) ||
      (o.customer_name && o.customer_name.toLowerCase().includes(search.toLowerCase()));

    return matchStatus && matchSearch;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Merchant Order Fulfillment
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Pack shipments, generate courier airbills, and update delivery timelines.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-full border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 transition-all flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Manifest</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-[24px] bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/10 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search Order ID or Buyer name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-4 rounded-full bg-neutral-50 dark:bg-neutral-800 text-xs focus:outline-none focus:border-indigo-500 border border-transparent"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {[
            { id: "ALL", label: "All" },
            { id: "PENDING", label: "Pending Fulfillment" },
            { id: "IN_TRANSIT", label: "Dispatched" },
            { id: "DELIVERED", label: "Delivered" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                filterStatus === tab.id
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center rounded-[32px] bg-white dark:bg-neutral-900 border border-black/5 text-neutral-500 text-xs">
            No orders match the current filter.
          </div>
        ) : (
          filteredOrders.map((order) => {
            const isDelivered = order.status === "Delivered";
            const isTransit = order.status === "In Transit";

            return (
              <div
                key={order.id}
                className="p-6 rounded-[28px] bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/10 shadow-sm space-y-4 hover:shadow-md transition-shadow"
              >
                {/* Order Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-black/5 dark:border-white/5">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-neutral-900 dark:text-white">
                        Order #{order.id}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          isDelivered
                            ? "bg-emerald-500/15 text-emerald-600"
                            : isTransit
                            ? "bg-sky-500/15 text-sky-600"
                            : "bg-amber-500/15 text-amber-600"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>

                    <p className="text-[11px] text-neutral-500">
                      Placed on {new Date(order.created_at || Date.now()).toLocaleDateString()} • Customer:{" "}
                      <strong>{order.customer_name || "Avishkar Patel"}</strong> ({order.customer_email || "user@apple.design"})
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <div className="text-base font-bold text-neutral-900 dark:text-white">
                      {formatPrice(order.total_amount)}
                    </div>
                    <div className="text-[11px] text-neutral-500">
                      Paid via {order.payment_method || "UPI / Card"}
                    </div>
                  </div>
                </div>

                {/* Items in Order */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {order.items?.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-black/5 dark:border-white/5"
                    >
                      <div className="w-12 h-12 rounded-xl bg-white dark:bg-neutral-800 overflow-hidden relative shrink-0 border border-black/5">
                        {item.image_url && (
                          <Image src={item.image_url} alt={item.product_name || ""} fill className="object-cover" />
                        )}
                      </div>
                      <div className="truncate text-xs">
                        <div className="font-semibold text-neutral-900 dark:text-white truncate">
                          {item.product_name}
                        </div>
                        <div className="text-[11px] text-neutral-500">
                          Qty: {item.quantity} • {formatPrice(item.price)} each
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Shipping Address & Tracking Info */}
                <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/40 text-xs text-neutral-600 dark:text-neutral-400 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-indigo-500 shrink-0" />
                    <span>
                      Ship to: <strong>{order.shipping_address || "One Infinite Loop, Cupertino, CA"}</strong>
                    </span>
                  </div>

                  {order.tracking_number && (
                    <div className="font-mono text-[11px] text-indigo-600 dark:text-indigo-400">
                      Tracking: {order.tracking_number}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
                  {!isTransit && !isDelivered && (
                    <button
                      onClick={() => updateOrderStatus(order.id, "In Transit")}
                      className="px-4 py-2 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-xs transition-all flex items-center gap-1.5"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Fulfill & Print Airbill</span>
                    </button>
                  )}

                  {isTransit && (
                    <button
                      onClick={() => updateOrderStatus(order.id, "Delivered")}
                      className="px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-xs transition-all flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Confirm Delivery</span>
                    </button>
                  )}

                  {order.status !== "Cancelled" && !isDelivered && (
                    <button
                      onClick={() => updateOrderStatus(order.id, "Cancelled")}
                      className="px-3 py-2 rounded-full text-neutral-400 hover:text-rose-600 text-xs font-medium transition-colors"
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
