"use client";

import { useRef, useState } from "react";
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
  X,
} from "lucide-react";
import { toast } from "sonner";
import { createBidCheckoutAction } from "@/lib/actions/bid-actions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

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
  // One bid amount per entry — each entry is a separate, independent guess at
  // the lowest unique bid, so they must be allowed to differ.
  bidAmounts: string[];
  acceptTerms: boolean;
  paymentMethod: "stripe" | "paypal";
}

const bidAmountSchema = Yup.string()
  .required("Required")
  .test("is-valid-amount", "Enter a valid amount (e.g., 100.50)", (value) => {
    if (!value) return false;
    const num = parseFloat(value);
    return !isNaN(num) && num > 0 && num <= 999999.99;
  })
  .test("max-decimals", "Maximum 2 decimal places allowed", (value) => {
    if (!value) return true;
    return /^\d+(\.\d{0,2})?$/.test(value);
  });

const validationSchema = Yup.object({
  bidAmounts: Yup.array()
    .of(bidAmountSchema)
    .min(1, "At least one entry is required")
    .max(100, "Maximum 100 entries allowed at once")
    .test(
      "unique-amounts",
      "Each entry needs a different bid amount — duplicates can't both be the lowest unique bid",
      (arr) => {
        if (!arr) return true;
        const values = arr.filter((v): v is string => !!v);
        return new Set(values).size === values.length;
      },
    )
    .required(),
  acceptTerms: Yup.boolean()
    .oneOf([true], "You must accept the terms and conditions")
    .required("You must accept the terms and conditions"),
  paymentMethod: Yup.string()
    .oneOf(["stripe", "paypal"], "Invalid payment method")
    .required("Payment method is required"),
});

// Grow/shrink the entries array to an exact count, preserving amounts the
// user already typed.
function resizeBidAmounts(current: string[], count: number): string[] {
  if (count > current.length) {
    return [...current, ...Array(count - current.length).fill("")];
  }
  return current.slice(0, count);
}

