# ✨ Aurora — Apple-Inspired E-Commerce Platform

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-ecommercewebsite--main--seven.vercel.app-0D6E5D?style=for-the-badge)](https://ecommercewebsite-main-seven.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16.3.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-v13-black?style=for-the-badge&logo=framer)](https://www.framer.com/motion/)
[![Vercel](https://img.shields.io/badge/Vercel-Production_Live-000000?style=for-the-badge&logo=vercel)](https://ecommercewebsite-main-seven.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

> **🚀 Live Website**: **[https://ecommercewebsite-main-seven.vercel.app](https://ecommercewebsite-main-seven.vercel.app)**

An enterprise-grade, Amazon/Flipkart-scale e-commerce web platform engineered in an **Apple-inspired visual language** (frosted glassmorphism, continuous squircle curves, WCAG AAA high-contrast typography, and restrained physics-based micro-interactions).

The entire system is **100% client-side functional** with persistent `localStorage` data synchronization, zero external database or backend dependencies, and seamless cross-portal navigation across **Customer**, **Seller**, and **Admin** personas.

---

## 🌟 Core Highlights

- **🔮 Ultra-Liquid Glassmorphism**: Multi-layer frosted glass cards (`backdrop-blur-24px saturate-180%`), specular light-catching top bevels, and subtle ambient pastel mesh glow canvas.
- **🧭 Floating Frosted Glass Pill Navbar**: Responsive pill navbar across all 46 pages with dynamic elevation on scroll and dedicated portal variations.
- **🇮🇳 100% Indian Rupee (`₹` INR) Pricing**: All 12 hardware items, cart totals, GST breakdowns, No-Cost EMI calculators, seller ledgers, and platform sales formatted in realistic INR (`en-IN`).
- **🗂️ 4-Column Product Grid**: "The Lineup" displays 4 products per row on desktop with responsive squircle image stages and quick-add actions.
- **🔑 1-Click Role Switcher**: Instant switching between **Buyer Store**, **Seller Portal**, and **Admin Console** on the `/auth` page or via the floating bottom-right portal pill.
- **♿ WCAG AAA Contrast**: Deep `#111827` typography against calm glass surfaces ensuring crystal-clear readability.

---

## 🧭 Multi-Portal Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│ 🛍️ Buyer Store    │    📦 Seller Central    │    ⚡ Admin Console     │
└────────────────────────────────────────────────────────────────────────┘
```

### 1. 🛍️ Customer (Buyer Store) — 30+ Pages
- **Homepage (`/`)**: Hero showcase tray, flash drop countdown clock, category chips, 4-column product grid, and acoustic benchmark story banner.
- **Catalog & Search (`/catalog`)**: Multi-facet filter sidebar, price range slider (`₹4,999`–`₹2,50,000`), in-stock toggles, and instant search overlay.
- **Product Detail Page - PDP (`/product/[id]`)**:
  - 1-Click Buy Now (direct to checkout).
  - Interactive Size & Dimensions modal (mm/inches).
  - Dynamic No-Cost EMI tenure selector (3, 6, 9, 12 months).
  - Postal code / delivery estimator with ETA calculations.
  - Verified buyer ratings breakdown and "Write Review" modal.
- **Cart & Drawer (`/cart`)**: Sliding glass bag drawer, free shipping threshold meter, and promo voucher clip engine (`APPLE10`, `PRO20`, `FREESHIP`).
- **3-Step Checkout (`/checkout`)**: Shipping address selection, payment methods (Credit/Debit, UPI, Apple Pay, EMI, COD), luxury gift wrap (`+₹499`), and instant order confirmation.
- **Order Confirmation & Tracking (`/orders/[id]/track`)**: Confetti celebrations, 5-stage transit timeline, GPS driver status, and instant order cancellation with refund processing.
- **My Account Hub (`/profile`)**: Order history, saved address book, payment methods, password management, and notification settings.
- **Extended Buyer Features**: Flash Drops (`/deals`), Brand Directory (`/brands`), Digital Gift Cards (`/gift-cards`), Aurelian Club Loyalty (`/loyalty`), $50 Referral Program (`/referral`), Flagship Store Locator (`/stores`), Engineering Journal (`/blog`), and Help & FAQ (`/help`).

### 2. 📦 Seller Central
- **Become a Seller (`/seller`)**: Merchant introduction, GMV velocity metrics, onboarding milestones, and seller FAQ.
- **Seller Command Center (`/seller/dashboard`)**: Net revenue charts, packing queue, stock warning alerts, and glassmorphic KPI cards.
- **Inventory Management (`/seller/inventory`)**: SKU management table, search, category filters, and quick inline stock/price editor.
- **Product Listing Engine (`/seller/products/new`)**: Hardware listing generator with image presets, technical spec builders, and live preview.
- **Order Fulfillment (`/seller/orders`)**: Live order processing, airbill generation, package dispatch, and tracking status updates.
- **Earnings & Payouts Ledger (`/seller/earnings`)**: Financial ledger, available balance, instant bank transfer disbursement, and remittance download.
- **Public Storefront (`/seller/store/[sellerId]`)**: Verified merchant showcase with ultra-glass store rating and lineup grid.

### 3. ⚡ Admin Console
- **Superuser Dashboard (`/admin/dashboard`)**: Platform sales metrics, active seller approval queue, and system audit log.
- **User Directory (`/admin/users`)**: User directory, role switcher (Customer / Seller / Admin), and account suspension/reactivation.
- **Seller Management (`/admin/sellers`)**: Merchant verification queue, approve / decline actions, and store inspection.
- **Global Inventory (`/admin/inventory`)**: Multi-seller catalog inspection, keynote hero feature toggling, and product deletion.
- **Order Management (`/admin/orders`)**: Platform-wide orders overview, payment status, and order details modal.
- **Promotions & CMS (`/admin/content`)**: Keynote homepage hero banner editor, seasonal flash sale banners, and coupon generator.
- **Reports & Analytics (`/admin/analytics`)**: Financial breakdown, category profit margins, regional delivery volume, and CSV export.
- **Site Governance (`/admin/settings`)**: Platform fee percentage, free shipping threshold, tax rate, and return window.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | Next.js 16.3.2 (App Router, Turbopack) |
| **UI Library** | React 19.2 |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS v4, Custom CSS Design Tokens |
| **Animations** | Framer Motion 13 |
| **Icons** | Lucide React |
| **Effects** | Canvas Confetti |
| **State & Storage**| React Context + Persistent `localStorage` Mock Engine |
| **Deployment** | Vercel Global Edge Network |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18.17+ or later
- npm or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/AvishkarRanjane/aurora-ecommerce.git
   cd aurora-ecommerce
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm run start
```

---

## 📁 Project Structure

```
aurora-ecommerce/
├── public/                # Static assets, SVG icons, product images
├── src/
│   ├── app/               # Next.js App Router (46 pages & routes)
│   │   ├── admin/         # Admin Console routes
│   │   ├── seller/        # Seller Central routes
│   │   ├── product/[id]/  # Instant Product Detail Page
│   │   ├── cart/          # Cart page
│   │   ├── checkout/      # 3-step checkout
│   │   ├── auth/          # Customer/Seller/Admin quick login
│   │   └── ...            # 40+ customer portal pages
│   ├── components/
│   │   ├── layout/        # Navbar, AdminNav, SellerNav, Footer, PortalBanner
│   │   ├── product/       # ProductCard (4-column responsive grid)
│   │   ├── cart/          # CartDrawer slide-over
│   │   ├── search/        # SearchOverlay modal
│   │   └── ui/            # Modal, StatusBadge, ConfirmDialog
│   ├── context/           # Auth, Cart, Wishlist, Toast, Search contexts
│   ├── lib/               # Mock dataset (INR products, orders, sellers), utils
│   └── types/             # TypeScript API interfaces
├── next.config.ts         # Next.js configuration (devIndicators disabled)
├── tsconfig.json          # TypeScript configuration
└── package.json           # Project manifest
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
