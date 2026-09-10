import {
  ProductResponse,
  CategoryResponse,
  UserResponse,
  OrderResponse,
  ClientCartItem,
  SellerProfile,
  SellerReview,
  SellerPayout,
  AdminUserRecord,
  AdminCMSBanner,
  AdminSiteSettings,
  ReturnItem,
  LoyaltyAccount
} from "@/types/api";

export interface MockReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
}

export interface ProductDetailData extends ProductResponse {
  colors?: { name: string; hex: string; bgClass: string }[];
  specs?: Record<string, string>;
  highlights?: string[];
  inTheBox?: string[];
  reviewsList?: MockReview[];
}

export const INITIAL_CATEGORIES: CategoryResponse[] = [
  { id: 1, name: "Audio & Acoustics", slug: "audio" },
  { id: 2, name: "Wearables & Watch", slug: "wearables" },
  { id: 3, name: "Computing & Displays", slug: "computing" },
  { id: 4, name: "Smartphones & Tablets", slug: "mobile" },
  { id: 5, name: "MagCharge & Accessories", slug: "accessories" },
];

export const INITIAL_PRODUCTS: ProductDetailData[] = [
  {
    id: 1,
    name: "Aurora Studio Max",
    slug: "aurora-studio-max",
    description: "Lossless acoustic architecture with electro-acoustic transducers and adaptive spatial audio.",
    details: "Crafted from custom aerospace titanium and anodized aluminum ear cups. Features 40mm neodymium dynamic drivers engineered for ultra-low harmonic distortion across the entire audible spectrum. Pure active noise cancellation blocks external ambient noise with sub-millisecond precision.",
    price: 49999,
    original_price: 54999,
    category_id: 1,
    category_name: "Audio & Acoustics",
    image_url: "/images/headphones_studio_pro.jpg",
    rating: 4.9,
    review_count: 248,
    stock: 18,
    is_featured: true,
    badge: "Flagship",
    colors: [
      { name: "Space Black", hex: "#1C1C1E", bgClass: "bg-neutral-900" },
      { name: "Titanium Silver", hex: "#D4D4D8", bgClass: "bg-zinc-300" },
      { name: "Midnight Navy", hex: "#1E293B", bgClass: "bg-slate-800" },
    ],
    highlights: [
      "Custom 40mm low-distortion dynamic drivers",
      "Adaptive Spatial Audio with dynamic head tracking",
      "Active Noise Cancellation with Transparency Mode",
      "Up to 32 hours playback on a single charge",
      "Lossless USB-C audio with integrated 24-bit/96kHz DAC"
    ],
    specs: {
      "Acoustic Architecture": "Custom 40mm Neodymium drivers",
      "Battery Life": "32 Hours with ANC active",
      "Connectivity": "Bluetooth 5.4, USB-C Lossless, 3.5mm analog",
      "Weight": "384 grams",
      "Materials": "Titanium headband, memory foam knit mesh, aluminum cups"
    },
    inTheBox: [
      "Aurora Studio Max Headphones",
      "Braided USB-C to USB-C Cable (1.2m)",
      "Magnetic Smart Travel Case",
      "Quick Start & Care Guide"
    ],
    reviewsList: [
      {
        id: "r1",
        author: "Marcus Vance",
        rating: 5,
        date: "2 days ago",
        title: "The acoustic benchmark of the decade",
        comment: "The precision across low-end separation and high frequency air is unmatched. The titanium chassis feels exceptionally balanced on the head even during 8-hour mixing sessions.",
        verified: true
      },
      {
        id: "r2",
        author: "Elena Rostova",
        rating: 5,
        date: "1 week ago",
        title: "Transparency mode sounds like real life",
        comment: "Forget other ANC headphones. When Transparency is on, it feels like nothing is covering your ears. Build quality is pure jewelry.",
        verified: true
      }
    ]
  },
  {
    id: 2,
    name: "Aurora Pods Pro",
    slug: "aurora-pods-pro",
    description: "Compact wireless sound with custom high-excursion driver and pressure-vented silicone tips.",
    details: "Engineered with our proprietary H2 acoustic chip. Next-generation Voice Isolation algorithms filter out wind and background clatter during calls. MagCharge wireless case delivers up to 36 hours total listening.",
    price: 24999,
    original_price: 27999,
    category_id: 1,
    category_name: "Audio & Acoustics",
    image_url: "/images/earbuds_wireless_pods.jpg",
    rating: 4.8,
    review_count: 512,
    stock: 42,
    is_featured: true,
    badge: "Bestseller",
    colors: [
      { name: "Pure White", hex: "#FFFFFF", bgClass: "bg-white" },
      { name: "Matte Black", hex: "#171717", bgClass: "bg-neutral-900" },
    ],
    highlights: [
      "Custom high-excursion driver & low-distortion amplifier",
      "2x improved Active Noise Cancellation",
      "IP54 dust, sweat, and water resistance",
      "Touch sensor controls with volume swipe"
    ],
    specs: {
      "Chip": "Aurora H2 Audio Processing Engine",
      "Battery": "6 hours bud / 36 hours with MagCharge case",
      "Water Resistance": "IP54 rated",
      "Microphones": "Dual beamforming microphones + inward mic"
    },
    inTheBox: [
      "Aurora Pods Pro Earbuds",
      "MagCharge USB-C Charging Case",
      "4 Sizes of Silicone Ear Tips (XS, S, M, L)",
      "Braided Charging Cable"
    ]
  },
  {
    id: 3,
    name: "Aurora Watch Ultra",
    slug: "aurora-watch-ultra",
    description: "49mm Grade 5 titanium case, dual-frequency precision GPS, and 100m depth resistance.",
    details: "Designed for endurance athletes, oceanic exploration, and daily executive life. Sapphire crystal screen produces 3,000 nits peak brightness for crystal visibility under direct midday sun. Multi-day 72-hour battery life with power-saving mode.",
    price: 79999,
    original_price: 84999,
    category_id: 2,
    category_name: "Wearables & Watch",
    image_url: "/images/titanium_smartwatch_pulse.jpg",
    rating: 4.9,
    review_count: 184,
    stock: 14,
    is_featured: true,
    badge: "Titanium",
    colors: [
      { name: "Natural Titanium", hex: "#D4D4D8", bgClass: "bg-zinc-300" },
      { name: "Black Titanium", hex: "#27272A", bgClass: "bg-zinc-800" },
    ],
    highlights: [
      "Aerospace Grade 5 Titanium 49mm chassis",
      "Always-On Retina OLED display reaching 3,000 nits",
      "Precision dual-frequency GPS (L1 and L5)",
      "Up to 72 hours battery life in low power mode",
      "EN13319 certified dive computer with depth gauge"
    ],
    specs: {
      "Case Size": "49mm x 44mm x 14.4mm",
      "Water Resistance": "100m / Dive certified to 40m",
      "Display": "Sapphire crystal OLED, 410 x 502 pixels",
      "Sensors": "ECG, SpO2, Skin Temperature, Depth, Compass"
    },
    inTheBox: [
      "Aurora Watch Ultra 49mm",
      "Titanium Milanese or Ocean Band",
      "Fast Magnetic Fast-Charge Puck (1m)"
    ]
  },
  {
    id: 4,
    name: "Aurora Band Pro",
    slug: "aurora-band-pro",
    description: "Breathable fluorocarbon elastomer with custom titanium pin-and-tuck buckle.",
    details: "Molded from silky-smooth, high-performance fluoroelastomer that resists sweat, chlorine, and ultraviolet rays. Lightweight continuous curve design wraps effortlessly around the wrist.",
    price: 4999,
    original_price: 6999,
    category_id: 2,
    category_name: "Wearables & Watch",
    image_url: "/images/magnetic_power_bank.jpg",
    rating: 4.7,
    review_count: 94,
    stock: 35,
    is_featured: false,
    badge: "Popular",
    colors: [
      { name: "Chalk White", hex: "#F4F4F5", bgClass: "bg-zinc-100" },
      { name: "International Orange", hex: "#F97316", bgClass: "bg-orange-500" },
      { name: "Deep Olive", hex: "#3F6212", bgClass: "bg-lime-900" },
    ]
  },
  {
    id: 5,
    name: "Aurora Book Pro 16\"",
    slug: "aurora-book-pro-16",
    description: "Liquid Retina XDR 120Hz ProMotion, 16-Core Neural Silicon, and 24 hours of all-day battery.",
    details: "The most capable pro workstation ever designed. Featuring our custom M-series equivalent neural architecture with unified memory bandwidth of up to 400 GB/s. Drives up to four 6K external displays without dropping a frame.",
    price: 249999,
    original_price: 269999,
    category_id: 3,
    category_name: "Computing & Displays",
    image_url: "/images/carbon_laptop_zenith.jpg",
    rating: 5.0,
    review_count: 128,
    stock: 9,
    is_featured: true,
    badge: "Pro Workstation",
    colors: [
      { name: "Space Black", hex: "#18181B", bgClass: "bg-zinc-900" },
      { name: "Silver", hex: "#E4E4E7", bgClass: "bg-zinc-200" },
    ],
    highlights: [
      "16.2-inch Liquid Retina XDR display with 1,600 nits peak HDR",
      "16-core CPU, 40-core GPU with hardware ray-tracing",
      "Up to 24 hours battery life on efficiency cores",
      "Six-speaker sound system with force-cancelling woofers",
      "Thunderbolt 5 ports, HDMI 2.1, and SDXC slot"
    ],
    specs: {
      "Processor": "Aurora Silicon 16-Core Workstation SoC",
      "Display": "3456 x 2234 Liquid Retina XDR, 1,000,000:1 contrast",
      "Memory": "48GB Unified High-Bandwidth Memory",
      "Storage": "1TB Gen5 NVMe Solid State Drive"
    },
    inTheBox: [
      "Aurora Book Pro 16\"",
      "140W USB-C Power Adapter",
      "Braided MagCharge 3 Cable (2m)"
    ]
  },
  {
    id: 6,
    name: "Aurora Studio Display 32\"",
    slug: "aurora-studio-display-32",
    description: "6K Retina display with nano-texture glass, 12MP Center Stage camera, and studio-quality mics.",
    details: "Over 20 million pixels of breathtaking detail. P3 wide color gamut, 10-bit color depth, and 600 nits brightness. Integrated A13-series bionic processing engine powers automatic Center Stage camera framing and Spatial Audio projection.",
    price: 159999,
    original_price: 179999,
    category_id: 3,
    category_name: "Computing & Displays",
    image_url: "/images/creator_monitor_4k.jpg",
    rating: 4.9,
    review_count: 67,
    stock: 12,
    is_featured: true,
    badge: "Studio 6K",
    colors: [
      { name: "Anodized Silver", hex: "#D4D4D8", bgClass: "bg-zinc-300" }
    ],
    highlights: [
      "32-inch 6K Retina panel with 6016 x 3384 resolution",
      "Nano-texture anti-reflective glass option",
      "12MP Ultra-Wide camera with Center Stage",
      "Studio-quality three-mic array with directional beamforming",
      "96W host charging via Thunderbolt 4"
    ]
  },
  {
    id: 7,
    name: "Aurora Phone 16 Pro",
    slug: "aurora-phone-16-pro",
    description: "Grade 5 titanium design, Camera Control sensor, 48MP Fusion system, and A18 Pro silicon.",
    details: "Features the thinnest bezels on any mobile device. The textured matte glass back meets a micro-blasted titanium frame. Equipped with a dedicated capacitive Camera Control button with tactile haptic feedback for instant exposure, zoom, and focus adjustments.",
    price: 119999,
    original_price: 129999,
    category_id: 4,
    category_name: "Smartphones & Tablets",
    image_url: "/images/flagship_smartphone_pro.jpg",
    rating: 4.9,
    review_count: 432,
    stock: 25,
    is_featured: true,
    badge: "New",
    colors: [
      { name: "Desert Titanium", hex: "#C2A88B", bgClass: "bg-stone-400" },
      { name: "Natural Titanium", hex: "#D4D4D8", bgClass: "bg-zinc-300" },
      { name: "White Titanium", hex: "#F4F4F5", bgClass: "bg-zinc-100" },
      { name: "Black Titanium", hex: "#27272A", bgClass: "bg-zinc-800" },
    ],
    highlights: [
      "Super Retina XDR OLED with 120Hz ProMotion and Always-On",
      "Grade 5 Titanium enclosure with ceramic shield front",
      "48MP Main Fusion camera with 5x telephoto optical zoom",
      "Tactile haptic Camera Control shutter sensor",
      "USB 3 speeds up to 10Gbps via USB-C"
    ],
    specs: {
      "Display": "6.7-inch OLED, 2796 x 1290 at 460 ppi",
      "Processor": "Aurora A18 Pro Neural SoC",
      "Cameras": "48MP Fusion, 48MP Ultra-Wide, 12MP 5x Telephoto",
      "Water Resistance": "IP68 (6m up to 30 minutes)"
    },
    inTheBox: [
      "Aurora Phone 16 Pro",
      "Braided USB-C Charging Cable (1m)",
      "Documentation"
    ]
  },
  {
    id: 8,
    name: "Aurora Pad Pro 13\"",
    slug: "aurora-pad-pro-13",
    description: "Ultra-thin 5.1mm profile, Tandem OLED Ultra Retina XDR, and desktop-class neural chip.",
    details: "The thinnest Aurora product ever created. Two OLED panels combine their light output to produce 1,000 nits full-screen brightness and 1,600 nits HDR peak. Supports precision stylus hover with sub-millimeter tracking.",
    price: 129999,
    original_price: 139999,
    category_id: 4,
    category_name: "Smartphones & Tablets",
    image_url: "/images/leather_laptop_sleeve.jpg",
    rating: 4.8,
    review_count: 89,
    stock: 16,
    is_featured: false,
    badge: "5.1mm Slim",
    colors: [
      { name: "Space Black", hex: "#1C1C1E", bgClass: "bg-neutral-900" },
      { name: "Silver", hex: "#E4E4E7", bgClass: "bg-zinc-200" },
    ]
  },
  {
    id: 9,
    name: "MagCharge Dual Pad",
    slug: "magcharge-dual-pad",
    description: "Simultaneous 25W Qi2 wireless charging for Phone, Watch, and Pods on weighted aluminum.",
    details: "Precision CNC-machined from a solid billet of recycled aluminum. Finished in soft-touch micro-suction silicone that protects device glass while ensuring perfect magnetic alignment every time.",
    price: 12999,
    original_price: 14999,
    category_id: 5,
    category_name: "MagCharge & Accessories",
    image_url: "/images/gan_power_station.jpg",
    rating: 4.8,
    review_count: 142,
    stock: 60,
    is_featured: false,
    badge: "Qi2 Fast",
    colors: [
      { name: "Silver Aluminum", hex: "#D4D4D8", bgClass: "bg-zinc-300" },
      { name: "Space Gray", hex: "#3F3F46", bgClass: "bg-zinc-700" },
    ]
  },
  {
    id: 10,
    name: "Aurora Precision Magic Pen",
    slug: "aurora-precision-magic-pen",
    description: "Pixel-perfect accuracy, barrel roll gyroscope, haptic feedback, and magnetic pairing.",
    details: "Squeeze gesture brings up a contextual palette to quickly switch tools, line weights, and colors. Barrel roll sensor allows you to rotate the pen to change the orientation of shaped pen and brush tools.",
    price: 11999,
    original_price: 13999,
    category_id: 5,
    category_name: "MagCharge & Accessories",
    image_url: "/images/mechanical_keyboard_rgb.jpg",
    rating: 4.9,
    review_count: 76,
    stock: 28,
    is_featured: false,
    badge: "Haptic"
  },
  {
    id: 11,
    name: "Aurora Cinema SoundBar",
    slug: "aurora-cinema-soundbar",
    description: "Dolby Atmos 7.1.4 spatial audio bar with dual integrated force-balanced subwoofers.",
    details: "Fills the entire room with room-sensing beamforming acoustic arrays. Automatically calibrates sound reflections against walls and furniture using ultrasonic radar sweeps.",
    price: 79999,
    original_price: 89999,
    category_id: 1,
    category_name: "Audio & Acoustics",
    image_url: "/images/cinema_soundbar_sub.jpg",
    rating: 4.9,
    review_count: 63,
    stock: 11,
    is_featured: false,
    badge: "Atmos 7.1.4"
  },
  {
    id: 12,
    name: "Aurora Master Ergonomic Mouse",
    slug: "aurora-master-ergonomic-mouse",
    description: "Electromagnetic MagSpeed scrolling, 8K DPI Darkfield sensor, and quiet-click switches.",
    details: "Sculpted for the natural contour of your palm. Features a thumb rest with integrated horizontal scroll wheel and gesture button. Connects to 3 devices simultaneously with cross-screen flow.",
    price: 9999,
    original_price: 11999,
    category_id: 5,
    category_name: "MagCharge & Accessories",
    image_url: "/images/ergonomic_master_mouse.jpg",
    rating: 4.7,
    review_count: 118,
    stock: 45,
    is_featured: false,
    badge: "Ergonomic"
  }
];

