"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { updateProduct } from "../../actions/products";
import { Product, ProductCondition } from "@/lib/types";
import { Loader, Save } from "lucide-react";
import ProductImageUpload from "./ProductImageUpload";
import { toast } from "sonner";

interface EditProductFormProps {
  product: Product;
}

interface ProductFormValues {
  title: string;
  description: string;
  condition: ProductCondition;
  retailValue: number;
  endDate: string;
  sellerName: string;
  specifications: string;
  isActive: boolean;
}

const productValidationSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  condition: Yup.string()
    .oneOf(["NEW", "MINT", "EXCELLENT", "GOOD", "FAIR"])
    .required("Condition is required"),
  reservePrice: Yup.number().min(0, "Price must be positive"),
  buyNowPrice: Yup.number().min(0, "Price must be positive"),
  endDate: Yup.string().required("End date is required"),
  sellerName: Yup.string().required("Seller name is required"),
  specifications: Yup.string(),
  isActive: Yup.boolean(),
});

export default function EditProductForm({ product }: EditProductFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Format date for datetime-local input
  const formatDateForInput = (date: Date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const initialValues: ProductFormValues = {
    title: product.title,
    description: product.description,
    condition: product.condition,
    retailValue: product.retailValue|| 0,
    endDate: formatDateForInput(product.endDate),
    sellerName: product.sellerName,
    specifications: JSON.stringify(product.specifications, null, 2),
    isActive: product.isActive,
  };

  const handleSubmit = async (values: ProductFormValues) => {
    setIsSubmitting(true);
    try {
      let specifications: Record<string, any> = {};
      try {
        specifications = JSON.parse(values.specifications || "{}");
      } catch (e) {
        toast.error("Invalid specifications format. Must be valid JSON.");
        setIsSubmitting(false);
        return;
      }

      const result = await updateProduct(product.id, {
        title: values.title,
        description: values.description,
        condition: values.condition,
        retailValue: values.retailValue,
        endDate: values.endDate,
        sellerName: values.sellerName,
        specifications,
        isActive: values.isActive,
      });

      if (result.success) {
        toast.success("Product updated successfully!");
        router.push("/admin/products");
      } else {
        toast.error(result.error || "Failed to update product");
      }
    } catch (error) {
      toast.error("An error occurred while updating the product");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Product Details Form */}
      <div className="glass-card rounded-xl border border-border p-6">
        <h2 className="text-xl font-bold mb-6">Product Information</h2>
        <Formik
          initialValues={initialValues}
          validationSchema={productValidationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting: formikSubmitting }) => (
            <Form className="space-y-6">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium mb-2">
                  Product Title *
                </label>
                <Field
                  type="text"
                  id="title"
                  name="title"
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter product title"
                />
                <ErrorMessage
                  name="title"
                  component="div"
                  className="text-destructive text-sm mt-1"
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-2">
                  Description *
                </label>
                <Field
                  as="textarea"
                  id="description"
                  name="description"
                  rows={4}
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter product description"
                />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="text-destructive text-sm mt-1"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Condition */}
                <div>
                  <label htmlFor="condition" className="block text-sm font-medium mb-2">
                    Condition *
                  </label>
                  <Field
                    as="select"
                    id="condition"
                    name="condition"
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="NEW">New</option>
                    <option value="MINT">Mint</option>
                    <option value="EXCELLENT">Excellent</option>
                    <option value="GOOD">Good</option>
                    <option value="FAIR">Fair</option>
                  </Field>
                  <ErrorMessage
                    name="condition"
                    component="div"
                    className="text-destructive text-sm mt-1"
                  />
                </div>

                {/* Active Status */}
                <div>
                  <label htmlFor="isActive" className="block text-sm font-medium mb-2">
                    Status
                  </label>
                  <div className="flex items-center gap-3 h-[42px]">
                    <Field
                      type="checkbox"
                      id="isActive"
                      name="isActive"
                      className="w-5 h-5 rounded border-border text-primary focus:ring-2 focus:ring-ring"
                    />
                    <label htmlFor="isActive" className="text-sm cursor-pointer">
                      Product is active
                    </label>
                  </div>
                </div>
              </div>

              {/* Seller Name */}
              <div>
                <label htmlFor="sellerName" className="block text-sm font-medium mb-2">
                  Seller Name *
                </label>
                <Field
                  type="text"
                  id="sellerName"
                  name="sellerName"
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter seller name"
                />
                <ErrorMessage
                  name="sellerName"
                  component="div"
                  className="text-destructive text-sm mt-1"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Reserve Price */}
                <div>
                  <label htmlFor="retailValue" className="block text-sm font-medium mb-2">
                    Reserve Price
                  </label>
                  <Field
                    type="number"
                    id="retailValue"
                    name="retailValue"
                    step="0.01"
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="0.00"
                  />
                  <ErrorMessage
                    name="retailValue"
                    component="div"
                    className="text-destructive text-sm mt-1"
                  />
                </div>

              </div>

              {/* End Date */}
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium mb-2">
                  Auction End Date *
                </label>
                <Field
                  type="datetime-local"
                  id="endDate"
                  name="endDate"
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <ErrorMessage
                  name="endDate"
                  component="div"
                  className="text-destructive text-sm mt-1"
                />
              </div>

              {/* Specifications */}
              <div>
                <label htmlFor="specifications" className="block text-sm font-medium mb-2">
                  Specifications (JSON)
                </label>
                <Field
                  as="textarea"
                  id="specifications"
                  name="specifications"
                  rows={4}
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring font-mono text-sm"
                  placeholder='{"brand": "Apple", "model": "iPhone 15"}'
                />
                <ErrorMessage
                  name="specifications"
                  component="div"
                  className="text-destructive text-sm mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Enter specifications as a JSON object
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => router.push("/admin/products")}
                  className="px-6 py-2.5 border border-border rounded-lg hover:bg-accent transition-all text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || formikSubmitting}
                  className="flex items-center gap-2 px-6 py-2.5 bg-linear-to-r from-primary to-orange-600 text-white rounded-lg hover:from-primary/90 hover:to-orange-600/90 transition-all text-sm font-medium disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>

      {/* Image Management */}
      <div className="glass-card rounded-xl border border-border p-6">
        <h2 className="text-xl font-bold mb-6">Product Images</h2>
        <ProductImageUpload
          productId={product.id}
          existingImages={product.images}
        />
      </div>
    </div>
  );
}
