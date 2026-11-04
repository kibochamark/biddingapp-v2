"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { updateCategory, getCategoryById, CategoryWithRelations } from "../../actions/categories";
import { X, Save, Loader, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EditCategoryFormProps {
  categoryId: string;
  parentCategories: CategoryWithRelations[];
  onClose: () => void;
}

interface CategoryFormValues {
  name: string;
  description: string;
  parentId: string;
}

const updateCategorySchema = Yup.object({
  name: Yup.string(),
  description: Yup.string(),
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
  const [iconFile, setIconFile] = useState<File | null>(null);

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

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.currentTarget.files) {
      setIconFile(event.currentTarget.files[0]);
    }
  };

  const handleSubmit = async (values: CategoryFormValues) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();

      // Only include changed fields
      if (values.name && values.name !== category?.name) {
        formData.append("name", values.name);
      }
      if (values.description !== category?.description) {
        formData.append("description", values.description || "");
      }
      if (values.parentId !== (category?.parentId || "")) {
        formData.append("parentId", values.parentId || "");
      }
      if (iconFile) {
        formData.append("file", iconFile);
      }

      const result = await updateCategory(categoryId, formData);

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
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-card border border-hairline max-w-lg w-full p-12 flex flex-col items-center justify-center">
          <Loader className="h-12 w-12 text-ink animate-spin mb-4" />
          <p className="text-mute">Loading category...</p>
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
    parentId: category.parentId || "",
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-hairline max-w-lg w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-hairline">
          <div>
            <h3 className="text-xl font-bold text-ink">Edit Category</h3>
            <p className="text-xs text-mute mt-1">Slug: {category.slug}</p>
          </div>
          <Button variant="ghost" size="icon-sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Form */}
        <Formik
          initialValues={initialValues}
          validationSchema={updateCategorySchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting: formikSubmitting, values, setFieldValue }) => (
            <Form className="p-6 space-y-4">
              {/* Name */}
              <div>
                <Label htmlFor="name" className="mb-2">
                  Category Name
                </Label>
                <Field
                  as={Input}
                  type="text"
                  id="name"
                  name="name"
                  placeholder="e.g., Electronics, Fashion, etc."
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-sale text-sm mt-1"
                />
              </div>

              {/* Icon */}
              <div>
                <Label htmlFor="icon-upload" className="mb-2">
                  Icon
                </Label>
                <div className="flex items-center gap-4">
                  <label
                    htmlFor="icon-upload"
                    className="cursor-pointer w-full h-12 rounded-full bg-soft-cloud px-5 text-sm flex items-center gap-2"
                  >
                    <Upload className="h-4 w-4 text-mute" />
                    <span className="text-mute">
                      {iconFile ? iconFile.name : (category.icon ? "Replace image" : "Upload an image")}
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
                {category.icon && !iconFile && (
                  <div className="mt-2">
                    <img src={category.icon} alt={category.name} className="h-16 w-16 object-cover" />
                  </div>
                )}
                <p className="text-xs text-mute mt-1">
                  Optional image to represent this category
                </p>
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description" className="mb-2">
                  Description
                </Label>
                <Field
                  as={Textarea}
                  id="description"
                  name="description"
                  placeholder="Brief description of this category..."
                  rows={3}
                />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="text-sale text-sm mt-1"
                />
              </div>

              {/* Parent Category */}
              <div>
                <Label htmlFor="parentId" className="mb-2">
                  Parent Category
                </Label>
                <Select
                  value={values.parentId || "none"}
                  onValueChange={(value) =>
                    setFieldValue("parentId", value === "none" ? "" : value)
                  }
                >
                  <SelectTrigger id="parentId" className="w-full bg-soft-cloud">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None (Top Level)</SelectItem>
                    {parentCategories
                      .filter((cat) => cat.id !== categoryId)
                      .map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.icon && `${cat.icon} `}
                          {cat.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <ErrorMessage
                  name="parentId"
                  component="div"
                  className="text-sale text-sm mt-1"
                />
                <p className="text-xs text-mute mt-1">
                  Select a parent to make this a subcategory
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isSubmitting || formikSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting || formikSubmitting}>
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
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
