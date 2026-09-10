"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  TrendingUp,
  Package,
  ShoppingBag,
  DollarSign,
  AlertTriangle,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  ExternalLink,
  PlusCircle,
  BarChart3,
  Store
} from "lucide-react";
import { getStoredOrders, getStoredProducts, saveStoredOrders } from "@/lib/mockData";
import { OrderResponse, ProductDetailData } from "@/types/api";
import { useToast } from "@/context/ToastContext";
import { formatPrice } from "@/lib/utils";

export default function SellerDashboardPage() {
  const { success } = useToast();
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [products, setProducts] = useState<ProductDetailData[]>([]);

  useEffect(() => {
    setOrders(getStoredOrders());
    setProducts(getStoredProducts());
  }, []);

  const pendingOrders = orders.filter((o) => o.status !== "Delivered" && o.status !== "Cancelled");
  const lowStockProducts = products.filter((p) => (p.stock || 0) < 20);

  const handleShipOrder = (orderId: number) => {
    const updated = orders.map((o) => {
      if (o.id === orderId) {
        return {
          ...o,
          status: "In Transit",
          tracking_number: o.tracking_number || `DHL-EXP-${Math.floor(100000 + Math.random() * 900000)}`
        };
      }
      return o;
    });
    setOrders(updated);
    saveStoredOrders(updated);
    success(`Order #${orderId} marked as Dispatched with tracking!`);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-6">
      {/* Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
              Seller Command Center
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
              Live
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Studio: <strong>Aurelian Prime Direct</strong> • ID: seller_1 • Payout: Weekly ACH
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/seller/store/seller_1"
            className="px-3.5 py-2 rounded-full border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 transition-all flex items-center gap-1.5"
          >
            <Store className="w-3.5 h-3.5" />
            <span>Storefront</span>
          </Link>

          <Link
            href="/seller/inventory"
            className="px-3.5 py-2 rounded-full border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 transition-all flex items-center gap-1.5"
          >
            <Package className="w-3.5 h-3.5" />
            <span>Manage Stock</span>
          </Link>

          <Link
            href="/seller/products/new"
            className="px-4 py-2 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-all flex items-center gap-1.5"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>New Listing</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-[24px] ultra-glass space-y-2">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Gross Sales</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            ₹49,20,000
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
            <TrendingUp className="w-3 h-3" />
            <span>+18.4% vs last 30 days</span>
          </div>
        </div>

        <div className="p-5 rounded-[24px] ultra-glass space-y-2">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Pending Orders</span>
            <ShoppingBag className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            {pendingOrders.length}
          </div>
          <div className="text-[11px] text-neutral-500 font-medium">
            Requires packing / label print
          </div>
        </div>

        <div className="p-5 rounded-[24px] ultra-glass space-y-2">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Listings</span>
            <Package className="w-4 h-4 text-neutral-500" />
          </div>
          <div className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            {products.length}
          </div>
          <div className="text-[11px] text-neutral-500 font-medium">
            Across 5 precision categories
          </div>
        </div>

        <div className="p-5 rounded-[24px] ultra-glass space-y-2">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Store Rating</span>
            <span className="text-amber-500 font-bold text-xs">★ 4.9</span>
          </div>
          <div className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            99.2%
          </div>
          <div className="text-[11px] text-neutral-500 font-medium">
            Fulfillment SLA compliance
          </div>
        </div>
      </div>

      {/* Revenue Velocity Chart (Visual Bar Breakdown) */}
      <div className="p-6 rounded-[32px] ultra-glass space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-neutral-900 dark:text-white">
              Weekly Revenue Velocity
            </h2>
            <p className="text-[11px] text-neutral-500">Daily settlement totals over the past 7 days</p>
          </div>
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            ₹4,28,000 this week
          </span>
        </div>

        <div className="h-36 flex items-end justify-between gap-3 pt-4 border-b border-black/5 dark:border-white/5 pb-2">
          {[
            { day: "Mon", val: 68, amount: "₹48k" },
            { day: "Tue", val: 82, amount: "₹62k" },
            { day: "Wed", val: 54, amount: "₹39k" },
            { day: "Thu", val: 95, amount: "₹84k" },
            { day: "Fri", val: 78, amount: "₹59k" },
            { day: "Sat", val: 88, amount: "₹71k" },
            { day: "Sun", val: 92, amount: "₹65k" },
          ].map((bar, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 group">
              <span className="text-[10px] text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity font-semibold">
                {bar.amount}
              </span>
              <div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-t-lg h-28 flex items-end overflow-hidden">
                <div
                  style={{ height: `${bar.val}%` }}
                  className="w-full bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-md transition-all group-hover:brightness-110"
                />
              </div>
              <span className="text-[10px] font-medium text-neutral-500">{bar.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Grid: Pending Orders & Low Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Shipments (2 Cols) */}
        <div className="lg:col-span-2 p-6 rounded-[32px] bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/10 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-500" />
              <span>Pending Fulfillment Orders</span>
            </h2>
            <Link
              href="/seller/orders"
              className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
            >
              View All Orders →
            </Link>
          </div>

          <div className="space-y-3">
            {orders.slice(0, 3).map((order) => (
              <div
                key={order.id}
                className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-black/5 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-neutral-900 dark:text-white">
                      Order #{order.id}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        order.status === "Delivered"
                          ? "bg-emerald-500/15 text-emerald-600"
                          : order.status === "In Transit"
                          ? "bg-sky-500/15 text-sky-600"
                          : "bg-amber-500/15 text-amber-600"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <div className="text-xs text-neutral-500 mt-1">
                    Buyer: {order.customer_name || "Avishkar Patel"} • Total:{" "}
                    <strong>{formatPrice(order.total_amount)}</strong> • {order.items?.length || 1} item(s)
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {order.status !== "In Transit" && order.status !== "Delivered" ? (
                    <button
                      onClick={() => handleShipOrder(order.id)}
                      className="px-3.5 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-all shadow-xs"
                    >
                      Dispatch / Print Label
                    </button>
                  ) : (
                    <span className="text-xs text-neutral-400 flex items-center gap-1 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      Dispatched
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Alerts (1 Col) */}
        <div className="p-6 rounded-[32px] bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/10 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>Stock Alerts</span>
            </h2>
            <Link
              href="/seller/inventory"
              className="text-xs text-neutral-500 hover:text-neutral-700"
            >
              Restock
            </Link>
          </div>

          <div className="space-y-3">
            {lowStockProducts.slice(0, 4).map((p) => (
              <div
                key={p.id}
                className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-black/5 dark:border-white/5 flex items-center justify-between text-xs"
              >
                <div className="truncate max-w-[170px]">
                  <div className="font-semibold text-neutral-900 dark:text-white truncate">
                    {p.name}
                  </div>
                  <div className="text-[11px] text-neutral-400">{formatPrice(p.price)}</div>
                </div>
                <div className="text-right">
                  <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 font-bold text-[10px]">
                    {p.stock} units left
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
