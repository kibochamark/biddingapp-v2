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
                  ? "bg-ink text-background"
                  : "bg-soft-cloud text-mute"
              }`}
            >
              1
            </div>
            <span className="text-sm font-medium text-ink">Product Details</span>
          </div>
          <div className="flex-1 h-1 mx-4 bg-soft-cloud">
            <div
              className={`h-full transition-all ${
                currentStep >= 2 ? "bg-ink" : "bg-soft-cloud"
              }`}
              style={{ width: currentStep >= 2 ? "100%" : "0%" }}
            />
          </div>
          <div className="flex items-center space-x-4">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full ${
                currentStep >= 2
                  ? "bg-ink text-background"
                  : "bg-soft-cloud text-mute"
              }`}
            >
              2
            </div>
            <span className="text-sm font-medium text-ink">Upload Images</span>
          </div>
        </div>
      </div>

      {/* Step 1: Product Details Form */}
      {currentStep === 1 && (
        <div className="shadow-surface p-6">
          <h2 className="text-xl font-bold mb-6 text-ink">Product Information</h2>
          <Formik
            initialValues={initialValues}
            validationSchema={productValidationSchema}
            onSubmit={handleProductSubmit}
          >
            {({ isSubmitting: formikSubmitting, setFieldValue, values, errors, touched }) => (
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
                  {/* Category */}
                  <div>
                    <Label htmlFor="categoryId" className="mb-2">
                      Category *
                    </Label>
                    <CategorySelector
                      value={values.categoryId}
                      onChange={(categoryId) => setFieldValue("categoryId", categoryId)}
                      error={touched.categoryId && errors.categoryId ? errors.categoryId : undefined}
                    />
                    <ErrorMessage
                      name="categoryId"
                      component="div"
                      className="text-sale text-sm mt-1"
                    />
                  </div>

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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Starting Price */}
                  <div>
                    <Label htmlFor="startingPrice" className="mb-2">
                      Starting Price *
                    </Label>
                    <Field
                      as={Input}
                      type="number"
                      id="startingPrice"
                      name="startingPrice"
                      step="0.01"
                      placeholder="0.00"
                    />
                    <ErrorMessage
                      name="startingPrice"
                      component="div"
                      className="text-sale text-sm mt-1"
                    />
                  </div>

                  {/* Reserve Price */}
                  <div>
                    <Label htmlFor="reservePrice" className="mb-2">
                      Reserve Price
                    </Label>
                    <Field
                      as={Input}
                      type="number"
                      id="reservePrice"
                      name="reservePrice"
                      step="0.01"
                      placeholder="0.00"
                    />
                    <ErrorMessage
                      name="reservePrice"
                      component="div"
                      className="text-sale text-sm mt-1"
                    />
                  </div>

                  {/* Buy Now Price */}
                  <div>
                    <Label htmlFor="buyNowPrice" className="mb-2">
                      Buy Now Price
                    </Label>
                    <Field
                      as={Input}
                      type="number"
                      id="buyNowPrice"
                      name="buyNowPrice"
                      step="0.01"
                      placeholder="0.00"
                    />
                    <ErrorMessage
                      name="buyNowPrice"
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
                    rows={3}
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
                <div className="flex justify-end gap-3">
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
                        Creating...
                      </>
                    ) : (
                      <>
                        Next: Upload Images
                        <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      )}

      {/* Step 2: Image Upload */}
      {currentStep === 2 && createdProductId && (
        <div className="shadow-surface p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-ink">Upload Product Images</h2>
            <button
              onClick={() => setCurrentStep(1)}
              className="flex items-center gap-2 text-sm text-mute hover:text-ink"
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
