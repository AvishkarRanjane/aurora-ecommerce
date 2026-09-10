"use client";

import React, { useEffect, useState, useCallback } from "react";
import { productApi, categoryApi } from "@/lib/api";
import { ProductResponse, CategoryResponse, ProductCreate } from "@/types/api";
import { useToast } from "@/context/ToastContext";
import { formatPrice, resolveImageUrl } from "@/lib/utils";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  ShoppingBag,
  Star,
  ChevronLeft,
  ChevronRight,
  Package,
  Layers,
} from "lucide-react";

export default function AdminProductsPage() {
  const { success, error } = useToast();

  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductResponse | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state for Create / Edit
  const [formData, setFormData] = useState<ProductCreate>({
    name: "",
    description: "",
    price: 0,
    original_price: null,
    stock: 10,
    category_id: 1,
    image_url: "",
    rating: 4.8,
    reviews_count: 124,
    badge: "",
  });

  const loadCategories = useCallback(async () => {
    try {
      const cats = await categoryApi.getAll();
      setCategories(cats || []);
      if (cats && cats.length > 0 && !formData.category_id) {
        setFormData((prev) => ({ ...prev, category_id: cats[0].id }));
      }
    } catch {}
  }, [formData.category_id]);

  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await productApi.getAll({
        search: search.trim() || undefined,
        page,
        limit: 10,
      });
      setProducts(res.products || []);
      setTotal(res.total || 0);
      setTotalPages(res.total_pages || 1);
    } catch (err: any) {
      error(err.message || "Failed to load products", "Load Error");
    } finally {
      setIsLoading(false);
    }
  }, [search, page, error]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const openCreateModal = () => {
    setFormData({
      name: "",
      description: "",
      price: 9999,
      original_price: 12999,
      stock: 25,
      category_id: categories[0]?.id || 1,
      image_url: "/images/headphones_studio_pro.jpg",
      rating: 4.8,
      reviews_count: 150,
      badge: "New Release",
    });
    setIsCreateModalOpen(true);
  };

  const openEditModal = (product: ProductResponse) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || "",
      price: product.price,
      original_price: product.original_price || null,
      stock: product.stock,
      category_id: product.category_id,
      image_url: product.image_url || "",
      rating: product.rating || 4.8,
      reviews_count: product.reviews_count || 124,
      badge: product.badge || "",
    });
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingProduct) {
        // Update product
        await productApi.update(editingProduct.id, formData);
        success(`Product "${formData.name}" updated successfully!`, "Product Updated");
        setEditingProduct(null);
      } else {
        // Create product
        await productApi.create(formData);
        success(`Product "${formData.name}" added to catalog!`, "Product Created");
        setIsCreateModalOpen(false);
      }
      loadProducts();
    } catch (err: any) {
      error(err.message || "Failed to save product", "Save Error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!deletingProductId) return;
    setIsSubmitting(true);
    try {
      await productApi.delete(deletingProductId);
      success("Product removed from catalog.", "Product Deleted");
      setDeletingProductId(null);
      loadProducts();
    } catch (err: any) {
      error(err.message || "Failed to delete product", "Delete Error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="bg-white rounded-[28px] p-6 shadow-diffused border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-xl text-slate-900">
            Catalog Inventory ({total} Products)
          </h2>
          <p className="text-xs text-slate-500">
            Create, update specs, adjust stock levels, or retire items
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="h-10 pl-9 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus-ring w-48 sm:w-64"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </div>

          <button
            onClick={openCreateModal}
            className="btn-primary shadow-primary-glow h-10 px-4 rounded-xl font-bold text-xs flex items-center gap-2 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-[28px] shadow-diffused border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-6">Hardware Item</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Pricing</th>
                <th className="py-3.5 px-4">Stock</th>
                <th className="py-3.5 px-4">Rating</th>
                <th className="py-3.5 px-4">Badge</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <div className="inline-block w-6 h-6 border-2 border-[#FB641B] border-t-transparent rounded-full animate-spin mb-2" />
                    <p>Loading products table...</p>
                  </td>
                </tr>
              ) : products.length > 0 ? (
                products.map((prod) => {
                  const cat = categories.find((c) => c.id === prod.category_id);
                  return (
                    <tr
                      key={prod.id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="py-3.5 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 shrink-0 overflow-hidden border border-slate-200/80 flex items-center justify-center">
                            {prod.image_url ? (
                              <img
                                src={resolveImageUrl(prod.image_url)}
                                alt={prod.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <ShoppingBag className="w-4 h-4 text-slate-400" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <span className="font-bold text-slate-900 block truncate max-w-[200px]">
                              {prod.name}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              ID: #{prod.id}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-medium">
                          {cat?.name || `Cat #${prod.category_id}`}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-900 block tabular-nums">
                          {formatPrice(prod.price)}
                        </span>
                        {prod.original_price && (
                          <span className="text-[10px] text-slate-400 line-through tabular-nums">
                            {formatPrice(prod.original_price)}
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`font-bold ${
                            prod.stock > 10
                              ? "text-emerald-700"
                              : prod.stock > 0
                              ? "text-amber-700"
                              : "text-rose-600"
                          }`}
                        >
                          {prod.stock} units
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1 text-slate-900 font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{prod.rating || 4.8}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        {prod.badge ? (
                          <span className="px-2 py-0.5 rounded-md bg-orange-50 text-[#FB641B] font-bold text-[10px] border border-orange-200">
                            {prod.badge}
                          </span>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>

                      <td className="py-3.5 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(prod)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                            title="Edit Product"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeletingProductId(prod.id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    No products matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-slate-100">
            <span className="text-xs text-slate-500">
              Page {page} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Product Modal */}
      <Modal
        isOpen={isCreateModalOpen || editingProduct !== null}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingProduct(null);
        }}
        title={editingProduct ? "Edit Hardware Item" : "Create New Product"}
        description={
          editingProduct
            ? `Update specifications and pricing for #${editingProduct.id}`
            : "Fill in the hardware specifications below"
        }
        maxWidth="lg"
      >
        <form onSubmit={handleSaveProduct} className="space-y-4 pt-2">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 block">
              Product Title *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus-ring"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">
                Category *
              </label>
              <select
                value={formData.category_id}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    category_id: Number(e.target.value),
                  }))
                }
                className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold focus-ring"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">
                Stock Units *
              </label>
              <input
                type="number"
                required
                min={0}
                value={formData.stock}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    stock: Number(e.target.value),
                  }))
                }
                className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus-ring"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">
                Price (₹) *
              </label>
              <input
                type="number"
                required
                min={1}
                value={formData.price}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    price: Number(e.target.value),
                  }))
                }
                className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus-ring"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">
                Original Price (₹) (Optional)
              </label>
              <input
                type="number"
                value={formData.original_price || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    original_price: e.target.value ? Number(e.target.value) : null,
                  }))
                }
                className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus-ring"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 block">
              Image URL
            </label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={formData.image_url || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  image_url: e.target.value || null,
                }))
              }
              className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus-ring"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 block">
              Product Description
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus-ring"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">
                Badge (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Best Seller"
                value={formData.badge || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, badge: e.target.value }))
                }
                className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus-ring"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">
                Rating (0.0 to 5.0)
              </label>
              <input
                type="number"
                step="0.1"
                min="1"
                max="5"
                value={formData.rating || 4.8}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    rating: Number(e.target.value),
                  }))
                }
                className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus-ring"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                setIsCreateModalOpen(false);
                setEditingProduct(null);
              }}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary shadow-primary-glow px-5 py-2.5 rounded-xl text-xs font-bold"
            >
              {isSubmitting
                ? "Saving..."
                : editingProduct
                ? "Update Product"
                : "Create Product"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={deletingProductId !== null}
        onClose={() => setDeletingProductId(null)}
        onConfirm={handleDeleteProduct}
        title="Delete Hardware Product?"
        description="Are you sure you want to permanently delete this product from the database catalog?"
        confirmText="Delete Product"
        cancelText="Cancel"
        variant="danger"
        isLoading={isSubmitting}
      />
    </div>
  );
}
