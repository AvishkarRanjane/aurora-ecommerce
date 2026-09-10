"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, Clock, ArrowRight, Sparkles } from "lucide-react";

export default function EngineeringJournalPage() {
  const articles = [
    {
      id: 1,
      title: "The Physics of Lossless Acoustics: Eliminating Harmonic Drift in 40mm Transducers",
      category: "Acoustic Science",
      readTime: "6 min read",
      date: "March 8, 2025",
      snippet: "How custom neodymium motor assemblies and laser-welded titanium diaphragms achieve ultra-low harmonic distortion across the full 10Hz–48kHz audible spectrum.",
      imageUrl: "/images/headphones_studio_pro.jpg",
    },
    {
      id: 2,
      title: "Forging Grade 5 Titanium: Micro-Blasting and Thermal Tolerances in Wearable Design",
      category: "Materials Engineering",
      readTime: "8 min read",
      date: "February 24, 2025",
      snippet: "An exhaustive breakdown of the CNC milling and vacuum-annealing processes that give the Aurelian Watch Ultra its exceptional strength-to-weight ratio.",
      imageUrl: "/images/titanium_smartwatch_pulse.jpg",
    },
    {
      id: 3,
      title: "Tandem OLED Display Arrays: Achieving 3,000 Nits Without Phosphor Burn-in",
      category: "Display Architecture",
      readTime: "5 min read",
      date: "February 12, 2025",
      snippet: "Combining dual stacked emission layers to double full-screen luminance while lowering electrical strain on individual subpixels.",
      imageUrl: "/images/creator_monitor_4k.jpg",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-12 py-8">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 tracking-wider uppercase">
          Engineering Journal
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
          Notes on Industrial Precision & Audio Fidelity
        </h1>
        <p className="text-xs text-neutral-500">
          In-depth whitepapers and design retrospectives written directly by Aurelian hardware architects.
        </p>
      </div>

      {/* Featured Articles List */}
      <div className="space-y-8">
        {articles.map((art) => (
          <article
            key={art.id}
            className="p-6 sm:p-8 rounded-[32px] bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/10 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row items-center gap-8 group"
          >
            <div className="w-full md:w-72 h-48 rounded-2xl overflow-hidden relative bg-neutral-100 dark:bg-neutral-800 shrink-0 border border-black/5">
              <Image src={art.imageUrl} alt={art.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>

            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-3 text-xs text-neutral-400">
                <span className="font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider text-[10px]">
                  {art.category}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{art.readTime}</span>
                </span>
                <span>•</span>
                <span>{art.date}</span>
              </div>

              <h2 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                {art.title}
              </h2>

              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {art.snippet}
              </p>

              <div className="pt-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-900 dark:text-white group-hover:translate-x-1 transition-transform">
                  <span>Read Technical Paper</span>
                  <ArrowRight className="w-3.5 h-3.5 text-indigo-500" />
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
