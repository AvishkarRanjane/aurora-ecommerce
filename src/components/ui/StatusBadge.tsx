"use client";

import React from "react";
import { OrderStatus } from "@/types/api";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: OrderStatus | string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const normalized = (status || "").toUpperCase();

  const config: Record<
    string,
    { label: string; bg: string; text: string; border: string; dot: string }
  > = {
    CONFIRMED: {
      label: "Confirmed",
      bg: "bg-emerald-50 text-emerald-700",
      text: "text-emerald-800",
      border: "border-emerald-200/80",
      dot: "bg-emerald-500",
    },
    DELIVERED: {
      label: "Delivered",
      bg: "bg-teal-50 text-teal-700",
      text: "text-teal-800",
      border: "border-teal-200/80",
      dot: "bg-teal-500",
    },
    SHIPPED: {
      label: "Shipped",
      bg: "bg-sky-50 text-sky-700",
      text: "text-sky-800",
      border: "border-sky-200/80",
      dot: "bg-sky-500",
    },
    PENDING: {
      label: "Pending",
      bg: "bg-amber-50 text-amber-700",
      text: "text-amber-800",
      border: "border-amber-200/80",
      dot: "bg-amber-500 animate-pulse",
    },
    CANCELLED: {
      label: "Cancelled",
      bg: "bg-rose-50 text-rose-700",
      text: "text-rose-800",
      border: "border-rose-200/80",
      dot: "bg-rose-500",
    },
  };

  const current = config[normalized] || {
    label: status,
    bg: "bg-slate-100 text-slate-700",
    text: "text-slate-800",
    border: "border-slate-200",
    dot: "bg-slate-400",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all",
        current.bg,
        current.border,
        className
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", current.dot)} />
      <span>{current.label}</span>
    </span>
  );
}