export const DEMO_USER: UserResponse = {
  id: 1,
  name: "Avishkar Patel",
  email: "user@apple.design",
  phone: "+1 (415) 890-2345",
  address: "One Infinite Loop, Cupertino, CA 95014",
  is_admin: true
};

export const INITIAL_ORDERS: OrderResponse[] = [
  {
    id: 94821,
    user_id: 1,
    customer_name: "Avishkar Patel",
    customer_email: "user@apple.design",
    shipping_address: "B-402, Signature Heights, Bandra West, Mumbai, MH 400050",
    total_amount: 49999,
    status: "Delivered",
    created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
    payment_method: "UPI (Google Pay / PhonePe)",
    tracking_number: "IN-8921-9304",
    items: [
      {
        id: 101,
        product_id: 1,
        product_name: "Aurora Studio Max",
        quantity: 1,
        price: 49999,
        unit_price: 49999,
        image_url: "/images/headphones_studio_pro.jpg"
      }
    ]
  },
  {
    id: 94820,
    user_id: 1,
    customer_name: "Avishkar Patel",
    customer_email: "user@apple.design",
    shipping_address: "B-402, Signature Heights, Bandra West, Mumbai, MH 400050",
    total_amount: 104998,
    status: "In Transit",
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    payment_method: "Credit Card (HDFC ending 4242)",
    tracking_number: "IN-5542-1082",
    items: [
      {
        id: 102,
        product_id: 2,
        product_name: "Aurora Pods Pro",
        quantity: 1,
        price: 24999,
        unit_price: 24999,
        image_url: "/images/earbuds_wireless_pods.jpg"
      },
      {
        id: 103,
        product_id: 3,
        product_name: "Aurora Watch Ultra",
        quantity: 1,
        price: 79999,
        unit_price: 79999,
        image_url: "/images/titanium_smartwatch_pulse.jpg"
      }
    ]
  }
];

