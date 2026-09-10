import {
  UserCreate,
  LoginRequest,
  UserResponse,
  CategoryResponse,
  ProductResponse,
  ProductListResponse,
  CartItemCreate,
  CartItemUpdate,
  CartResponse,
  OrderResponse,
  OrderStatusUpdate,
  CheckoutRequest,
} from "@/types/api";

import {
  getStoredProducts,
  getStoredCategories,
  getStoredOrders,
  saveStoredOrders,
  getStoredUser,
  saveStoredUser,
  ProductDetailData,
} from "./mockData";

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.status = status;
    this.data = data;
    this.name = "ApiError";
  }
}

// ----------------------------------------------------
// PRODUCT API
// ----------------------------------------------------
export const productApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    category_id?: number;
    search?: string;
    min_price?: number;
    max_price?: number;
    sort?: string;
  }): Promise<ProductListResponse> => {
    // Artificial micro-delay for smooth UI feel
    await new Promise((resolve) => setTimeout(resolve, 60));

    let products = [...getStoredProducts()];

    if (params?.category_id) {
      products = products.filter((p) => p.category_id === Number(params.category_id));
    }

    if (params?.search) {
      const q = params.search.toLowerCase().trim();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          Boolean(p.description && p.description.toLowerCase().includes(q)) ||
          Boolean(p.category_name && p.category_name.toLowerCase().includes(q))
      );
    }

    if (params?.min_price !== undefined) {
      products = products.filter((p) => p.price >= (params.min_price || 0));
    }

    if (params?.max_price !== undefined) {
      products = products.filter((p) => p.price <= (params.max_price || 999999));
    }

    if (params?.sort) {
      switch (params.sort) {
        case "price_asc":
          products.sort((a, b) => a.price - b.price);
          break;
        case "price_desc":
          products.sort((a, b) => b.price - a.price);
          break;
        case "rating":
          products.sort((a, b) => (b.rating || 0) - (a.rating || 0));
          break;
        case "newest":
        default:
          products.sort((a, b) => b.id - a.id);
          break;
      }
    }

    const page = params?.page || 1;
    const limit = params?.limit || products.length;
    const total = products.length;
    const pages = Math.ceil(total / limit) || 1;
    const start = (page - 1) * limit;
    const paginated = products.slice(start, start + limit);

    return {
      products: paginated,
      total,
      page,
      limit,
      total_pages: pages,
      pages,
    };
  },

  getById: async (id: number): Promise<ProductDetailData> => {
    await new Promise((resolve) => setTimeout(resolve, 40));
    const products = getStoredProducts();
    const product = products.find((p) => p.id === Number(id));
    if (!product) {
      throw new ApiError(`Product #${id} not found`, 404);
    }
    return product;
  },

  getByCategory: async (categoryId: number): Promise<ProductListResponse> => {
    return productApi.getAll({ category_id: categoryId });
  },

  create: async (data: any): Promise<ProductResponse> => {
    const products = getStoredProducts();
    const newProduct: ProductDetailData = {
      ...data,
      id: Date.now(),
      created_at: new Date().toISOString(),
      rating: 5.0,
      review_count: 1,
    };
    const updated = [newProduct, ...products];
    if (typeof window !== "undefined") {
      localStorage.setItem("aurelian_products_v2", JSON.stringify(updated));
    }
    return newProduct;
  },

  update: async (id: number, data: any): Promise<ProductResponse> => {
    const products = getStoredProducts();
    const idx = products.findIndex((p) => p.id === id);
    if (idx === -1) throw new ApiError("Product not found", 404);
    products[idx] = { ...products[idx], ...data };
    if (typeof window !== "undefined") {
      localStorage.setItem("aurelian_products_v2", JSON.stringify(products));
    }
    return products[idx];
  },

  delete: async (id: number): Promise<{ message: string }> => {
    let products = getStoredProducts();
    products = products.filter((p) => p.id !== id);
    if (typeof window !== "undefined") {
      localStorage.setItem("aurelian_products_v2", JSON.stringify(products));
    }
    return { message: "Product deleted successfully" };
  },
};

