"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Search,
  Shield,
  ShieldAlert,
  Ban,
  CheckCircle2,
  Lock,
  Mail,
  Phone,
  UserCheck
} from "lucide-react";
import { getStoredAdminUsers, saveStoredAdminUsers } from "@/lib/mockData";
import { AdminUserRecord } from "@/types/api";
import { useToast } from "@/context/ToastContext";
import { formatPrice } from "@/lib/utils";

export default function AdminUsersPage() {
  const { success, error: toastError } = useToast();
  const [users, setUsers] = useState<AdminUserRecord[]>([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");

  useEffect(() => {
    setUsers(getStoredAdminUsers());
  }, []);

  const handleToggleBlock = (userId: number) => {
    const updated = users.map((u) => {
      if (u.id === userId) {
        const nextStatus = u.status === "ACTIVE" ? ("BLOCKED" as const) : ("ACTIVE" as const);
        return { ...u, status: nextStatus };
      }
      return u;
    });
    setUsers(updated);
    saveStoredAdminUsers(updated);

    const user = updated.find((u) => u.id === userId);
    if (user?.status === "BLOCKED") {
      toastError(`Account for ${user.name} has been suspended.`);
    } else {
      success(`Account for ${user?.name} has been reactivated.`);
    }
  };

  const handleToggleRole = (userId: number) => {
    const updated = users.map((u) => {
      if (u.id === userId) {
        const nextRole = u.role === "CUSTOMER" ? ("SELLER" as const) : u.role === "SELLER" ? ("ADMIN" as const) : ("CUSTOMER" as const);
        return { ...u, role: nextRole };
      }
      return u;
    });
    setUsers(updated);
    saveStoredAdminUsers(updated);
    success("User permissions and role updated.");
  };

  const filtered = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "ALL" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  return (
    <div className="space-y-6 py-2">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
          Platform User Management
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          Inspect registered customer profiles, arbitrate security blocks, and manage organizational privileges.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-[24px] bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/10 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search users by full name or email address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-4 rounded-full bg-neutral-50 dark:bg-neutral-800 text-xs focus:outline-none focus:border-amber-500 border border-transparent"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {["ALL", "CUSTOMER", "SELLER", "ADMIN"].map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                roleFilter === r
                  ? "bg-amber-500 text-neutral-950 font-bold shadow-xs"
                  : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-[28px] bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/10 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 dark:bg-neutral-800/50 text-neutral-500 uppercase tracking-wider font-semibold border-b border-black/5 dark:border-white/5">
              <tr>
                <th className="py-3 px-4">User Details</th>
                <th className="py-3 px-4">Platform Role</th>
                <th className="py-3 px-4">Account Status</th>
                <th className="py-3 px-4">Total Orders</th>
                <th className="py-3 px-4">Lifetime Spend</th>
                <th className="py-3 px-4 text-right">Administrative Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/5">
              {filtered.map((u) => {
                const isBlocked = u.status === "BLOCKED";
                return (
                  <tr key={u.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold text-xs flex items-center justify-center shrink-0">
                          {u.name[0]}
                        </div>
                        <div>
                          <div className="font-semibold text-neutral-900 dark:text-white flex items-center gap-1.5">
                            {u.name}
                            {u.role === "ADMIN" && (
                              <span className="text-[10px] text-amber-600 font-mono">⚡ ROOT</span>
                            )}
                          </div>
                          <div className="text-[11px] text-neutral-400">
                            {u.email} • Joined {u.joinedDate}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleRole(u.id)}
                        className="px-2.5 py-0.5 rounded-full text-[10px] font-bold border hover:scale-105 transition-transform bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-300 dark:border-neutral-700"
                        title="Click to cycle role (Customer → Seller → Admin)"
                      >
                        {u.role}
                      </button>
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          isBlocked
                            ? "bg-rose-500/15 text-rose-600"
                            : "bg-emerald-500/15 text-emerald-600"
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-medium text-neutral-700 dark:text-neutral-300">
                      {u.ordersCount} orders
                    </td>

                    <td className="py-3 px-4 font-bold text-neutral-900 dark:text-white">
                      {formatPrice(u.totalSpent)}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleBlock(u.id)}
                          className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all flex items-center gap-1 ${
                            isBlocked
                              ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                              : "bg-rose-50 dark:bg-rose-950/30 text-rose-600 hover:bg-rose-100"
                          }`}
                        >
                          {isBlocked ? (
                            <>
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Reactivate</span>
                            </>
                          ) : (
                            <>
                              <Ban className="w-3 h-3" />
                              <span>Suspend</span>
                            </>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