export interface AddressItem {
  id: string;
  label: string;
  fullName: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

export const INITIAL_ADDRESSES: AddressItem[] = [
  {
    id: "addr_1",
    label: "Home (Primary)",
    fullName: "Avishkar Patel",
    street: "B-402, Signature Heights, Bandra West",
    city: "Mumbai",
    state: "Maharashtra",
    postalCode: "400050",
    country: "India",
    phone: "+91 98201 84920",
    isDefault: true
  },
  {
    id: "addr_2",
    label: "Studio & Office",
    fullName: "Avishkar Patel (Studio)",
    street: "Floor 8, Maker Maxity, BKC",
    city: "Mumbai",
    state: "Maharashtra",
    postalCode: "400051",
    country: "India",
    phone: "+91 98201 84921",
    isDefault: false
  }
];

export const AVAILABLE_COUPONS = [
  {
    code: "AURORA10",
    discountPercent: 10,
    description: "10% off your entire order",
    minSpend: 0
  },
  {
    code: "PRO20",
    discountPercent: 20,
    description: "20% discount on orders exceeding ₹25,000",
    minSpend: 25000
  },
  {
    code: "FREESHIP",
    discountPercent: 0,
    description: "Free express delivery all over India",
    freeShipping: true,
    minSpend: 0
  }
];

// Persistent LocalStorage Helpers
export const STORAGE_KEYS = {
  PRODUCTS: "aurora_products_inr_v4",
  CATEGORIES: "aurora_categories_inr_v4",
  ORDERS: "aurora_orders_inr_v4",
  USER: "aurora_user_inr_v4",
  ADDRESSES: "aurora_addresses_inr_v4",
  WISHLIST: "aurora_wishlist_inr_v4",
  CART: "aurora_cart_inr_v4"
};

export function getStoredProducts(): ProductDetailData[] {
  if (typeof window === "undefined") return INITIAL_PRODUCTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
      return INITIAL_PRODUCTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_PRODUCTS;
  }
}

