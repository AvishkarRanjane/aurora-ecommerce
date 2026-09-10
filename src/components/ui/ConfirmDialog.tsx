"use client";

import React from "react";
import { Modal } from "./Modal";
import { AlertTriangle, Trash2, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "default";
  isLoading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  isLoading = false,
}: ConfirmDialogProps) {
  const isDanger = variant === "danger";

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="sm" showCloseButton={!isLoading}>
      <div className="flex flex-col items-center text-center">
        <div
          className={cn(
            "w-14 h-14 rounded-2xl flex items-center justify-center mb-4",
            isDanger
              ? "bg-rose-50 text-rose-600 border border-rose-100"
              : "bg-amber-50 text-amber-600 border border-amber-100"
          )}
        >
          {isDanger ? (
            <Trash2 className="w-7 h-7" />
          ) : (
            <AlertTriangle className="w-7 h-7" />
          )}
        </div>

        <h3 className="font-display font-bold text-lg text-slate-900 mb-1.5">
          {title}
        </h3>
        <p className="text-sm text-slate-500 mb-6 leading-relaxed">
          {description}
        </p>

        <div className="grid grid-cols-2 gap-3 w-full">
          <button
            type="button"
            disabled={isLoading}
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors focus-ring"
          >
            {cancelText}
          </button>
          <button
            type="button"
            disabled={isLoading}
            onClick={onConfirm}
            className={cn(
              "w-full py-2.5 px-4 rounded-xl text-white font-semibold text-xs transition-all shadow-sm focus-ring flex items-center justify-center gap-2",
              isDanger
                ? "bg-rose-600 hover:bg-rose-700 active:scale-95"
                : "btn-primary active:scale-95",
              isLoading && "opacity-60 cursor-not-allowed"
            )}
          >
            {isLoading ? "Processing..." : confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}
