"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Star,
  ShoppingBag,
  Zap,
  Truck,
  ShieldCheck,
  RotateCcw,
  Minus,
  Plus,
  ArrowLeft,
  ChevronRight,
  Check,
  CheckCircle2,
  Heart,
  Share2,
  ArrowRight,
  GitCompare,
  Ruler,
  MapPin,
  CreditCard,
  PenSquare
} from "lucide-react";
import { productApi } from "@/lib/api";
import { ProductResponse } from "@/types/api";
import { ProductDetailData } from "@/lib/mockData";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useToast } from "@/context/ToastContext";
import ProductCard from "@/components/product/ProductCard";
import { Modal } from "@/components/ui/Modal";
import { formatPrice } from "@/lib/utils";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { addItem, openDrawer } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { success, info } = useToast();

  const [product, setProduct] = useState<ProductDetailData | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<ProductResponse[]>([]);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"overview" | "specs" | "box" | "reviews">("overview");
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  // Modals & Widgets
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [emiModalOpen, setEmiModalOpen] = useState(false);
  const [writeReviewOpen, setWriteReviewOpen] = useState(false);

  // Pincode check
  const [pincode, setPincode] = useState("95014");
  const [deliveryEstimate, setDeliveryEstimate] = useState<string | null>("Free Delivery by Tomorrow, 2 PM");

  // Review Form
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewAuthor, setReviewAuthor] = useState("");
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewComment, setReviewComment] = useState("");

  useEffect(() => {
    async function loadProduct() {
      setIsLoading(true);
      try {
        const prod = await productApi.getById(Number(resolvedParams.id));
        setProduct(prod);
        if (prod.colors && prod.colors.length > 0) {
          setSelectedColor(prod.colors[0].name);
        }

        const related = await productApi.getAll({
          category_id: prod.category_id,
          limit: 4,
        });
        setRelatedProducts(
          (related.products || []).filter((p) => p.id !== prod.id)
        );
      } catch (err) {
        console.error("Error loading product:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadProduct();
  }, [resolvedParams.id]);

  if (isLoading) {
    return (
      <div className="py-24 text-center space-y-4">
        <div className="w-8 h-8 border-2 border-[#0071E3] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-[#6E6E73]">Loading hardware specifications...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-24 text-center space-y-4 max-w-md mx-auto">
        <h2 className="text-xl font-semibold text-[#1D1D1F]">Product Not Found</h2>
        <p className="text-xs text-[#6E6E73]">
          The hardware piece you requested might have been relocated or updated.
        </p>
        <Link
          href="/catalog"
          className="inline-flex items-center gap-2 h-10 px-5 rounded-[14px] bg-[#0071E3] text-white text-xs font-semibold"
        >
          Return to Catalogue
        </Link>
      </div>
    );
  }

  const isSaved = isInWishlist(product.id);

  const handleAdd = () => {
    if (isAdding) return;
    setIsAdding(true);
    addItem(product, quantity);
    setIsAdding(false);
    setJustAdded(true);
    success(`Added ${product.name} to your bag!`);
    setTimeout(() => setJustAdded(false), 1600);
  };

  const handleBuyNow = () => {
    addItem(product, quantity);
    router.push("/checkout");
  };

  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.trim().length >= 5) {
      setDeliveryEstimate(`Express Worldwide Delivery available to ${pincode} by Tomorrow, 2:00 PM`);
      success(`Delivery confirmed for ZIP/Pincode ${pincode}`);
    } else {
      setDeliveryEstimate("Please enter a valid 5 or 6-digit postal code.");
    }
  };

  const handlePostReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewAuthor.trim() || !reviewComment.trim()) return;

    const newRev = {
      id: `rev_${Date.now()}`,
      author: reviewAuthor,
      rating: reviewRating,
      date: "Just now",
      title: reviewTitle || "Pure engineering excellence",
      comment: reviewComment,
      verified: true,
    };

    if (product) {
      const updatedList = [newRev, ...(product.reviewsList || [])];
      setProduct({
        ...product,
        reviewsList: updatedList,
        review_count: (product.review_count || 1) + 1,
      });
    }

    setWriteReviewOpen(false);
    setReviewAuthor("");
    setReviewTitle("");
    setReviewComment("");
    success("Thank you! Your verified hardware review has been published.");
    setActiveTab("reviews");
  };

  const monthlyEMI = Math.round((product.price / 12) * 100) / 100;

  return (
    <div className="space-y-14 py-4">
      {/* Breadcrumbs & Actions */}
      <div className="flex items-center justify-between">
        <nav className="flex items-center gap-2 text-xs text-[#6E6E73]">
          <Link href="/" className="hover:text-[#1D1D1F] transition-colors">
            Store
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/catalog" className="hover:text-[#1D1D1F] transition-colors">
            Hardware
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#1D1D1F] font-semibold truncate max-w-xs">
            {product.name}
          </span>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/compare"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-300 px-3 py-1.5 rounded-full border border-black/10 dark:border-white/10 hover:bg-black/5 transition-all"
          >
            <GitCompare className="w-3.5 h-3.5 text-indigo-500" />
            <span>Compare Specs</span>
          </Link>

          <button
            onClick={() => setSizeGuideOpen(true)}
            className="hidden sm:inline-flex items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-300 px-3 py-1.5 rounded-full border border-black/10 dark:border-white/10 hover:bg-black/5 transition-all"
          >
            <Ruler className="w-3.5 h-3.5 text-indigo-500" />
            <span>Size & Fit Guide</span>
          </button>
        </div>
      </div>

      {/* Main Product Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* Left Gallery Stage */}
        <div className="lg:col-span-7 space-y-4 sticky top-24">
          <div className="relative aspect-square sm:aspect-[4/3] rounded-[32px] bg-gradient-to-tr from-neutral-100 via-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800 p-8 sm:p-12 flex items-center justify-center overflow-hidden border border-black/[0.06] shadow-[0_16px_48px_rgba(0,0,0,0.04)]">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover object-center rounded-[20px]"
              />
            ) : (
              <ShoppingBag className="w-16 h-16 text-neutral-300" />
            )}

            {product.badge && (
              <div className="absolute top-6 left-6 px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-black/80 backdrop-blur-md border border-black/5 text-[11px] font-semibold uppercase tracking-wider text-[#1D1D1F] dark:text-white">
                {product.badge}
              </div>
            )}
          </div>
        </div>

        {/* Right Purchasing & Config Module */}
        <div className="lg:col-span-5 space-y-6">
          {/* Header & Title */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#0071E3] uppercase tracking-wider">
                {product.category_name}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleWishlist(product)}
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                    isSaved
                      ? "bg-[#E8635A]/15 text-[#E8635A]"
                      : "bg-black/5 text-[#6E6E73] hover:text-[#1D1D1F]"
                  }`}
                  aria-label="Save to wishlist"
                >
                  <Heart className={`w-4 h-4 ${isSaved ? "fill-[#E8635A]" : "stroke-[1.8]"}`} />
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    info("Product link copied to clipboard");
                  }}
                  className="w-9 h-9 rounded-full bg-black/5 text-[#6E6E73] hover:text-[#1D1D1F] flex items-center justify-center transition-all"
                >
                  <Share2 className="w-4 h-4 stroke-[1.8]" />
                </button>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-semibold tracking-[-0.025em] text-[#1D1D1F] dark:text-white leading-tight">
              {product.name}
            </h1>

            {/* Reviews Summary */}
            <div className="flex items-center gap-2 text-xs text-[#6E6E73]">
              <div className="flex items-center text-[#C8863E]">
                <Star className="w-3.5 h-3.5 fill-[#C8863E] stroke-none" />
              </div>
              <span className="font-semibold text-[#1D1D1F] dark:text-white">
                {product.rating?.toFixed(1) || "4.9"}
              </span>
              <span>•</span>
              <span className="underline cursor-pointer" onClick={() => setActiveTab("reviews")}>
                {product.review_count || 128} customer reviews
              </span>
              <span>•</span>
              <button
                onClick={() => setWriteReviewOpen(true)}
                className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
              >
                Write Review
              </button>
            </div>
          </div>

          {/* Pricing & EMI Callout */}
          <div className="p-4 rounded-[20px] bg-white/70 dark:bg-neutral-800/70 backdrop-blur-md border border-black/5 dark:border-white/5 space-y-2">
            <div className="flex items-baseline justify-between">
              <div className="flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-bold text-[#1D1D1F] dark:text-white tabular-nums">
                  {formatPrice(product.price)}
                </span>
                {product.original_price && product.original_price > product.price && (
                  <span className="text-sm text-[#6E6E73] line-through tabular-nums">
                    {formatPrice(product.original_price)}
                  </span>
                )}
              </div>
              {product.original_price && product.original_price > product.price && (
                <span className="text-xs font-semibold text-[#0D6E5D] bg-[#0D6E5D]/10 px-2.5 py-1 rounded-full">
                  Save {formatPrice(product.original_price - product.price)}
                </span>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-neutral-500 pt-1 border-t border-black/5 dark:border-white/5">
              <span>Or <strong>{formatPrice(Math.round(product.price / 12))}/mo</strong> for 12 mos with No-Cost EMI</span>
              <button
                onClick={() => setEmiModalOpen(true)}
                className="text-[#0D6E5D] dark:text-emerald-400 font-semibold hover:underline"
              >
                EMI Options
              </button>
            </div>
          </div>

          {/* Delivery & Pincode Checker */}
          <div className="p-4 rounded-[20px] bg-neutral-50 dark:bg-neutral-850/50 border border-black/5 dark:border-white/5 space-y-2 text-xs">
            <span className="font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-indigo-500" />
              <span>Check Delivery Pincode Availability</span>
            </span>

            <form onSubmit={handleCheckPincode} className="flex gap-2">
              <input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="Enter ZIP / Pincode"
                className="flex-1 h-8 px-3 rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs focus:outline-none"
              />
              <button
                type="submit"
                className="px-3 h-8 rounded-lg bg-neutral-900 text-white font-semibold text-xs hover:bg-neutral-800 transition-colors"
              >
                Check
              </button>
            </form>

            {deliveryEstimate && (
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1 pt-0.5">
                <Check className="w-3 h-3" />
                <span>{deliveryEstimate}</span>
              </p>
            )}
          </div>

          {/* Color / Finish Selector */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-[#1D1D1F] dark:text-white">Finish</span>
                <span className="text-[#6E6E73]">{selectedColor}</span>
              </div>
              <div className="flex items-center gap-3">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c.name)}
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                      selectedColor === c.name
                        ? "ring-2 ring-offset-2 ring-[#0071E3] scale-105"
                        : "opacity-75 hover:opacity-100"
                    }`}
                    title={c.name}
                  >
                    <span
                      className="w-7 h-7 rounded-full border border-black/10 shadow-inner block"
                      style={{ backgroundColor: c.hex }}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stepper, Add to Bag & Buy Now */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              <div className="flex items-center rounded-[14px] bg-neutral-100 dark:bg-neutral-800 border border-black/5 overflow-hidden h-12">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-full flex items-center justify-center text-neutral-600 hover:text-black hover:bg-neutral-200 transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-10 text-center text-xs font-semibold text-[#1D1D1F] dark:text-white">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-full flex items-center justify-center text-neutral-600 hover:text-black hover:bg-neutral-200 transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={handleAdd}
                disabled={isAdding}
                className={`flex-1 h-12 rounded-full text-xs font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
                  justAdded
                    ? "bg-[#2FA84F] text-white"
                    : "bg-[#0D6E5D] hover:bg-[#0A5649] text-white shadow-md hover:shadow-lg"
                }`}
              >
                {justAdded ? (
                  <>
                    <Check className="w-4 h-4 stroke-[2.2]" />
                    <span>Added to Bag</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 stroke-[1.8]" />
                    <span>Add to Bag • {formatPrice(product.price * quantity)}</span>
                  </>
                )}
              </button>
            </div>

            <button
              onClick={handleBuyNow}
              className="w-full h-11 rounded-[16px] bg-black/[0.06] dark:bg-white/10 hover:bg-black/[0.1] text-[#1D1D1F] dark:text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.97]"
            >
              <span>Buy Now with 1-Click</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Value Props Row */}
          <div className="pt-4 border-t border-black/5 dark:border-white/5 space-y-2.5 text-xs text-[#6E6E73]">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#0071E3]" />
              <span>Complimentary Worldwide Express shipping on this product</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#0071E3]" />
              <span>2-Year AurelianCare hardware replacement warranty</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-[#0071E3]" />
              <span>30-Day Hassle-free return policy</span>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications & Content Tabs Section */}
      <section className="space-y-6 pt-10 border-t border-black/5 dark:border-white/5">
        <div className="flex items-center gap-2 border-b border-black/5 dark:border-white/5 pb-2 overflow-x-auto scrollbar-none">
          {[
            { id: "overview", label: "Overview & Highlights" },
            { id: "specs", label: "Technical Specifications" },
            { id: "box", label: "In the Box" },
            { id: "reviews", label: `Reviews (${product.review_count || 128})` },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`h-9 px-4 rounded-[14px] text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === t.id
                  ? "bg-[#1D1D1F] text-white shadow-xs"
                  : "text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-black/5"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="p-6 sm:p-8 rounded-[28px] bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/10 shadow-sm">
          {activeTab === "overview" && (
            <div className="space-y-6 max-w-3xl">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-[#1D1D1F] dark:text-white">
                  Designed for Absolute Purity
                </h3>
                <p className="text-xs sm:text-sm text-[#6E6E73] leading-relaxed">
                  {product.details || product.description}
                </p>
              </div>

              {product.highlights && (
                <div className="space-y-2.5 pt-2">
                  <h4 className="text-xs font-bold text-[#1D1D1F] dark:text-white uppercase tracking-wider">
                    Key Highlights
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {product.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-[#1D1D1F] dark:text-neutral-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#0071E3] shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {activeTab === "specs" && (
            <div className="max-w-2xl divide-y divide-black/5 dark:divide-white/5">
              {product.specs ? (
                Object.entries(product.specs).map(([k, v]) => (
                  <div key={k} className="py-3 flex justify-between text-xs">
                    <span className="font-medium text-[#6E6E73]">{k}</span>
                    <span className="font-semibold text-[#1D1D1F] dark:text-white text-right">{v}</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-[#6E6E73]">Standard Aurelian engineering specifications apply.</p>
              )}
            </div>
          )}

          {activeTab === "box" && (
            <div className="space-y-4 max-w-md">
              <h4 className="text-xs font-bold text-[#1D1D1F] dark:text-white uppercase tracking-wider">
                Included with your order
              </h4>
              <ul className="space-y-2.5">
                {(product.inTheBox || [
                  `${product.name}`,
                  "Braided USB-C Power/Data Cable (1m)",
                  "Documentation & Warranty Certificate",
                ]).map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2.5 text-xs text-[#1D1D1F] dark:text-neutral-200">
                    <div className="w-5 h-5 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-[#0071E3] shrink-0">
                      <Check className="w-3 h-3" />
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-6 max-w-3xl">
              <div className="flex items-center justify-between pb-4 border-b border-black/5 dark:border-white/5">
                <div>
                  <div className="text-2xl font-bold text-[#1D1D1F] dark:text-white">
                    {product.rating?.toFixed(1) || "4.9"} / 5.0
                  </div>
                  <p className="text-xs text-[#6E6E73]">
                    Based on {product.review_count || 128} verified purchases
                  </p>
                </div>

                <button
                  onClick={() => setWriteReviewOpen(true)}
                  className="px-4 py-2 rounded-full bg-indigo-600 text-white font-semibold text-xs shadow-xs hover:bg-indigo-500 transition-colors flex items-center gap-1.5"
                >
                  <PenSquare className="w-3.5 h-3.5" />
                  <span>Write a Review</span>
                </button>
              </div>

              <div className="space-y-4">
                {(product.reviewsList || [
                  {
                    id: "1",
                    author: "David S.",
                    rating: 5,
                    date: "3 days ago",
                    title: "Exceeded all expectations",
                    comment: "The build precision and tactile response are exceptional. Works seamlessly out of the box.",
                    verified: true,
                  },
                  {
                    id: "2",
                    author: "Sarah K.",
                    rating: 5,
                    date: "1 week ago",
                    title: "Worth every penny",
                    comment: "Comfortable, responsive, and gorgeous industrial design.",
                    verified: true,
                  },
                ]).map((rev) => (
                  <div key={rev.id} className="p-4 rounded-[18px] bg-neutral-50 dark:bg-neutral-800/50 border border-black/5 dark:border-white/5 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#1D1D1F] dark:text-white">{rev.author}</span>
                      <span className="text-[#6E6E73]">{rev.date}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[#C8863E]">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-[#C8863E] stroke-none" />
                      ))}
                    </div>
                    <h5 className="text-xs font-semibold text-[#1D1D1F] dark:text-white">{rev.title}</h5>
                    <p className="text-xs text-[#6E6E73] dark:text-neutral-300">{rev.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Similar Products Row */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
              Similar Hardware in this Category
            </h2>
            <Link href="/catalog" className="text-xs font-semibold text-[#0071E3] hover:underline">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.slice(0, 3).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Size & Fit Guide Modal */}
      <Modal
        isOpen={sizeGuideOpen}
        onClose={() => setSizeGuideOpen(false)}
        title="Hardware Fit & Ergonomic Sizing Guide"
        description="Specifications on ear cushion diameter, watch wrist circumference, and display viewing distance."
        maxWidth="md"
      >
        <div className="space-y-4 pt-2 text-xs">
          <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800 space-y-2">
            <h4 className="font-bold text-neutral-900 dark:text-white">Ear Cushion & Headband Dimensions</h4>
            <p className="text-neutral-600 dark:text-neutral-300">
              Ear cup interior: 65mm height × 45mm width. Deep memory foam accommodates glasses and ear piercings without acoustic leakage.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800 space-y-2">
            <h4 className="font-bold text-neutral-900 dark:text-white">Watch Band Circumference</h4>
            <p className="text-neutral-600 dark:text-neutral-300">
              Fits wrist circumferences from 130mm to 210mm. Pin-and-tuck buckle ensures continuous skin contact for precision SpO2 and ECG readings.
            </p>
          </div>
        </div>
      </Modal>

      {/* EMI Calculator Modal */}
      <Modal
        isOpen={emiModalOpen}
        onClose={() => setEmiModalOpen(false)}
        title="0% Interest Studio Financing (EMI)"
        description="Spread your hardware purchase across flexible monthly tenures."
        maxWidth="md"
      >
        <div className="space-y-4 pt-2 text-xs">
          {[
            { mos: 3, monthly: Math.round((product.price / 3) * 100) / 100, interest: "0% APR" },
            { mos: 6, monthly: Math.round((product.price / 6) * 100) / 100, interest: "0% APR" },
            { mos: 12, monthly: monthlyEMI, interest: "0% APR (Most Popular)" },
            { mos: 24, monthly: Math.round((product.price / 24) * 100) / 100, interest: "4.9% APR" },
          ].map((plan) => (
            <div
              key={plan.mos}
              className="p-4 rounded-2xl border border-black/10 dark:border-white/10 flex items-center justify-between hover:border-indigo-500 transition-colors"
            >
              <div>
                <span className="font-bold text-sm text-neutral-900 dark:text-white">
                  ${plan.monthly}/month
                </span>
                <span className="text-[11px] text-neutral-500 block">
                  {plan.mos} monthly installments
                </span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 font-bold text-[10px]">
                {plan.interest}
              </span>
            </div>
          ))}
        </div>
      </Modal>

      {/* Write a Review Modal */}
      <Modal
        isOpen={writeReviewOpen}
        onClose={() => setWriteReviewOpen(false)}
        title={`Write a Review for ${product.name}`}
        description="Share your impressions on acoustic dynamics, industrial finish, and everyday ergonomics."
        maxWidth="md"
      >
        <form onSubmit={handlePostReview} className="space-y-4 pt-2 text-xs">
          <div>
            <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Overall Rating
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => setReviewRating(s)}
                  className="p-1 text-amber-400 hover:scale-110 transition-transform"
                >
                  <Star className={`w-5 h-5 ${s <= reviewRating ? "fill-current" : ""}`} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Your Name *
            </label>
            <input
              type="text"
              required
              placeholder="Marcus V."
              value={reviewAuthor}
              onChange={(e) => setReviewAuthor(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Review Headline
            </label>
            <input
              type="text"
              placeholder="Pure acoustic benchmark..."
              value={reviewTitle}
              onChange={(e) => setReviewTitle(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Your Review & Thoughts *
            </label>
            <textarea
              rows={3}
              required
              placeholder="Detail your experience with build quality, battery, and fidelity..."
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              className="w-full p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md transition-colors"
          >
            Publish Verified Review
          </button>
        </form>
      </Modal>
    </div>
  );
}