export function saveStoredProducts(products: ProductDetailData[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
}

export function getStoredCategories(): CategoryResponse[] {
  if (typeof window === "undefined") return INITIAL_CATEGORIES;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
      return INITIAL_CATEGORIES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_CATEGORIES;
  }
}

export function getStoredOrders(): OrderResponse[] {
  if (typeof window === "undefined") return INITIAL_ORDERS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ORDERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
      return INITIAL_ORDERS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_ORDERS;
  }
}

export function saveStoredOrders(orders: OrderResponse[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
}

export function getStoredUser(): UserResponse {
  if (typeof window === "undefined") return DEMO_USER;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(DEMO_USER));
      return DEMO_USER;
    }
    return JSON.parse(raw);
  } catch {
    return DEMO_USER;
  }
}

export function saveStoredUser(user: UserResponse): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
}

export function getStoredAddresses(): AddressItem[] {
  if (typeof window === "undefined") return INITIAL_ADDRESSES;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ADDRESSES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.ADDRESSES, JSON.stringify(INITIAL_ADDRESSES));
      return INITIAL_ADDRESSES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_ADDRESSES;
  }
}

export function saveStoredAddresses(addresses: AddressItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.ADDRESSES, JSON.stringify(addresses));
}

// ==========================================
// SELLERS DATA & PERSISTENCE
// ==========================================
export const INITIAL_SELLERS: SellerProfile[] = [
  {
    id: "seller_1",
    businessName: "Aurelian Prime Direct",
    ownerName: "Marcus Aurelius",
    email: "prime@aureliandesign.io",
    phone: "+1 (800) 555-0199",
    category: "Audio & Acoustics",
    status: "APPROVED",
    rating: 4.9,
    totalSales: 1840,
    revenue: 492000,
    bankAccount: "Silicon Valley Bank •••• 8821",
    registeredDate: "2025-01-15",
    storeDescription: "Official flagship engineering studio of Aurelian. Master-crafted acoustic hardware, precision titanium accessories, and lossless drivers.",
    logoUrl: "/images/headphones_studio_pro.jpg",
    bannerUrl: "/images/cinema_soundbar_sub.jpg"
  },
  {
    id: "seller_2",
    businessName: "Apex Silicon Labs",
    ownerName: "Elena Vance",
    email: "vance@apexsilicon.tech",
    phone: "+1 (415) 302-8812",
    category: "Computing & Displays",
    status: "APPROVED",
    rating: 4.8,
    totalSales: 620,
    revenue: 310500,
    bankAccount: "JPMorgan Chase •••• 4190",
    registeredDate: "2025-02-10",
    storeDescription: "High-throughput workstations, tandem neural display arrays, and precision ceramic accessories.",
    logoUrl: "/images/carbon_laptop_zenith.jpg",
    bannerUrl: "/images/creator_monitor_4k.jpg"
  },
  {
    id: "seller_3",
    businessName: "Nordic Wave Acoustics",
    ownerName: "Soren Lindqvist",
    email: "contact@nordicwave.se",
    phone: "+46 8 123 4567",
    category: "Audio & Acoustics",
    status: "PENDING",
    rating: 4.7,
    totalSales: 45,
    revenue: 18900,
    bankAccount: "Nordea Bank •••• 7712",
    registeredDate: "2025-03-01",
    storeDescription: "Minimalist Scandinavian birch soundbars, tactile volume knobs, and wool-woven acoustic dampeners.",
    logoUrl: "/images/earbuds_wireless_pods.jpg",
    bannerUrl: "/images/cinema_soundbar_sub.jpg"
  }
];

