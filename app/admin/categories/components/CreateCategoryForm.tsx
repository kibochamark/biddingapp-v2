"use client";

import { useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { createCategory } from "../../actions/categories";
import { CategoryWithRelations } from "../../actions/categories";
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
import Image from "next/image";

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
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-hairline max-w-lg w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-hairline">
          <h3 className="text-xl font-bold text-ink">Create Category</h3>
          <Button variant="ghost" size="icon-sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Form */}
        <Formik
          initialValues={initialValues}
          validationSchema={createCategorySchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting: formikSubmitting, values, setFieldValue }) => (
            <Form className="p-6 space-y-4">
              {/* Name */}
              <div>
                <Label htmlFor="name" className="mb-2">
                  Category Name *
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

              {/* Slug */}
              <div>
                <Label htmlFor="slug" className="mb-2">
                  Slug *
                </Label>
                <Field
                  as={Input}
                  type="text"
                  id="slug"
                  name="slug"
                  placeholder="e.g., electronics, fashion, etc."
                />
                <ErrorMessage
                  name="slug"
                  component="div"
                  className="text-sale text-sm mt-1"
                />
                <p className="text-xs text-mute mt-1">
                  URL-friendly identifier (lowercase, numbers, hyphens only)
                </p>
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
                    {parentCategories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.icon && <Image alt={`${cat.name}`} width={40} height={40} className="text-lg" src={cat.icon as string}></Image>}
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
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Create Category
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
