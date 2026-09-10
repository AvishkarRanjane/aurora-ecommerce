"use client";

import React, { useState, useEffect } from "react";
import { Star, MessageSquare, Check, ShieldCheck } from "lucide-react";
import { getStoredSellerReviews, saveStoredSellerReviews } from "@/lib/mockData";
import { SellerReview } from "@/types/api";
import { useToast } from "@/context/ToastContext";

export default function SellerReviewsPage() {
  const { success } = useToast();
  const [reviews, setReviews] = useState<SellerReview[]>([]);
  const [replyingId, setReplyingId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    setReviews(getStoredSellerReviews());
  }, []);

  const handleSaveReply = (reviewId: string) => {
    if (!replyText.trim()) return;
    const updated = reviews.map((r) => {
      if (r.id === reviewId) {
        return { ...r, reply: replyText };
      }
      return r;
    });

    setReviews(updated);
    saveStoredSellerReviews(updated);
    setReplyingId(null);
    setReplyText("");
    success("Merchant public reply published!");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
          Store Reviews & Reputation
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          Monitor verified buyer feedback, delivery ratings, and publish public studio responses.
        </p>
      </div>

      {/* Ratings Summary Card */}
      <div className="p-8 rounded-[32px] bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/10 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-8">
        <div className="text-center sm:text-left space-y-2">
          <div className="text-4xl sm:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white flex items-center justify-center sm:justify-start gap-2">
            <span>4.9</span>
            <Star className="w-8 h-8 fill-amber-400 text-amber-400 inline-block" />
          </div>
          <p className="text-xs text-neutral-500 font-medium">
            Based on 342 verified buyer purchases
          </p>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 font-semibold text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>98.4% Positive Recommendation Rate</span>
          </div>
        </div>

        {/* Rating Breakdown Bars */}
        <div className="w-full sm:w-72 space-y-2 text-xs">
          {[
            { star: 5, pct: 88 },
            { star: 4, pct: 9 },
            { star: 3, pct: 2 },
            { star: 2, pct: 1 },
            { star: 1, pct: 0 },
          ].map((bar) => (
            <div key={bar.star} className="flex items-center gap-2">
              <span className="w-10 text-neutral-500 font-medium">{bar.star} star</span>
              <div className="flex-1 h-2 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                <div
                  style={{ width: `${bar.pct}%` }}
                  className="h-full bg-amber-400 rounded-full"
                />
              </div>
              <span className="w-8 text-right font-medium text-neutral-400">{bar.pct}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-neutral-900 dark:text-white">
          Verified Buyer Experiences
        </h2>

        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="p-6 rounded-[28px] bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/10 shadow-sm space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-indigo-500/10 text-indigo-600 font-bold text-xs flex items-center justify-center">
                  {rev.customerName[0]}
                </div>
                <span className="text-xs font-semibold text-neutral-900 dark:text-white">
                  {rev.customerName}
                </span>
                <span className="text-[11px] text-neutral-400">• {rev.date}</span>
              </div>

              <div className="flex items-center text-amber-400">
                {Array.from({ length: rev.rating }).map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
            </div>

            <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
              &quot;{rev.comment}&quot;
            </p>

            {/* Merchant Reply Section */}
            {rev.reply ? (
              <div className="mt-3 p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-black/5 dark:border-white/5 space-y-1">
                <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                  Studio Response (Aurelian Prime):
                </span>
                <p className="text-xs text-neutral-600 dark:text-neutral-400">{rev.reply}</p>
              </div>
            ) : replyingId === rev.id ? (
              <div className="mt-3 space-y-2">
                <textarea
                  rows={2}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your public studio response..."
                  className="w-full p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-indigo-500 text-xs focus:outline-none"
                />
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => setReplyingId(null)}
                    className="px-3 py-1.5 rounded-full text-xs text-neutral-500 hover:text-neutral-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSaveReply(rev.id)}
                    className="px-4 py-1.5 rounded-full bg-indigo-600 text-white text-xs font-semibold shadow-xs"
                  >
                    Publish Response
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => {
                  setReplyingId(rev.id);
                  setReplyText("");
                }}
                className="mt-2 inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-indigo-600 transition-colors font-medium"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Reply publicly to buyer</span>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