export const INITIAL_SELLER_REVIEWS: SellerReview[] = [
  {
    id: "srev_1",
    sellerId: "seller_1",
    customerName: "Julian K.",
    rating: 5,
    date: "3 days ago",
    comment: "Packaging was museum-grade. Fast courier dispatch and tracking updated within 2 hours.",
    reply: "Thank you Julian, our logistics team inspects every seal before transit."
  },
  {
    id: "srev_2",
    sellerId: "seller_1",
    customerName: "Sarah M.",
    rating: 5,
    date: "1 week ago",
    comment: "Flawless titanium finish on the headphones. Direct seller support replied in 10 minutes.",
    reply: "Delighted you love the titanium chassis Sarah!"
  },
  {
    id: "srev_3",
    sellerId: "seller_2",
    customerName: "David L.",
    rating: 4.5,
    date: "2 weeks ago",
    comment: "The 6K workstation display is magnificent. Delivery took 3 days instead of 2, but well worth the wait.",
    reply: "Thanks David. We are expanding our express regional hubs this quarter."
  }
];

export const INITIAL_SELLER_PAYOUTS: SellerPayout[] = [
  {
    id: "po_101",
    sellerId: "seller_1",
    amount: 142000.00,
    date: "2025-03-01",
    status: "PROCESSED",
    bankRef: "NEFT-HDFC-8921102"
  },
  {
    id: "po_102",
    sellerId: "seller_1",
    amount: 285400.00,
    date: "2025-03-08",
    status: "PROCESSED",
    bankRef: "IMPS-ICICI-9941029"
  },
  {
    id: "po_103",
    sellerId: "seller_1",
    amount: 98400.00,
    date: "2025-03-15",
    status: "PENDING",
    bankRef: "UPI-SETTLE-0031"
  }
];

