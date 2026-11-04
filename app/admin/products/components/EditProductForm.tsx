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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
      <div>
        <h2 className="text-xl font-bold mb-6 text-ink">Product Information</h2>
        <Formik
          initialValues={initialValues}
          validationSchema={productValidationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting: formikSubmitting, values, setFieldValue }) => (
            <Form className="space-y-6">
              {/* Title */}
              <div>
                <Label htmlFor="title" className="mb-2">
                  Product Title *
                </Label>
                <Field
                  as={Input}
                  type="text"
                  id="title"
                  name="title"
                  placeholder="Enter product title"
                />
                <ErrorMessage
                  name="title"
                  component="div"
                  className="text-sale text-sm mt-1"
                />
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description" className="mb-2">
                  Description *
                </Label>
                <Field
                  as={Textarea}
                  id="description"
                  name="description"
                  rows={4}
                  placeholder="Enter product description"
                />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="text-sale text-sm mt-1"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Condition */}
                <div>
                  <Label htmlFor="condition" className="mb-2">
                    Condition *
                  </Label>
                  <Select
                    value={values.condition}
                    onValueChange={(value) => setFieldValue("condition", value)}
                  >
                    <SelectTrigger id="condition" className="w-full bg-soft-cloud">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NEW">New</SelectItem>
                      <SelectItem value="MINT">Mint</SelectItem>
                      <SelectItem value="EXCELLENT">Excellent</SelectItem>
                      <SelectItem value="GOOD">Good</SelectItem>
                      <SelectItem value="FAIR">Fair</SelectItem>
                    </SelectContent>
                  </Select>
                  <ErrorMessage
                    name="condition"
                    component="div"
                    className="text-sale text-sm mt-1"
                  />
                </div>

                {/* Active Status */}
                <div>
                  <Label htmlFor="isActive" className="mb-2">
                    Status
                  </Label>
                  <div className="flex items-center gap-3 h-12">
                    <Field
                      as={Checkbox}
                      type="checkbox"
                      id="isActive"
                      name="isActive"
                    />
                    <label htmlFor="isActive" className="text-sm text-ink cursor-pointer">
                      Product is active
                    </label>
                  </div>
                </div>
              </div>

              {/* Seller Name */}
              <div>
                <Label htmlFor="sellerName" className="mb-2">
                  Seller Name *
                </Label>
                <Field
                  as={Input}
                  type="text"
                  id="sellerName"
                  name="sellerName"
                  placeholder="Enter seller name"
                />
                <ErrorMessage
                  name="sellerName"
                  component="div"
                  className="text-sale text-sm mt-1"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Reserve Price */}
                <div>
                  <Label htmlFor="retailValue" className="mb-2">
                    Reserve Price
                  </Label>
                  <Field
                    as={Input}
                    type="number"
                    id="retailValue"
                    name="retailValue"
                    step="0.01"
                    placeholder="0.00"
                  />
                  <ErrorMessage
                    name="retailValue"
                    component="div"
                    className="text-sale text-sm mt-1"
                  />
                </div>

              </div>

              {/* End Date */}
              <div>
                <Label htmlFor="endDate" className="mb-2">
                  Auction End Date *
                </Label>
                <Field
                  as={Input}
                  type="datetime-local"
                  id="endDate"
                  name="endDate"
                />
                <ErrorMessage
                  name="endDate"
                  component="div"
                  className="text-sale text-sm mt-1"
                />
              </div>

              {/* Specifications */}
              <div>
                <Label htmlFor="specifications" className="mb-2">
                  Specifications (JSON)
                </Label>
                <Field
                  as={Textarea}
                  id="specifications"
                  name="specifications"
                  rows={4}
                  className="font-mono text-sm"
                  placeholder='{"brand": "Apple", "model": "iPhone 15"}'
                />
                <ErrorMessage
                  name="specifications"
                  component="div"
                  className="text-sale text-sm mt-1"
                />
                <p className="text-xs text-mute mt-1">
                  Enter specifications as a JSON object
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-3 pt-4  ">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/admin/products")}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting || formikSubmitting}>
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
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>

      {/* Image Management */}
      <div className="pt-6  ">
        <h2 className="text-xl font-bold mb-6 text-ink">Product Images</h2>
        <ProductImageUpload
          productId={product.id}
          existingImages={product.images}
        />
      </div>
    </div>
  );
}
