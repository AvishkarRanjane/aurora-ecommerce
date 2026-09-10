import type { Metadata } from "next";
import Script from "next/script";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/context/ToastContext";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { SearchProvider } from "@/context/SearchContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import PortalBanner from "@/components/layout/PortalBanner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aurora — Pure Fidelity Hardware & Lifestyle",
  description: "Designed to feel as good as it looks. Luxury acoustics, titanium wearables, and pro workstations.",
  keywords: ["aurora", "hardware", "audio", "titanium", "smartwatch", "workstation", "display"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="bg-[#FAFBF9] text-[#111827] min-h-screen flex flex-col antialiased selection:bg-emerald-500/20 selection:text-emerald-800" suppressHydrationWarning>
        <Script
          id="clean-extension-attrs"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var observer = new MutationObserver(function(mutations) {
                  for (var i = 0; i < mutations.length; i++) {
                    var m = mutations[i];
                    if (m.type === 'attributes' && m.attributeName === 'fdprocessedid') {
                      m.target.removeAttribute('fdprocessedid');
                    }
                  }
                });
                observer.observe(document.documentElement, {
                  attributes: true,
                  subtree: true,
                  attributeFilter: ['fdprocessedid']
                });
                window.addEventListener('DOMContentLoaded', function() {
                  var els = document.querySelectorAll('[fdprocessedid]');
                  for (var j = 0; j < els.length; j++) {
                    els[j].removeAttribute('fdprocessedid');
                  }
                  setTimeout(function() { observer.disconnect(); }, 4000);
                });
              } catch (e) {}
            `,
          }}
        />
        <ToastProvider>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                <SearchProvider>
                  <Navbar />
                  <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 pt-24 sm:pt-28 pb-12">
                    {children}
                  </main>
                  <CartDrawer />
                  <PortalBanner />
                  <Footer />
                </SearchProvider>
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
