export interface UserCreate {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  address?: string;
}

export interface LoginRequest {
  email: string;
  password?: string;
}

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  is_admin: boolean;
  phone?: string;
  address?: string;
}

export interface Token {
  access_token: string;
  token_type: string;
}

export interface CategoryCreate {
  name: string;
  slug?: string;
}

export interface CategoryResponse {
  id: number;
  name: string;
  slug?: string;
}

export interface ProductCreate {
  name: string;
  description: string;
  price: number;
  original_price?: number | null;
  stock: number;
  category_id: number;
  category_name?: string;
  image_url?: string | null;
  rating?: number | null;
  review_count?: number | null;
  reviews_count?: number | null;
  badge?: string | null;
  slug?: string;
  details?: string;
  is_featured?: boolean;
}

export interface ProductResponse {
  id: number;
  name: string;
  description?: string | null;
  price: number;
  original_price?: number | null;
  stock: number;
  category_id: number;
  category_name?: string;
  image_url?: string | null;
  rating?: number | null;
  review_count?: number | null;
  reviews_count?: number | null;
  badge?: string | null;
  slug?: string;
  details?: string;
  is_featured?: boolean;
}

export interface ProductDetailData extends ProductResponse {
  colors?: { name: string; hex: string; bgClass: string }[];
  specs?: Record<string, string>;
  highlights?: string[];
  inTheBox?: string[];
}

export interface ProductListResponse {
  products: ProductResponse[];
  total: number;
  page: number;
  limit: number;
  pages?: number;
  total_pages?: number;
}

export interface CartItemCreate {
  product_id: number;
  quantity: number;
}

export interface CartItemUpdate {
  quantity: number;
}

export interface CartItemResponse {
  id: number;
  product_id: number;
  quantity: number;
  product_name?: string;
  product_price?: number;
  image_url?: string | null;
  price?: number;
  product?: ProductResponse;
}

export interface CartResponse {
  id?: number;
  user_id?: number;
  items: CartItemResponse[];
  total?: number;
}

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'Processing'
  | 'In Transit'
  | 'Delivered'
  | 'Cancelled';

export type PaymentMode = 'ONLINE' | 'COD' | string;

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

export interface OrderUserResponse {
  id: number;
  name: string;
  email: string;
}

export interface OrderItemResponse {
  id: number;
  product_id: number;
  quantity: number;
  price?: number;
  unit_price?: number;
  product_name?: string;
  image_url?: string | null;
  product?: ProductResponse;
}

export interface OrderResponse {
  id: number;
  user_id: number;
  total_amount: number;
  status: OrderStatus | string;
  customer_name?: string;
  customer_email?: string;
  shipping_address?: string;
  created_at?: string;
  payment_method?: string;
  tracking_number?: string;
  user?: OrderUserResponse;
  items?: OrderItemResponse[];
  reserved_until?: string | null;
}

export interface OrderStatusUpdate {
  status: OrderStatus;
}

export interface CheckoutRequest {
  payment_mode?: PaymentMode;
  shipping_address?: string;
  payment_method?: string;
}

export interface CheckoutResponse {
  order: OrderResponse;
  payment_mode?: PaymentMode;
  razorpay_order_id?: string | null;
  razorpay_key_id?: string | null;
  amount?: number;
  currency?: string;
}

// Client UI types
export interface ClientCartItem {
  id: number | string;
  product_id: number;
  quantity: number;
  product_name: string;
  product_price: number;
  image_url?: string | null;
  stock?: number;
  product?: ProductResponse;
}

export interface ShippingAddress {
  fullName: string;
  phoneNumber?: string;
  phone?: string;
  streetAddress?: string;
  street?: string;
  apartment?: string;
  city: string;
  state: string;
  pincode?: string;
  postalCode?: string;
  country?: string;
}

// Seller Portal Types
export interface SellerProfile {
  id: string;
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  category: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
  rating: number;
  totalSales: number;
  revenue: number;
  bankAccount: string;
  registeredDate: string;
  storeDescription?: string;
  logoUrl?: string;
  bannerUrl?: string;
}

export interface SellerReview {
  id: string;
  sellerId: string;
  customerName: string;
  rating: number;
  date: string;
  comment: string;
  reply?: string;
}

export interface SellerPayout {
  id: string;
  sellerId: string;
  amount: number;
  date: string;
  status: 'PROCESSED' | 'PENDING' | 'ON_HOLD';
  bankRef: string;
}

// Admin Console Types
export interface AdminUserRecord {
  id: number;
  name: string;
  email: string;
  role: 'CUSTOMER' | 'SELLER' | 'ADMIN';
  status: 'ACTIVE' | 'BLOCKED' | 'SUSPENDED';
  joinedDate: string;
  ordersCount: number;
  totalSpent: number;
  phone?: string;
}

export interface AdminCMSBanner {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  actionText: string;
  actionUrl: string;
  imageUrl: string;
  isActive: boolean;
}

export interface AdminSiteSettings {
  siteName: string;
  supportEmail: string;
  commissionRate: number; // percentage
  freeShippingThreshold: number;
  returnWindowDays: number;
  taxRate: number;
  maintenanceMode: boolean;
  currency: string;
}

// Return & Dispute Types
export interface ReturnItem {
  id: string;
  orderId: number;
  productId: number;
  productName: string;
  reason: string;
  status: 'REQUESTED' | 'APPROVED' | 'PICKED_UP' | 'REFUNDED' | 'REJECTED';
  requestedDate: string;
  refundAmount: number;
  pickupScheduled?: string;
}

// Loyalty & Rewards
export interface LoyaltyAccount {
  points: number;
  tier: 'BRONZE' | 'SILVER' | 'GOLD' | 'TITANIUM';
  lifetimeSpent: number;
  rewardsAvailable: { id: string; title: string; pointsNeeded: number; code: string }[];
}

