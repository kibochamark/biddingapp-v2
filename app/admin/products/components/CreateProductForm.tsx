"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { createProduct, getCurrentUserId } from "../../actions/products";
import { ProductCondition } from "@/lib/types";
import { Loader, ChevronLeft, ChevronRight } from "lucide-react";
import ProductImageUpload from "./ProductImageUpload";
import CategorySelector from "./CategorySelector";
import { toast } from "sonner";

interface ProductFormValues {
  title: string;
  description: string;
  categoryId: string;
  condition: ProductCondition;
  startingPrice: number;
  reservePrice: number;
  buyNowPrice: number;
  endDate: string;
  sellerName: string;
  specifications: string;
}

const productValidationSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  categoryId: Yup.string().required("Category is required"),
  condition: Yup.string()
    .oneOf(["NEW", "MINT", "EXCELLENT", "GOOD", "FAIR"])
    .required("Condition is required"),
  startingPrice: Yup.number()
    .min(0, "Price must be positive")
    .required("Starting price is required"),
  reservePrice: Yup.number().min(0, "Price must be positive"),
  buyNowPrice: Yup.number().min(0, "Price must be positive"),
  endDate: Yup.string().required("End date is required"),
  sellerName: Yup.string().required("Seller name is required"),
  specifications: Yup.string(),
});

export default function CreateProductForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [createdProductId, setCreatedProductId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialValues: ProductFormValues = {
    title: "",
    description: "",
    categoryId: "",
    condition: "NEW",
    startingPrice: 0,
    reservePrice: 0,
    buyNowPrice: 0,
    endDate: "",
    sellerName: "",
    specifications: "{}",
  };

  const handleProductSubmit = async (values: ProductFormValues) => {
    setIsSubmitting(true);
    try {
      // Get current user ID
      const userResult = await getCurrentUserId();
      if (!userResult.success || !userResult.userId) {
        toast.error(userResult.error || "Failed to get user information");
        setIsSubmitting(false);
        return;
      }

      let specifications: Record<string, any> = {};
      try {
        specifications = JSON.parse(values.specifications || "{}");
      } catch (e) {
        toast.error("Invalid specifications format. Must be valid JSON.");
        setIsSubmitting(false);
        return;
      }

      const result = await createProduct({
        title: values.title,
        description: values.description,
        categoryId: values.categoryId,
        condition: values.condition,
        startingPrice: values.startingPrice,
        reservePrice: values.reservePrice,
        buyNowPrice: values.buyNowPrice,
        endDate: values.endDate,
        sellerId: userResult.userId,
        sellerName: values.sellerName,
        specifications,
      });

      if (result.success && result.data) {
        toast.success("Product created successfully!");
        setCreatedProductId(result.data.id);
        setCurrentStep(2);
      } else {
        toast.error(result.error || "Failed to create product");
      }
    } catch (error) {
      toast.error("An error occurred while creating the product");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleComplete = () => {
    toast.success("Product created successfully with images!");
    router.push("/admin/products");
  };

  return (
    <div className="max-w-4xl">
      {/* Step Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full ${
                currentStep >= 1
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              1
            </div>
            <span className="text-sm font-medium">Product Details</span>
          </div>
          <div className="flex-1 h-1 mx-4 bg-muted">
            <div
              className={`h-full transition-all ${
                currentStep >= 2 ? "bg-primary" : "bg-muted"
              }`}
              style={{ width: currentStep >= 2 ? "100%" : "0%" }}
            />
          </div>
          <div className="flex items-center space-x-4">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full ${
                currentStep >= 2
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              2
            </div>
            <span className="text-sm font-medium">Upload Images</span>
          </div>
        </div>
      </div>

      {/* Step 1: Product Details Form */}
      {currentStep === 1 && (
        <div className="glass-card rounded-xl border border-border p-6">
          <h2 className="text-xl font-bold mb-6">Product Information</h2>
          <Formik
            initialValues={initialValues}
            validationSchema={productValidationSchema}
            onSubmit={handleProductSubmit}
          >
            {({ isSubmitting: formikSubmitting, setFieldValue, values, errors, touched }) => (
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
                  {/* Category */}
                  <div>
                    <label htmlFor="categoryId" className="block text-sm font-medium mb-2">
                      Category *
                    </label>
                    <CategorySelector
                      value={values.categoryId}
                      onChange={(categoryId) => setFieldValue("categoryId", categoryId)}
                      error={touched.categoryId && errors.categoryId ? errors.categoryId : undefined}
                    />
                    <ErrorMessage
                      name="categoryId"
                      component="div"
                      className="text-destructive text-sm mt-1"
                    />
                  </div>

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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Starting Price */}
                  <div>
                    <label htmlFor="startingPrice" className="block text-sm font-medium mb-2">
                      Starting Price *
                    </label>
                    <Field
                      type="number"
                      id="startingPrice"
                      name="startingPrice"
                      step="0.01"
                      className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="0.00"
                    />
                    <ErrorMessage
                      name="startingPrice"
                      component="div"
                      className="text-destructive text-sm mt-1"
                    />
                  </div>

                  {/* Reserve Price */}
                  <div>
                    <label htmlFor="reservePrice" className="block text-sm font-medium mb-2">
                      Reserve Price
                    </label>
                    <Field
                      type="number"
                      id="reservePrice"
                      name="reservePrice"
                      step="0.01"
                      className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="0.00"
                    />
                    <ErrorMessage
                      name="reservePrice"
                      component="div"
                      className="text-destructive text-sm mt-1"
                    />
                  </div>

                  {/* Buy Now Price */}
                  <div>
                    <label htmlFor="buyNowPrice" className="block text-sm font-medium mb-2">
                      Buy Now Price
                    </label>
                    <Field
                      type="number"
                      id="buyNowPrice"
                      name="buyNowPrice"
                      step="0.01"
                      className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="0.00"
                    />
                    <ErrorMessage
                      name="buyNowPrice"
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
                    rows={3}
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
                <div className="flex justify-end gap-3">
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
                        Creating...
                      </>
                    ) : (
                      <>
                        Next: Upload Images
                        <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      )}

      {/* Step 2: Image Upload */}
      {currentStep === 2 && createdProductId && (
        <div className="glass-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Upload Product Images</h2>
            <button
              onClick={() => setCurrentStep(1)}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Details
            </button>
          </div>
          <ProductImageUpload productId={createdProductId} onComplete={handleComplete} />
        </div>
      )}
    </div>
  );
}
