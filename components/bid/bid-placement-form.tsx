"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { formatPrice } from "@/lib/format";
import {
  CreditCard,
  Loader2,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { createBidCheckoutAction } from "@/lib/actions/bid-actions";

interface BidPlacementFormProps {
  productId: string;
  productTitle: string;
  biddingFee: number;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

interface BidFormValues {
  bidAmount: string;
  numberOfBids: number;
  acceptTerms: boolean;
  paymentMethod: "stripe" | "paypal";
}

const validationSchema = Yup.object({
  bidAmount: Yup.string()
    .required("Bid amount is required")
    .test("is-valid-amount", "Enter a valid amount (e.g., 100.50)", (value) => {
      if (!value) return false;
      const num = parseFloat(value);
      return !isNaN(num) && num > 0 && num <= 999999.99;
    })
    .test("max-decimals", "Maximum 2 decimal places allowed", (value) => {
      if (!value) return true;
      return /^\d+(\.\d{0,2})?$/.test(value);
    }),
  numberOfBids: Yup.number()
    .min(1, "Minimum 1 bid required")
    .max(100, "Maximum 100 bids allowed at once")
    .required("Number of bids is required"),
  acceptTerms: Yup.boolean()
    .oneOf([true], "You must accept the terms and conditions")
    .required("You must accept the terms and conditions"),
  paymentMethod: Yup.string()
    .oneOf(["stripe", "paypal"], "Invalid payment method")
    .required("Payment method is required"),
});

export default function BidPlacementForm({
  productId,
  productTitle,
  biddingFee,
  user,
}: BidPlacementFormProps) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const initialValues: BidFormValues = {
    bidAmount: "",
    numberOfBids: 1,
    acceptTerms: false,
    paymentMethod: "stripe",
  };

  const handleSubmit = async (values: BidFormValues) => {
    if (values.paymentMethod === "paypal") {
      toast.info("PayPal integration coming soon!");
      return;
    }

    setIsProcessing(true);
    try {
      // Call server action to create Stripe checkout session
      await createBidCheckoutAction({
        productId,
        productTitle,
        biddingFee,
        bidAmount: parseFloat(values.bidAmount),
        numberOfBids: values.numberOfBids,
        bidderId: user.id,
        bidderName: user.name,
        bidderEmail: user.email,
      });

      // Redirect happens in the server action
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast.error(error.message || "Failed to process payment. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, isValid, setFieldValue, errors, touched }) => {
        const totalCost = values.numberOfBids * biddingFee;

        return (
          <Form className="space-y-6">
            {/* Bid Amount */}
            <div>
              <label
                htmlFor="bidAmount"
                className="block text-sm font-medium mb-2"
              >
                Your Bid Amount <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                  USD
                </span>
                <Field
                  type="text"
                  id="bidAmount"
                  name="bidAmount"
                  placeholder="0.00"
                  disabled={isProcessing}
                  className="w-full h-14 pl-10 pr-4 text-2xl font-bold rounded-lg border-2 border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-background"
                />
              </div>
              <ErrorMessage
                name="bidAmount"
                component="div"
                className="text-red-500 text-sm mt-1 flex items-center gap-1"
              >
                {(msg) => (
                  <>
                    <AlertCircle className="h-3 w-3" />
                    {msg}
                  </>
                )}
              </ErrorMessage>
              <p className="text-sm text-muted-foreground mt-2">
                Enter the amount you want to bid. Lowest unique bid wins!
              </p>
            </div>

            {/* Number of Bids */}
            <div>
              <label
                htmlFor="numberOfBids"
                className="block text-sm font-medium mb-2"
              >
                Number of Entries
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setFieldValue(
                      "numberOfBids",
                      Math.max(1, values.numberOfBids - 1)
                    )
                  }
                  disabled={values.numberOfBids <= 1 || isProcessing}
                  className="h-12 w-12 rounded-lg border-2 border-border hover:border-primary hover:bg-primary/5 font-bold text-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  −
                </button>
                <Field
                  type="number"
                  id="numberOfBids"
                  name="numberOfBids"
                  min="1"
                  max="100"
                  disabled={isProcessing}
                  className="flex-1 h-12 px-4 text-center text-xl font-bold rounded-lg border-2 border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-background"
                />
                <button
                  type="button"
                  onClick={() =>
                    setFieldValue(
                      "numberOfBids",
                      Math.min(100, values.numberOfBids + 1)
                    )
                  }
                  disabled={values.numberOfBids >= 100 || isProcessing}
                  className="h-12 w-12 rounded-lg border-2 border-border hover:border-primary hover:bg-primary/5 font-bold text-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  +
                </button>
              </div>
              <ErrorMessage
                name="numberOfBids"
                component="div"
                className="text-red-500 text-sm mt-1 flex items-center gap-1"
              >
                {(msg) => (
                  <>
                    <AlertCircle className="h-3 w-3" />
                    {msg}
                  </>
                )}
              </ErrorMessage>
              <p className="text-sm text-muted-foreground mt-2">
                Each entry increases your chance of winning
              </p>
            </div>

            {/* Quick Select Buttons */}
            <div className="grid grid-cols-4 gap-2">
              {[1, 5, 10, 20].map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => setFieldValue("numberOfBids", count)}
                  disabled={isProcessing}
                  className={`py-2 px-3 rounded-lg border-2 font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                    values.numberOfBids === count
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:border-primary hover:bg-primary/5"
                  }`}
                >
                  {count} {count === 1 ? "Entry" : "Entries"}
                </button>
              ))}
            </div>

            {/* Cost Summary */}
            <div className="glass-card p-4 rounded-lg border-2 border-primary/20 bg-primary/5">
              <div className="space-y-2">
                {values.bidAmount && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Your Bid Amount
                    </span>
                    <span className="font-bold text-lg text-foreground">
                      {values.bidAmount ? formatPrice(parseFloat(values.bidAmount)) : formatPrice(0)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Entry Fee ({values.numberOfBids}x)
                  </span>
                  <span className="font-semibold">
                    {formatPrice(biddingFee)} × {values.numberOfBids}
                  </span>
                </div>
              </div>
              <div className="h-px bg-border my-3" />
              <div className="flex justify-between items-center">
                <span className="font-bold">Total Payment</span>
                <span className="text-2xl font-bold text-primary">
                  {formatPrice(totalCost)}
                </span>
              </div>
              {values.bidAmount && (
                <p className="text-xs text-muted-foreground mt-2">
                  You&apos;ll pay {formatPrice(parseFloat(values.bidAmount))} only if you win
                </p>
              )}
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium mb-3">
                Payment Method
              </label>
              <div className="space-y-3">
                <label
                  htmlFor="paymentMethod-stripe"
                  className={`group relative flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    values.paymentMethod === "stripe"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary hover:bg-primary/5"
                  } ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-xl text-primary">
                      <CreditCard className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-bold text-foreground">
                        Card Payment (Stripe)
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Visa, Mastercard, Apple Pay, Google Pay
                      </p>
                    </div>
                  </div>
                  <Field
                    type="radio"
                    id="paymentMethod-stripe"
                    name="paymentMethod"
                    value="stripe"
                    disabled={isProcessing}
                    className="h-5 w-5 text-primary focus:ring-primary"
                  />
                </label>

                <label
                  htmlFor="paymentMethod-paypal"
                  className={`group relative flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-all opacity-60 ${
                    values.paymentMethod === "paypal"
                      ? "border-blue-500 bg-blue-500/5"
                      : "border-border hover:border-blue-500 hover:bg-blue-500/5"
                  } ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
                      <CreditCard className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-bold text-foreground">
                        PayPal{" "}
                        <span className="text-xs text-muted-foreground">
                          (Coming Soon)
                        </span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PayPal Balance or Credit
                      </p>
                    </div>
                  </div>
                  <Field
                    type="radio"
                    id="paymentMethod-paypal"
                    name="paymentMethod"
                    value="paypal"
                    disabled={isProcessing}
                    className="h-5 w-5 text-blue-500 focus:ring-blue-500"
                  />
                </label>
              </div>
              <ErrorMessage
                name="paymentMethod"
                component="div"
                className="text-red-500 text-sm mt-1 flex items-center gap-1"
              >
                {(msg) => (
                  <>
                    <AlertCircle className="h-3 w-3" />
                    {msg}
                  </>
                )}
              </ErrorMessage>
            </div>

            {/* Terms and Conditions */}
            <div>
              <label
                htmlFor="acceptTerms"
                className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  values.acceptTerms
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary"
                } ${
                  errors.acceptTerms && touched.acceptTerms
                    ? "border-red-500"
                    : ""
                } ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <Field
                  type="checkbox"
                  id="acceptTerms"
                  name="acceptTerms"
                  disabled={isProcessing}
                  className="mt-1 h-5 w-5 rounded border-border text-primary focus:ring-primary"
                />
                <div className="flex-1 text-sm">
                  <p className="font-medium text-foreground">
                    I agree to the terms and conditions
                  </p>
                  <p className="text-muted-foreground mt-1">
                    I understand that entry fees are non-refundable and that I am
                    entering a paid-entry auction. I have read and agree to the{" "}
                    <a href="/terms" className="text-primary hover:underline">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="/privacy" className="text-primary hover:underline">
                      Privacy Policy
                    </a>
                    .
                  </p>
                </div>
              </label>
              <ErrorMessage
                name="acceptTerms"
                component="div"
                className="text-red-500 text-sm mt-1 flex items-center gap-1"
              >
                {(msg) => (
                  <>
                    <AlertCircle className="h-3 w-3" />
                    {msg}
                  </>
                )}
              </ErrorMessage>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isValid || isProcessing}
              className="w-full py-4 bg-linear-to-r from-primary to-orange-600 text-white rounded-xl font-bold text-lg hover:from-primary/90 hover:to-orange-600/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:transform-none"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-6 w-6 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <ShieldCheck className="h-6 w-6" />
                  Proceed to Secure Payment
                </>
              )}
            </button>

            {/* Security Notice */}
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="h-3 w-3" />
              <span className="uppercase tracking-wider">
                Secure Payment • SSL Encrypted • PCI Compliant
              </span>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
}
