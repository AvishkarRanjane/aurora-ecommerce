"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/auth?mode=login");
  }, [router]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-3">
        <div className="w-8 h-8 border-2 border-[#FB641B] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-neutral-500 font-medium">Redirecting to Customer Sign In...</p>
      </div>
    </div>
  );
}