// ==========================================
// ADMIN USERS & SYSTEM DATA
// ==========================================
export const INITIAL_ADMIN_USERS: AdminUserRecord[] = [
  {
    id: 1,
    name: "Avishkar Patel",
    email: "user@apple.design",
    role: "ADMIN",
    status: "ACTIVE",
    joinedDate: "2024-11-12",
    ordersCount: 8,
    totalSpent: 429990,
    phone: "+91 98201 84920"
  },
  {
    id: 2,
    name: "Marcus Aurelius",
    email: "prime@aureliandesign.io",
    role: "SELLER",
    status: "ACTIVE",
    joinedDate: "2025-01-15",
    ordersCount: 2,
    totalSpent: 89990,
    phone: "+91 98201 55019"
  },
  {
    id: 3,
    name: "Elena Rostova",
    email: "elena@designhub.studio",
    role: "CUSTOMER",
    status: "ACTIVE",
    joinedDate: "2025-02-04",
    ordersCount: 5,
    totalSpent: 248000,
    phone: "+91 98201 90211"
  },
  {
    id: 4,
    name: "Devon Reed",
    email: "devon.reed@spamhold.cc",
    role: "CUSTOMER",
    status: "BLOCKED",
    joinedDate: "2025-02-28",
    ordersCount: 0,
    totalSpent: 0,
    phone: "+91 98201 01928"
  }
];

