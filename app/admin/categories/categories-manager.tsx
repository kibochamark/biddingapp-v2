"use client";

import { useState } from "react";
import { Plus, Edit, Trash2, FolderTree } from "lucide-react";
import { deleteCategory, CategoryWithRelations } from "../actions/categories";
import { useRouter } from "next/navigation";
import CreateCategoryForm from "./components/CreateCategoryForm";
import EditCategoryForm from "./components/EditCategoryForm";
import Image from "next/image";
import { toast } from "@/lib/toast";
import { Button } from "@/components/ui/button";

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
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-card shadow-overlay max-w-md w-full p-6">
        <h3 className="text-xl font-bold text-ink mb-2">Delete Category</h3>
        <p className="text-mute mb-6">
          Are you sure you want to delete "<strong>{category.name}</strong>"?
          {category._count && category._count.products > 0 && (
            <span className="block mt-2 text-sale text-sm">
              Warning: This category has {category._count.products} products. They will need to be
              reassigned.
            </span>
          )}
        </p>
        <div className="flex items-center justify-end gap-3">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isDeleting}>
            Cancel
          </Button>
          <Button type="button" variant="destructive" onClick={onConfirm} disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
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

  console.log("Initial categories:", categories);

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
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="h-5 w-5" />
          Add Category
        </Button>
      </div>

      {/* Categories List — one continuous list, single divider between rows */}
      {categories.length === 0 ? (
        <div className="p-12 text-center">
          <FolderTree className="h-12 w-12 text-mute mx-auto mb-4" />
          <p className="text-lg font-medium text-ink mb-2">No Categories Yet</p>
          <p className="text-sm text-mute mb-6">
            Create your first category to organize products
          </p>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4" />
            Add Category
          </Button>
        </div>
      ) : (
      <div className="   ">
        {topLevelCategories.map((category) => (
          <div key={category.id} className="bg-background">
            {/* Parent Category */}
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-soft-cloud">
                  {category.icon ? (
                    <Image alt={`${category.name}`} width={100} height={100} className="text-lg" src={category.icon as string}></Image>
                    // <span className="text-2xl">{category.icon}</span>
                  ) : (
                    <FolderTree className="h-6 w-6 text-ink" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-ink">{category.name}</h3>
                  <p className="text-sm text-mute">{category.description}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-xs text-mute">
                      {category._count?.products || 0} products
                    </span>
                    {category.children && category.children.length > 0 && (
                      <span className="text-xs text-mute">
                        {category.children.length} subcategories
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setEditingCategoryId(category.id)}
                  title="Edit"
                >
                  <Edit className="h-4 w-4 text-mute" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setDeletingCategory(category)}
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4 text-sale" />
                </Button>
              </div>
            </div>

            {/* Subcategories */}
            {category.children && category.children.length > 0 && (
              <div className="  bg-soft-cloud">
                <div className=" ">
                  {category.children.map((subcat) => (
                    <div
                      key={subcat.id}
                      className="flex items-center justify-between p-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-1 h-8 bg-hairline rounded-full"></div>
                        <div>
                          <div className="flex items-center gap-2">
                            {subcat.icon && <Image alt={`${subcat.name}`}width={100} height={100} className="text-lg" src={subcat.icon as string}></Image>}
                            <p className="text-sm font-medium text-ink">{subcat.name}</p>
                          </div>
                          <div className="flex items-center gap-3 mt-1">
                            <p className="text-xs text-mute">{subcat.description}</p>
                            <span className="text-xs text-mute">
                              • {subcat._count?.products || 0} products
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => setEditingCategoryId(subcat.id)}
                          title="Edit"
                        >
                          <Edit className="h-4 w-4 text-mute" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => setDeletingCategory(subcat)}
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4 text-sale" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      )}

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