// ----------------------------------------------------
// CATEGORY API
// ----------------------------------------------------
export const categoryApi = {
  getAll: async (): Promise<CategoryResponse[]> => {
    await new Promise((resolve) => setTimeout(resolve, 30));
    return getStoredCategories();
  },

  getById: async (id: number): Promise<CategoryResponse> => {
    const cats = getStoredCategories();
    const cat = cats.find((c) => c.id === id);
    if (!cat) throw new ApiError("Category not found", 404);
    return cat;
  },

  create: async (data: any): Promise<CategoryResponse> => {
    const cats = getStoredCategories();
    const newCat: CategoryResponse = {
      id: Date.now(),
      name: data.name,
      slug: data.name.toLowerCase().replace(/\s+/g, "-"),
    };
    const updated = [...cats, newCat];
    if (typeof window !== "undefined") {
      localStorage.setItem("aurelian_categories_v2", JSON.stringify(updated));
    }
    return newCat;
  },

  update: async (id: number, data: any): Promise<CategoryResponse> => {
    const cats = getStoredCategories();
    const idx = cats.findIndex((c) => c.id === id);
    if (idx === -1) throw new ApiError("Category not found", 404);
    cats[idx] = { ...cats[idx], ...data };
    if (typeof window !== "undefined") {
      localStorage.setItem("aurelian_categories_v2", JSON.stringify(cats));
    }
    return cats[idx];
  },

  delete: async (id: number): Promise<{ message: string }> => {
    let cats = getStoredCategories();
    cats = cats.filter((c) => c.id !== id);
    if (typeof window !== "undefined") {
      localStorage.setItem("aurelian_categories_v2", JSON.stringify(cats));
    }
    return { message: "Category deleted successfully" };
  },
};

// ----------------------------------------------------
// AUTH API
// ----------------------------------------------------
export const authApi = {
  login: async (credentials: LoginRequest): Promise<{ access_token: string; token_type: string; user: UserResponse }> => {
    await new Promise((resolve) => setTimeout(resolve, 80));
    const user = getStoredUser();
    const token = "mock_apple_token_" + Date.now();
    if (typeof window !== "undefined") {
      localStorage.setItem("aurelian_token", token);
      localStorage.setItem("aurelian_user", JSON.stringify(user));
    }
    return {
      access_token: token,
      token_type: "bearer",
      user,
    };
  },

  register: async (userData: UserCreate): Promise<UserResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 80));
    const newUser: UserResponse = {
      id: Date.now(),
      name: userData.name,
      email: userData.email,
      phone: userData.phone || "+1 (555) 019-2831",
      address: userData.address || "1 Apple Park Way, Cupertino, CA",
      is_admin: false,
    };
    saveStoredUser(newUser);
    return newUser;
  },

  getMe: async (): Promise<UserResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 40));
    return getStoredUser();
  },

  updateMe: async (data: Partial<UserResponse>): Promise<UserResponse> => {
    const current = getStoredUser();
    const updated = { ...current, ...data };
    saveStoredUser(updated);
    return updated;
  },
};

// ----------------------------------------------------
// CART API (Local Persistence)
// ----------------------------------------------------
const CART_KEY = "aurelian_cart_items_v2";

function getLocalCart(): CartResponse {
  if (typeof window === "undefined") return { items: [], total: 0 };
  try {
    const raw = localStorage.getItem(CART_KEY);
    const items = raw ? JSON.parse(raw) : [];
    const total = items.reduce((acc: number, item: any) => acc + item.product_price * item.quantity, 0);
    return { items, total };
  } catch {
    return { items: [], total: 0 };
  }
}