export const INITIAL_CMS_BANNERS: AdminCMSBanner[] = [
  {
    id: "banner_1",
    title: "Aurora Studio Max",
    subtitle: "Electro-acoustic transducers. Titanium chassis. Spatial audio.",
    tag: "Flagship Keynote",
    actionText: "Explore Studio Max",
    actionUrl: "/product/1",
    imageUrl: "/images/headphones_studio_pro.jpg",
    isActive: true
  },
  {
    id: "banner_2",
    title: "Spring Aurora Launch",
    subtitle: "Up to 20% off all titanium wearables and 6K pro displays with code PRO20.",
    tag: "Limited Drop",
    actionText: "Shop Flash Deals",
    actionUrl: "/deals",
    imageUrl: "/images/titanium_smartwatch_pulse.jpg",
    isActive: true
  },
  {
    id: "banner_3",
    title: "Join Aurora Club Loyalty",
    subtitle: "Earn 10 points per ₹100 spent. Unlock early release drops.",
    tag: "Membership",
    actionText: "View Rewards",
    actionUrl: "/loyalty",
    imageUrl: "/images/creator_monitor_4k.jpg",
    isActive: true
  }
];

export const INITIAL_SITE_SETTINGS: AdminSiteSettings = {
  siteName: "Aurora Store & Marketplace",
  supportEmail: "support@auroradesign.in",
  commissionRate: 10.0, // 10% platform fee
  freeShippingThreshold: 999,
  returnWindowDays: 15,
  taxRate: 18.0, // 18% GST
  maintenanceMode: false,
  currency: "INR (₹)"
};

export const INITIAL_RETURNS: ReturnItem[] = [
  {
    id: "ret_9921",
    orderId: 94821,
    productId: 1,
    productName: "Aurora Studio Max",
    reason: "Prefer Titanium Silver finish instead of Space Black",
    status: "PICKED_UP",
    requestedDate: "2025-03-07",
    refundAmount: 49999,
    pickupScheduled: "2025-03-09 (Completed)"
  }
];

export const INITIAL_LOYALTY: LoyaltyAccount = {
  points: 1250,
  tier: "GOLD",
  lifetimeSpent: 429990,
  rewardsAvailable: [
    { id: "rw_1", title: "₹2,500 Store Voucher", pointsNeeded: 500, code: "GOLD2500" },
    { id: "rw_2", title: "Complimentary Titanium Care+ (1 Year)", pointsNeeded: 1000, code: "CAREPLUS" },
    { id: "rw_3", title: "VIP Private Keynote Pass 2025", pointsNeeded: 2500, code: "VIPKEYNOTE" }
  ]
};

