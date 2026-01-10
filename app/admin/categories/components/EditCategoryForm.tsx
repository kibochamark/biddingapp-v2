"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { updateCategory, getCategoryById, CategoryWithRelations } from "../../actions/categories";
import { X, Save, Loader } from "lucide-react";
import { toast } from "sonner";

interface EditCategoryFormProps {
  categoryId: string;
  parentCategories: CategoryWithRelations[];
  onClose: () => void;
}

interface CategoryFormValues {
  name: string;
  description: string;
  icon: string;
  parentId: string;
}

const updateCategorySchema = Yup.object({
  name: Yup.string(),
  description: Yup.string(),
  icon: Yup.string(),
  parentId: Yup.string().uuid("Invalid parent category"),
});

export default function EditCategoryForm({
  categoryId,
  parentCategories,
  onClose,
}: EditCategoryFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [category, setCategory] = useState<CategoryWithRelations | null>(null);

  useEffect(() => {
    const fetchCategory = async () => {
      setIsLoading(true);
      const result = await getCategoryById(categoryId);
      if (result.success && result.data) {
        setCategory(result.data);
      } else {
        toast.error(result.error || "Failed to fetch category");
        onClose();
      }
      setIsLoading(false);
    };

    fetchCategory();
  }, [categoryId, onClose]);

  const handleSubmit = async (values: CategoryFormValues) => {
    setIsSubmitting(true);
    try {
      const categoryData: {
        name?: string;
        description?: string;
        icon?: string;
        parentId?: string | null;
      } = {};

      // Only include changed fields
      if (values.name && values.name !== category?.name) {
        categoryData.name = values.name;
      }
      if (values.description !== category?.description) {
        categoryData.description = values.description || undefined;
      }
      if (values.icon !== category?.icon) {
        categoryData.icon = values.icon || undefined;
      }
      if (values.parentId !== (category?.parentId || "")) {
        categoryData.parentId = values.parentId || null;
      }

      const result = await updateCategory(categoryId, categoryData);

      if (result.success) {
        toast.success("Category updated successfully!");
        onClose();
        router.refresh();
      } else {
        toast.error(result.error || "Failed to update category");
      }
    } catch (error) {
      toast.error("An error occurred while updating category");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-card rounded-xl border border-border max-w-lg w-full p-12 flex flex-col items-center justify-center">
          <Loader className="h-12 w-12 text-primary animate-spin mb-4" />
          <p className="text-muted-foreground">Loading category...</p>
        </div>
      </div>
    );
  }

  if (!category) {
    return null;
  }

  const initialValues: CategoryFormValues = {
    name: category.name,
    description: category.description || "",
    icon: category.icon || "",
    parentId: category.parentId || "",
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-xl border border-border max-w-lg w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h3 className="text-xl font-bold text-foreground">Edit Category</h3>
            <p className="text-xs text-muted-foreground mt-1">Slug: {category.slug}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <Formik
          initialValues={initialValues}
          validationSchema={updateCategorySchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting: formikSubmitting }) => (
            <Form className="p-6 space-y-4">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                  Category Name
                </label>
                <Field
                  type="text"
                  id="name"
                  name="name"
                  placeholder="e.g., Electronics, Fashion, etc."
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-destructive text-sm mt-1"
                />
              </div>

              {/* Icon */}
              <div>
                <label htmlFor="icon" className="block text-sm font-medium text-foreground mb-2">
                  Icon (Emoji)
                </label>
                <Field
                  type="text"
                  id="icon"
                  name="icon"
                  placeholder="e.g., 📱, 👕, 🏠"
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                />
                <ErrorMessage
                  name="icon"
                  component="div"
                  className="text-destructive text-sm mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Optional emoji to represent this category
                </p>
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">
                  Description
                </label>
                <Field
                  as="textarea"
                  id="description"
                  name="description"
                  placeholder="Brief description of this category..."
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring text-sm resize-none"
                  rows={3}
                />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="text-destructive text-sm mt-1"
                />
              </div>

              {/* Parent Category */}
              <div>
                <label htmlFor="parentId" className="block text-sm font-medium text-foreground mb-2">
                  Parent Category
                </label>
                <Field
                  as="select"
                  id="parentId"
                  name="parentId"
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                >
                  <option value="">None (Top Level)</option>
                  {parentCategories
                    .filter((cat) => cat.id !== categoryId)
                    .map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.icon && `${cat.icon} `}
                        {cat.name}
                      </option>
                    ))}
                </Field>
                <ErrorMessage
                  name="parentId"
                  component="div"
                  className="text-destructive text-sm mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Select a parent to make this a subcategory
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting || formikSubmitting}
                  className="px-4 py-2 border border-border rounded-lg hover:bg-accent transition-all text-sm font-medium disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || formikSubmitting}
                  className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-primary to-orange-600 text-white rounded-lg hover:from-primary/90 hover:to-orange-600/90 transition-all text-sm font-medium disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
