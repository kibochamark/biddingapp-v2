"use client";

import { useState } from "react";
import { Plus, Edit, Trash2, FolderTree } from "lucide-react";
import { deleteCategory, CategoryWithRelations } from "../actions/categories";
import { useRouter } from "next/navigation";
import CreateCategoryForm from "./components/CreateCategoryForm";
import EditCategoryForm from "./components/EditCategoryForm";
import Image from "next/image";
import { toast } from "@/lib/toast";

interface CategoriesManagerProps {
  initialCategories: CategoryWithRelations[];
}

function DeleteConfirmModal({
  category,
  onConfirm,
  onCancel,
  isDeleting,
}: {
  category: CategoryWithRelations;
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
          {category._count && category._count.products > 0 && (
            <span className="block mt-2 text-destructive text-sm">
              Warning: This category has {category._count.products} products. They will need to be
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

export default function CategoriesManager({ initialCategories }: CategoriesManagerProps) {
  const router = useRouter();
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<CategoryWithRelations | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const categories = initialCategories;

  // Get all top-level categories for parent selection
  const topLevelCategories = categories.filter((cat) => !cat.parentId);

  const handleDeleteCategory = async () => {
    if (!deletingCategory) return;
    setIsDeleting(true);
    const result = await deleteCategory(deletingCategory.id);
    if (result.success) {
      toast.success("Category deleted successfully");
      setDeletingCategory(null);
      router.refresh();
    } else {
      toast.error(result.error || "Failed to delete category");
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
        {topLevelCategories.map((category) => (
          <div key={category.id} className="glass-card rounded-xl border border-border">
            {/* Parent Category */}
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  {category.icon ? (
                    <span className="text-2xl">{category.icon}</span>
                  ) : (
                    <FolderTree className="h-6 w-6 text-primary" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-xs text-muted-foreground">
                      {category._count?.products || 0} products
                    </span>
                    {category.children && category.children.length > 0 && (
                      <span className="text-xs text-muted-foreground">
                        {category.children.length} subcategories
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditingCategoryId(category.id)}
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
            {category.children && category.children.length > 0 && (
              <div className="border-t border-border bg-muted/20">
                <div className="p-4 space-y-2">
                  {category.children.map((subcat) => (
                    <div
                      key={subcat.id}
                      className="flex items-center justify-between p-3 bg-background rounded-lg border border-border"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-1 h-8 bg-primary/30 rounded-full"></div>
                        <div>
                          <div className="flex items-center gap-2">
                            {subcat.icon && <Image alt={`${subcat.name}`}width={100} height={100} className="text-lg" src={subcat.icon as string}></Image>}
                            <p className="text-sm font-medium text-foreground">{subcat.name}</p>
                          </div>
                          <div className="flex items-center gap-3 mt-1">
                            <p className="text-xs text-muted-foreground">{subcat.description}</p>
                            <span className="text-xs text-muted-foreground">
                              • {subcat._count?.products || 0} products
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingCategoryId(subcat.id)}
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

      {/* Create Modal */}
      {showCreateModal && (
        <CreateCategoryForm
          parentCategories={topLevelCategories}
          onClose={() => {
            setShowCreateModal(false);
            router.refresh();
          }}
        />
      )}

      {/* Edit Modal */}
      {editingCategoryId && (
        <EditCategoryForm
          categoryId={editingCategoryId}
          parentCategories={topLevelCategories}
          onClose={() => {
            setEditingCategoryId(null);
            router.refresh();
          }}
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