export default function BidPlacementForm({
  productId,
  productTitle,
  biddingFee,
  user,
}: BidPlacementFormProps) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  // One idempotency key per submission attempt, reused across retries of
  // that same attempt so a double-click or retried request returns the same
  // Checkout Session instead of creating — and charging — a second one.
  const idempotencyKeyRef = useRef<string | null>(null);
  const isSubmittingRef = useRef(false);

  const initialValues: BidFormValues = {
    bidAmounts: [""],
    acceptTerms: false,
    paymentMethod: "stripe",
  };

  // Payment success/failure notifications arrive via the global SSE listener
  // (components/realtime-notifications.tsx, mounted once in app/layout.tsx)
  // rather than a second connection here — that one actually works and
  // already revalidates/refreshes the right things.

  const handleSubmit = async (values: BidFormValues) => {
    if (values.paymentMethod === "paypal") {
      toast.info("PayPal integration coming soon!");
      return;
    }

    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;

    if (!idempotencyKeyRef.current) {
      idempotencyKeyRef.current =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `bid-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    }

    setIsProcessing(true);
    try {
      // Call server action to create Stripe checkout session
      await createBidCheckoutAction({
        productId,
        productTitle,
        biddingFee,
        bidAmounts: values.bidAmounts.map((amount) => parseFloat(amount)),
        bidderId: user.id,
        bidderName: user.name,
        bidderEmail: user.email,
        idempotencyKey: idempotencyKeyRef.current,
      });

      // Redirect happens in the server action
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast.error(
        error.message || "Failed to process payment. Please try again.",
      );
      setIsProcessing(false);
      isSubmittingRef.current = false;
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, isValid, setFieldValue, errors, touched }) => {
        const entryCount = values.bidAmounts.length;
        const totalCost = entryCount * biddingFee;

        return (
          <Form className="space-y-6">
            {/* Number of Entries */}
            <div>
              <Label className="mb-2">Number of Entries</Label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setFieldValue(
                      "bidAmounts",
                      resizeBidAmounts(
                        values.bidAmounts,
                        Math.max(1, entryCount - 1),
                      ),
                    )
                  }
                  disabled={entryCount <= 1 || isProcessing}
                  className="h-12 w-12 rounded-full bg-soft-cloud hover:bg-hairline-soft font-medium text-xl text-ink transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  −
                </button>
                <div className="flex-1 h-12 px-4 flex items-center justify-center text-xl font-semibold rounded-full bg-soft-cloud text-ink">
                  {entryCount}
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setFieldValue(
                      "bidAmounts",
                      resizeBidAmounts(
                        values.bidAmounts,
                        Math.min(100, entryCount + 1),
                      ),
                    )
                  }
                  disabled={entryCount >= 100 || isProcessing}
                  className="h-12 w-12 rounded-full bg-soft-cloud hover:bg-hairline-soft font-medium text-xl text-ink transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  +
                </button>
              </div>
              <p className="text-sm text-mute mt-2">
                Each entry needs its own bid amount — lowest unique bid wins!
              </p>
            </div>

            {/* Quick Select Buttons */}
            <div className="grid grid-cols-4 gap-2">
              {[1, 5, 10, 20].map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() =>
                    setFieldValue(
                      "bidAmounts",
                      resizeBidAmounts(values.bidAmounts, count),
                    )
                  }
                  disabled={isProcessing}
                  className={cn(
                    "h-10 px-3 rounded-full border text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
                    entryCount === count
                      ? "border-ink bg-ink text-background"
                      : "border-hairline text-ink hover:bg-soft-cloud",
                  )}
                >
                  {count} {count === 1 ? "Entry" : "Entries"}
                </button>
              ))}
            </div>

            {/* Per-entry bid amounts */}
            <div className="space-y-3">
              <Label>
                Your Bid Amount{entryCount > 1 ? "s" : ""}{" "}
                <span className="text-sale">*</span>
              </Label>
              {values.bidAmounts.map((_, index) => (
                <div key={index}>
                  <div className="flex items-center gap-2">
                    {entryCount > 1 && (
                      <span className="w-16 shrink-0 text-xs text-mute">
                        Entry {index + 1}
                      </span>
                    )}
                    <div className="relative flex-1">
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 text-sm font-medium text-mute">
                        USD
                      </span>
                      <Field
                        type="text"
                        name={`bidAmounts[${index}]`}
                        placeholder="0.00"
                        disabled={isProcessing}
                        className="w-full h-12 pl-14 pr-5 text-lg font-semibold rounded-full bg-soft-cloud outline-none transition-[background-color,box-shadow] focus:bg-background focus:ring-2 focus:ring-ink focus:ring-offset-4 focus:ring-offset-soft-cloud disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </div>
                    {entryCount > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          setFieldValue(
                            "bidAmounts",
                            values.bidAmounts.filter((_, i) => i !== index),
                          )
                        }
                        disabled={isProcessing}
                        aria-label={`Remove entry ${index + 1}`}
                        className="size-9 shrink-0 rounded-full hover:bg-soft-cloud text-mute hover:text-sale transition-colors disabled:opacity-50"
                      >
                        <X className="h-4 w-4 mx-auto" />
                      </button>
                    )}
                  </div>
                  <ErrorMessage
                    name={`bidAmounts[${index}]`}
                    component="div"
                    className="text-sale text-xs mt-1 ml-1 flex items-center gap-1"
                  >
                    {(msg) => (
                      <>
                        <AlertCircle className="h-3 w-3" />
                        {msg}
                      </>
                    )}
                  </ErrorMessage>
                </div>
              ))}
              {typeof errors.bidAmounts === "string" && (
                <div className="text-sale text-sm flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.bidAmounts}
                </div>
              )}
            </div>

            {/* Cost Summary */}
            <div className="py-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-mute">
                  Entry Fee ({entryCount}x)
                </span>
                <span className="font-medium text-ink">
                  {formatPrice(biddingFee)} × {entryCount}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="font-medium text-ink">Total Payment</span>
                <span className="text-2xl font-semibold text-ink">
                  {formatPrice(totalCost)}
                </span>
              </div>
              <p className="text-xs text-mute">
                If one of your entries is the lowest unique bid, you&apos;ll pay
                that entry&apos;s bid amount to win the item.
              </p>
            </div>

            {/* Payment Method */}
            <div>
              <Label className="mb-3">Payment Method</Label>
              <div className="space-y-3">
                <label
                  htmlFor="paymentMethod-stripe"
                  className={cn(
                    "flex items-center justify-between gap-4 p-4 border cursor-pointer transition-colors",
                    values.paymentMethod === "stripe"
                      ? "border-ink bg-soft-cloud"
                      : "border-hairline hover:bg-soft-cloud",
                    isProcessing && "opacity-50 cursor-not-allowed",
                  )}
                >
                  <div className="flex items-center gap-4">
                    <CreditCard className="h-5 w-5 text-ink shrink-0" />
                    <div>
                      <p className="font-medium text-sm text-ink">
                        Card Payment (Stripe)
                      </p>
                      <p className="text-xs text-mute">
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
                    className="h-4 w-4 accent-ink"
                  />
                </label>

                <label
                  htmlFor="paymentMethod-paypal"
                  className={cn(
                    "flex items-center justify-between gap-4 p-4 border cursor-pointer transition-colors opacity-60",
                    "border-hairline hover:bg-soft-cloud",
                    isProcessing && "opacity-50 cursor-not-allowed",
                  )}
                >
                  <div className="flex items-center gap-4">
                    <CreditCard className="h-5 w-5 text-ink shrink-0" />
                    <div>
                      <p className="font-medium text-sm text-ink">
                        PayPal{" "}
                        <span className="text-xs text-mute">(Coming Soon)</span>
                      </p>
                      <p className="text-xs text-mute">
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
                    className="h-4 w-4 accent-ink"
                  />
                </label>
              </div>
              <ErrorMessage
                name="paymentMethod"
                component="div"
                className="text-sale text-sm mt-1.5 flex items-center gap-1"
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
                className={cn(
                  "flex items-start gap-3 cursor-pointer",
                  isProcessing && "opacity-50 cursor-not-allowed",
                )}
              >
                <Field
                  type="checkbox"
                  id="acceptTerms"
                  name="acceptTerms"
                  disabled={isProcessing}
                  className="mt-1 h-4 w-4 border border-hairline accent-ink"
                />
                <div className="flex-1 text-sm">
                  <p className="font-medium text-ink">
                    I agree to the terms and conditions
                  </p>
                  <p className="text-mute mt-1">
                    I understand that entry fees are non-refundable and that I
                    am entering a paid-entry auction. I have read and agree to
                    the{" "}
                    <a
                      href="/terms"
                      className="text-ink underline underline-offset-4"
                    >
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a
                      href="/privacy"
                      className="text-ink underline underline-offset-4"
                    >
                      Privacy Policy
                    </a>
                    .
                  </p>
                </div>
              </label>
              <ErrorMessage
                name="acceptTerms"
                component="div"
                className="text-sale text-sm mt-1.5 flex items-center gap-1"
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
            <Button
              type="submit"
              disabled={!isValid || isProcessing}
              size="lg"
              className="w-full text-base"
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
            </Button>

            {/* Security Notice */}
            <div className="flex items-center justify-center gap-2 text-xs text-mute">
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
