"use client";

import React from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      {/* Screen Content */}
      <div className="relative">{children}</div>
    </div>
  );
}