// STORAGE GETTERS / SETTERS
const STORAGE_KEYS_EXT = {
  SELLERS: "aurora_sellers_inr_v4",
  SELLER_REVIEWS: "aurora_seller_reviews_inr_v4",
  SELLER_PAYOUTS: "aurora_seller_payouts_inr_v4",
  ADMIN_USERS: "aurora_admin_users_inr_v4",
  CMS_BANNERS: "aurora_cms_banners_inr_v4",
  SITE_SETTINGS: "aurora_site_settings_inr_v4",
  RETURNS: "aurora_returns_inr_v4",
  LOYALTY: "aurora_loyalty_inr_v4"
};

export function getStoredSellers(): SellerProfile[] {
  if (typeof window === "undefined") return INITIAL_SELLERS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS_EXT.SELLERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS_EXT.SELLERS, JSON.stringify(INITIAL_SELLERS));
      return INITIAL_SELLERS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_SELLERS;
  }
}

export function saveStoredSellers(sellers: SellerProfile[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS_EXT.SELLERS, JSON.stringify(sellers));
}

export function getStoredSellerReviews(): SellerReview[] {
  if (typeof window === "undefined") return INITIAL_SELLER_REVIEWS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS_EXT.SELLER_REVIEWS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS_EXT.SELLER_REVIEWS, JSON.stringify(INITIAL_SELLER_REVIEWS));
      return INITIAL_SELLER_REVIEWS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_SELLER_REVIEWS;
  }
}

export function saveStoredSellerReviews(reviews: SellerReview[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS_EXT.SELLER_REVIEWS, JSON.stringify(reviews));
}

export function getStoredSellerPayouts(): SellerPayout[] {
  if (typeof window === "undefined") return INITIAL_SELLER_PAYOUTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS_EXT.SELLER_PAYOUTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS_EXT.SELLER_PAYOUTS, JSON.stringify(INITIAL_SELLER_PAYOUTS));
      return INITIAL_SELLER_PAYOUTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_SELLER_PAYOUTS;
  }
}

export function saveStoredSellerPayouts(payouts: SellerPayout[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS_EXT.SELLER_PAYOUTS, JSON.stringify(payouts));
}

export function getStoredAdminUsers(): AdminUserRecord[] {
  if (typeof window === "undefined") return INITIAL_ADMIN_USERS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS_EXT.ADMIN_USERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS_EXT.ADMIN_USERS, JSON.stringify(INITIAL_ADMIN_USERS));
      return INITIAL_ADMIN_USERS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_ADMIN_USERS;
  }
}

export function saveStoredAdminUsers(users: AdminUserRecord[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS_EXT.ADMIN_USERS, JSON.stringify(users));
}

export function getStoredCMSBanners(): AdminCMSBanner[] {
  if (typeof window === "undefined") return INITIAL_CMS_BANNERS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS_EXT.CMS_BANNERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS_EXT.CMS_BANNERS, JSON.stringify(INITIAL_CMS_BANNERS));
      return INITIAL_CMS_BANNERS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_CMS_BANNERS;
  }
}

export function saveStoredCMSBanners(banners: AdminCMSBanner[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS_EXT.CMS_BANNERS, JSON.stringify(banners));
}

export function getStoredSiteSettings(): AdminSiteSettings {
  if (typeof window === "undefined") return INITIAL_SITE_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS_EXT.SITE_SETTINGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS_EXT.SITE_SETTINGS, JSON.stringify(INITIAL_SITE_SETTINGS));
      return INITIAL_SITE_SETTINGS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_SITE_SETTINGS;
  }
}

export function saveStoredSiteSettings(settings: AdminSiteSettings) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS_EXT.SITE_SETTINGS, JSON.stringify(settings));
}

export function getStoredReturns(): ReturnItem[] {
  if (typeof window === "undefined") return INITIAL_RETURNS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS_EXT.RETURNS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS_EXT.RETURNS, JSON.stringify(INITIAL_RETURNS));
      return INITIAL_RETURNS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_RETURNS;
  }
}

export function saveStoredReturns(returns: ReturnItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS_EXT.RETURNS, JSON.stringify(returns));
}

export function getStoredLoyalty(): LoyaltyAccount {
  if (typeof window === "undefined") return INITIAL_LOYALTY;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS_EXT.LOYALTY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS_EXT.LOYALTY, JSON.stringify(INITIAL_LOYALTY));
      return INITIAL_LOYALTY;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_LOYALTY;
  }
}

export function saveStoredLoyalty(loyalty: LoyaltyAccount) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS_EXT.LOYALTY, JSON.stringify(loyalty));
}

