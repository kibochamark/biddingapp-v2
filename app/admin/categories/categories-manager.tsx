"use client";

import { useState } from "react";
import { Plus, Edit, Trash2, FolderTree, X, Save } from "lucide-react";
import { createCategory, updateCategory, deleteCategory } from "../actions/categories";
import { useRouter } from "next/navigation";

// Mock data - replace with real data from server
const mockCategories = [
  {
    id: "cat_1",
    name: "Electronics",
    description: "Electronic devices and gadgets",
    parentId: null,
    productCount: 145,
    subcategories: [
      {
        id: "cat_2",
        name: "Smartphones",
        description: "Mobile phones and accessories",
        parentId: "cat_1",
        productCount: 67,
      },
      {
        id: "cat_3",
        name: "Laptops",
        description: "Notebooks and portable computers",
        parentId: "cat_1",
        productCount: 45,
      },
      {
        id: "cat_4",
        name: "Tablets",
        description: "Tablet devices",
        parentId: "cat_1",
        productCount: 33,
      },
    ],
  },
  {
    id: "cat_5",
    name: "Fashion",
    description: "Clothing and accessories",
    parentId: null,
    productCount: 89,
    subcategories: [
      {
        id: "cat_6",
        name: "Men's Clothing",
        description: "Apparel for men",
        parentId: "cat_5",
        productCount: 45,
      },
      {
        id: "cat_7",
        name: "Women's Clothing",
        description: "Apparel for women",
        parentId: "cat_5",
        productCount: 44,
      },
    ],
  },
  {
    id: "cat_8",
    name: "Home & Garden",
    description: "Home decor and garden items",
    parentId: null,
    productCount: 56,
    subcategories: [],
  },
];

interface CategoryFormData {
  name: string;
  description: string;
  parentId: string | null;
}

function CategoryFormModal({
  category,
  parentCategories,
  onSave,
  onCancel,
  isSaving,
}: {
  category?: any;
  parentCategories: any[];
  onSave: (data: CategoryFormData) => void;
  onCancel: () => void;
  isSaving: boolean;
}) {
  const [formData, setFormData] = useState<CategoryFormData>({
    name: category?.name || "",
    description: category?.description || "",
    parentId: category?.parentId || null,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert("Category name is required");
      return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-xl border border-border max-w-lg w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h3 className="text-xl font-bold text-foreground">
            {category ? "Edit Category" : "Create Category"}
          </h3>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Category Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Electronics, Fashion, etc."
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of this category..."
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring text-sm resize-none"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Parent Category
            </label>
            <select
              value={formData.parentId || ""}
              onChange={(e) =>
                setFormData({ ...formData, parentId: e.target.value || null })
              }
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring text-sm"
            >
              <option value="">None (Top Level)</option>
              {parentCategories
                .filter((cat) => cat.id !== category?.id)
                .map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
            </select>
            <p className="text-xs text-muted-foreground mt-1">
              Select a parent to make this a subcategory
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              disabled={isSaving}
              className="px-4 py-2 border border-border rounded-lg hover:bg-accent transition-all text-sm font-medium disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all text-sm font-medium disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {isSaving ? "Saving..." : "Save Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DeleteConfirmModal({
  category,
  onConfirm,
  onCancel,
  isDeleting,
}: {
  category: any;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-xl border border-border max-w-md w-full p-6">
        <h3 className="text-xl font-bold text-foreground mb-2">Delete Category</h3>
        <p className="text-muted-foreground mb-6">
          Are you sure you want to delete "<strong>{category.name}</strong>"?
          {category.productCount > 0 && (
            <span className="block mt-2 text-destructive text-sm">
              Warning: This category has {category.productCount} products. They will need to be
              reassigned.
            </span>
          )}
        </p>
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="px-4 py-2 border border-border rounded-lg hover:bg-accent transition-all text-sm font-medium disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-all text-sm font-medium disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CategoriesManager() {
  const router = useRouter();
  const [categories] = useState(mockCategories);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [deletingCategory, setDeletingCategory] = useState<any>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Get all top-level categories for parent selection
  const topLevelCategories = categories.filter((cat) => !cat.parentId);

  const handleSaveCategory = async (data: CategoryFormData) => {
    setIsSaving(true);
    let result;

    if (editingCategory) {
      result = await updateCategory(editingCategory.id, data);
    } else {
      result = await createCategory(data);
    }

    if (result.success) {
      setEditingCategory(null);
      setShowCreateModal(false);
      router.refresh();
    } else {
      alert(result.error);
    }
    setIsSaving(false);
  };

  const handleDeleteCategory = async () => {
    if (!deletingCategory) return;
    setIsDeleting(true);
    const result = await deleteCategory(deletingCategory.id);
    if (result.success) {
      setDeletingCategory(null);
      router.refresh();
    } else {
      alert(result.error);
    }
    setIsDeleting(false);
  };

  return (
    <div className="space-y-4">
      {/* Actions */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-linear-to-r from-primary to-orange-600 text-white rounded-lg hover:from-primary/90 hover:to-orange-600/90 transition-all text-sm font-medium shadow-md hover:shadow-lg"
        >
          <Plus className="h-5 w-5" />
          Add Category
        </button>
      </div>

      {/* Categories List */}
      <div className="space-y-4">
        {categories.map((category) => (
          <div key={category.id} className="glass-card rounded-xl border border-border">
            {/* Parent Category */}
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <FolderTree className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-xs text-muted-foreground">
                      {category.productCount} products
                    </span>
                    {category.subcategories && category.subcategories.length > 0 && (
                      <span className="text-xs text-muted-foreground">
                        {category.subcategories.length} subcategories
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditingCategory(category)}
                  className="p-2 hover:bg-accent rounded-lg transition-colors"
                  title="Edit"
                >
                  <Edit className="h-4 w-4 text-muted-foreground" />
                </button>
                <button
                  onClick={() => setDeletingCategory(category)}
                  className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </button>
              </div>
            </div>

            {/* Subcategories */}
            {category.subcategories && category.subcategories.length > 0 && (
              <div className="border-t border-border bg-muted/20">
                <div className="p-4 space-y-2">
                  {category.subcategories.map((subcat) => (
                    <div
                      key={subcat.id}
                      className="flex items-center justify-between p-3 bg-background rounded-lg border border-border"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-1 h-8 bg-primary/30 rounded-full"></div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{subcat.name}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <p className="text-xs text-muted-foreground">{subcat.description}</p>
                            <span className="text-xs text-muted-foreground">
                              • {subcat.productCount} products
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingCategory(subcat)}
                          className="p-2 hover:bg-accent rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4 text-muted-foreground" />
                        </button>
                        <button
                          onClick={() => setDeletingCategory(subcat)}
                          className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        {categories.length === 0 && (
          <div className="glass-card rounded-xl border border-border p-12 text-center">
            <FolderTree className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium text-foreground mb-2">No Categories Yet</p>
            <p className="text-sm text-muted-foreground mb-6">
              Create your first category to organize products
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all text-sm font-medium"
            >
              <Plus className="h-4 w-4" />
              Add Category
            </button>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {(showCreateModal || editingCategory) && (
        <CategoryFormModal
          category={editingCategory}
          parentCategories={topLevelCategories}
          onSave={handleSaveCategory}
          onCancel={() => {
            setShowCreateModal(false);
            setEditingCategory(null);
          }}
          isSaving={isSaving}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingCategory && (
        <DeleteConfirmModal
          category={deletingCategory}
          onConfirm={handleDeleteCategory}
          onCancel={() => setDeletingCategory(null)}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}
