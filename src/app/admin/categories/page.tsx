"use client";

import React, { useEffect, useState, useCallback } from "react";
import { categoryApi } from "@/lib/api";
import { CategoryResponse } from "@/types/api";
import { useToast } from "@/context/ToastContext";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Plus, Edit2, Trash2, Layers, Tag } from "lucide-react";

export default function AdminCategoriesPage() {
  const { success, error } = useToast();

  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryResponse | null>(null);
  const [deletingCategoryId, setDeletingCategoryId] = useState<number | null>(null);
  const [categoryName, setCategoryName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await categoryApi.getAll();
      setCategories(data || []);
    } catch (err: any) {
      error(err.message || "Failed to load categories", "Load Error");
    } finally {
      setIsLoading(false);
    }
  }, [error]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const openCreateModal = () => {
    setCategoryName("");
    setIsCreateModalOpen(true);
  };

  const openEditModal = (cat: CategoryResponse) => {
    setEditingCategory(cat);
    setCategoryName(cat.name);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    setIsSubmitting(true);
    try {
      if (editingCategory) {
        await categoryApi.update(editingCategory.id, { name: categoryName.trim() });
        success(`Category renamed to "${categoryName.trim()}"!`, "Category Updated");
        setEditingCategory(null);
      } else {
        await categoryApi.create({ name: categoryName.trim() });
        success(`Category "${categoryName.trim()}" created!`, "Category Created");
        setIsCreateModalOpen(false);
      }
      loadCategories();
    } catch (err: any) {
      error(err.message || "Failed to save category", "Save Error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!deletingCategoryId) return;
    setIsSubmitting(true);
    try {
      await categoryApi.delete(deletingCategoryId);
      success("Category removed from catalog.", "Category Deleted");
      setDeletingCategoryId(null);
      loadCategories();
    } catch (err: any) {
      error(err.message || "Failed to delete category", "Delete Error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header action bar */}
      <div className="bg-white rounded-[28px] p-6 shadow-diffused border border-slate-100 flex items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-xl text-slate-900">
            Hardware Categories ({categories.length})
          </h2>
          <p className="text-xs text-slate-500">
            Organize catalog groupings, taxonomy pills, and department navigation
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="btn-primary shadow-primary-glow h-10 px-4 rounded-xl font-bold text-xs flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      {/* Category List */}
      <div className="bg-white rounded-[28px] shadow-diffused border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-6">ID</th>
                <th className="py-3.5 px-6">Category Name</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {isLoading ? (
                <tr>
                  <td colSpan={3} className="py-12 text-center text-slate-400">
                    <div className="inline-block w-6 h-6 border-2 border-[#FB641B] border-t-transparent rounded-full animate-spin mb-2" />
                    <p>Loading categories...</p>
                  </td>
                </tr>
              ) : categories.length > 0 ? (
                categories.map((cat) => (
                  <tr
                    key={cat.id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="py-4 px-6 font-mono text-slate-400">
                      #{cat.id}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-orange-50 text-[#FB641B] flex items-center justify-center">
                          <Tag className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-slate-900 text-sm">
                          {cat.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(cat)}
                          className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                          title="Edit Category"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingCategoryId(cat.id)}
                          className="p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete Category"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="py-12 text-center text-slate-500">
                    No categories found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Category Modal */}
      <Modal
        isOpen={isCreateModalOpen || editingCategory !== null}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingCategory(null);
        }}
        title={editingCategory ? "Edit Category" : "Add Hardware Category"}
        description="Enter the department / category title below."
        maxWidth="sm"
      >
        <form onSubmit={handleSaveCategory} className="space-y-4 pt-2">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 block">
              Category Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Smart Wearables"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus-ring"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => {
                setIsCreateModalOpen(false);
                setEditingCategory(null);
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
                : editingCategory
                ? "Update"
                : "Create"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Category Confirmation */}
      <ConfirmDialog
        isOpen={deletingCategoryId !== null}
        onClose={() => setDeletingCategoryId(null)}
        onConfirm={handleDeleteCategory}
        title="Delete Category?"
        description="Are you sure you want to delete this category? (Make sure no active products are assigned to it)."
        confirmText="Delete Category"
        cancelText="Cancel"
        variant="danger"
        isLoading={isSubmitting}
      />
    </div>
  );
}
