"use client";

import { useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { createCategory } from "../../actions/categories";
import { CategoryWithRelations } from "../../actions/categories";
import { X, Save, Loader, Upload } from "lucide-react";
import { toast } from "sonner";

interface CreateCategoryFormProps {
  parentCategories: CategoryWithRelations[];
  onClose: () => void;
}

interface CategoryFormValues {
  slug: string;
  name: string;
  description: string;
  parentId: string;
}

const createCategorySchema = Yup.object({
  slug: Yup.string()
    .required("Slug is required")
    .matches(
      /^[a-z0-9-]+$/,
      "Slug must contain only lowercase letters, numbers, and hyphens"
    ),
  name: Yup.string().required("Name is required"),
  description: Yup.string(),
  parentId: Yup.string().uuid("Invalid parent category"),
});

export default function CreateCategoryForm({
  parentCategories,
  onClose,
}: CreateCategoryFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [iconFile, setIconFile] = useState<File | null>(null);

  const initialValues: CategoryFormValues = {
    slug: "",
    name: "",
    description: "",
    parentId: "",
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.currentTarget.files) {
      setIconFile(event.currentTarget.files[0]);
    }
  };

  const handleSubmit = async (values: CategoryFormValues) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("slug", values.slug);
      formData.append("name", values.name);
      if (values.description) {
        formData.append("description", values.description);
      }
      if (values.parentId) {
        formData.append("parentId", values.parentId);
      }
      if (iconFile) {
        formData.append("file", iconFile);
      }

      const result = await createCategory(formData);

      if (result.success) {
        toast.success("Category created successfully!");
        onClose();
        router.refresh();
      } else {
        toast.error(result.error || "Failed to create category");
      }
    } catch (error) {
      toast.error("An error occurred while creating category");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-xl border border-border max-w-lg w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h3 className="text-xl font-bold text-foreground">Create Category</h3>
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
          validationSchema={createCategorySchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting: formikSubmitting }) => (
            <Form className="p-6 space-y-4">
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Category Name *
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

              {/* Slug */}
              <div>
                <label
                  htmlFor="slug"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Slug *
                </label>
                <Field
                  type="text"
                  id="slug"
                  name="slug"
                  placeholder="e.g., electronics, fashion, etc."
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                />
                <ErrorMessage
                  name="slug"
                  component="div"
                  className="text-destructive text-sm mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  URL-friendly identifier (lowercase, numbers, hyphens only)
                </p>
              </div>

              {/* Icon */}
              <div>
                <label
                  htmlFor="icon"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Icon
                </label>
                <div className="flex items-center gap-4">
                  <label
                    htmlFor="icon-upload"
                    className="cursor-pointer w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring text-sm flex items-center gap-2"
                  >
                    <Upload className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {iconFile ? iconFile.name : "Upload an image"}
                    </span>
                  </label>
                  <input
                    type="file"
                    id="icon-upload"
                    name="icon"
                    className="hidden"
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Optional image to represent this category
                </p>
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-foreground mb-2"
                >
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
                <label
                  htmlFor="parentId"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Parent Category
                </label>
                <Field
                  as="select"
                  id="parentId"
                  name="parentId"
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                >
                  <option value="">None (Top Level)</option>
                  {parentCategories.map((cat) => (
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
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Create Category
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