function saveLocalCart(items: any[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export const cartApi = {
  get: async (): Promise<CartResponse> => {
    return getLocalCart();
  },

  add: async (item: CartItemCreate): Promise<CartResponse> => {
    const cart = getLocalCart();
    const products = getStoredProducts();
    const prod = products.find((p) => p.id === item.product_id);
    if (!prod) throw new ApiError("Product not found", 404);

    const existingIdx = cart.items.findIndex((i) => i.product_id === item.product_id);
    if (existingIdx > -1) {
      cart.items[existingIdx].quantity += item.quantity || 1;
    } else {
      cart.items.push({
        id: Date.now(),
        product_id: prod.id,
        product_name: prod.name,
        product_price: prod.price,
        quantity: item.quantity || 1,
        image_url: prod.image_url,
      });
    }
    saveLocalCart(cart.items);
    return getLocalCart();
  },

  update: async (itemId: number, data: CartItemUpdate): Promise<CartResponse> => {
    const cart = getLocalCart();
    const item = cart.items.find((i) => i.id === itemId);
    if (item) {
      item.quantity = data.quantity;
      if (item.quantity <= 0) {
        cart.items = cart.items.filter((i) => i.id !== itemId);
      }
    }
    saveLocalCart(cart.items);
    return getLocalCart();
  },

  remove: async (itemId: number): Promise<CartResponse> => {
    const cart = getLocalCart();
    const filtered = cart.items.filter((i) => i.id !== itemId);
    saveLocalCart(filtered);
    return getLocalCart();
  },

  clear: async (): Promise<void> => {
    saveLocalCart([]);
  },
};

// ----------------------------------------------------
// ORDER API
// ----------------------------------------------------
export const orderApi = {
  checkout: async (data: CheckoutRequest): Promise<OrderResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 150));
    const cart = getLocalCart();
    const user = getStoredUser();

    const newOrder: OrderResponse = {
      id: Math.floor(100000 + Math.random() * 900000),
      user_id: user.id,
      customer_name: user.name,
      customer_email: user.email,
      shipping_address: data.shipping_address,
      total_amount: cart.total || 0,
      status: "Processing",
      created_at: new Date().toISOString(),
      payment_method: data.payment_method || "Apple Pay",
      tracking_number: "AP-" + Math.floor(1000 + Math.random() * 9000) + "-US",
      items: cart.items.map((i) => ({
        id: Math.floor(Math.random() * 10000),
        product_id: i.product_id,
        product_name: i.product_name,
        quantity: i.quantity,
        price: i.product_price || 0,
        unit_price: i.product_price || 0,
        image_url: i.image_url,
      })),
    };

    const currentOrders = getStoredOrders();
    const updated = [newOrder, ...currentOrders];
    saveStoredOrders(updated);
    cartApi.clear();

    return newOrder;
  },

  getMyOrders: async (): Promise<OrderResponse[]> => {
    await new Promise((resolve) => setTimeout(resolve, 50));
    return getStoredOrders();
  },

  getById: async (orderId: number): Promise<OrderResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 40));
    const orders = getStoredOrders();
    const order = orders.find((o) => o.id === Number(orderId));
    if (!order) throw new ApiError(`Order #${orderId} not found`, 404);
    return order;
  },

  getAllAdmin: async (): Promise<OrderResponse[]> => {
    return getStoredOrders();
  },

  getAllOrders: async (): Promise<OrderResponse[]> => {
    return getStoredOrders();
  },

  getOrderById: async (orderId: number): Promise<OrderResponse> => {
    return orderApi.getById(orderId);
  },

  updateStatus: async (orderId: number, data: OrderStatusUpdate): Promise<OrderResponse> => {
    const orders = getStoredOrders();
    const order = orders.find((o) => o.id === orderId);
    if (!order) throw new ApiError("Order not found", 404);
    order.status = data.status;
    saveStoredOrders(orders);
    return order;
  },

  cancel: async (orderId: number): Promise<OrderResponse> => {
    const orders = getStoredOrders();
    const order = orders.find((o) => o.id === orderId);
    if (!order) throw new ApiError("Order not found", 404);
    order.status = "Cancelled";
    saveStoredOrders(orders);
    return order;
  },
};
