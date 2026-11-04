"use client";

import { useState, useEffect, useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { formatPrice } from "@/lib/format";
import {
  AlertCircle,
  Loader2,
  CreditCard,
  CheckCircle2,
  X,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import StripeProvider from "./stripe-provider";
import CheckoutForm from "./checkout-form";
import { createPaymentIntent } from "@/lib/actions/payment-actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BidPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  productTitle: string;
  biddingFee: number;
  user: {
    id: string;
    name: string;
    email: string;
  };
  auction_id: string;
}

interface BidFormValues {
  // One bid amount per entry — each entry is a separate, independent guess at
  // the lowest unique bid, so they must be allowed to differ.
  bidAmounts: string[];
  acceptTerms: boolean;
  auctionId: string;
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
});

// Grow/shrink the entries array to an exact count, preserving amounts the
// user already typed.
function resizeBidAmounts(current: string[], count: number): string[] {
  if (count > current.length) {
    return [...current, ...Array(count - current.length).fill("")];
  }
  return current.slice(0, count);
}

type Step = "form" | "payment" | "success";

export default function BidPaymentModal({
  isOpen,
  onClose,
  productId,
  productTitle,
  auction_id,
  biddingFee,
  user,
}: BidPaymentModalProps) {
  const [step, setStep] = useState<Step>("form");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isCreatingIntent, setIsCreatingIntent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bidData, setBidData] = useState<{
    bidAmounts: number[];
    totalAmount: number;
  } | null>(null);

  // One idempotency key per "attempt" at placing this bid — reused for every
  // retry of the same attempt (a double-click, a flaky network causing a
  // resubmit) so Stripe returns the *same* PaymentIntent instead of creating
  // a second one, which is how a single bid ends up charged twice. A fresh
  // key is only minted the next time the modal is opened for a new attempt.
  const idempotencyKeyRef = useRef<string | null>(null);
  // Synchronous re-entry lock — belt-and-suspenders alongside the
  // isCreatingIntent state, which has a small window between click and
  // re-render where a second click could still slip through.
  const isSubmittingRef = useRef(false);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setStep("form");
      setClientSecret(null);
      setError(null);
      setBidData(null);
      idempotencyKeyRef.current = null;
      isSubmittingRef.current = false;
    }
  }, [isOpen]);

  const initialValues: BidFormValues = {
    bidAmounts: [""],
    acceptTerms: false,
    auctionId: auction_id,
  };

  const handleFormSubmit = async (values: BidFormValues) => {
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    setIsCreatingIntent(true);
    setError(null);

    if (!idempotencyKeyRef.current) {
      idempotencyKeyRef.current =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `bid-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    }

    const bidAmounts = values.bidAmounts.map((amount) => parseFloat(amount));
    const totalAmount = bidAmounts.length * biddingFee;

    try {
      // Call server action to create PaymentIntent
      const result = await createPaymentIntent({
        productId,
        productTitle,
        biddingFee,
        bidAmounts,
        bidderId: user.id,
        bidderName: user.name,
        bidderEmail: user.email,
        auctionId: auction_id,
        idempotencyKey: idempotencyKeyRef.current,
      });

      if (result.error) {
        throw new Error(result.error);
      }

      if (result.clientSecret) {
        setClientSecret(result.clientSecret);
        setBidData({
          bidAmounts,
          totalAmount,
        });
        setStep("payment");
      }
    } catch (err: any) {
      setError(
        err.message || "Failed to initialize payment. Please try again.",
      );
    } finally {
      setIsCreatingIntent(false);
      isSubmittingRef.current = false;
    }
  };

  const handlePaymentSuccess = () => {
    setStep("success");
    toast.success("Payment successful! Your bid entry has been recorded.", {
      duration: 5000,
      description: "You will receive a confirmation email shortly.",
    });
  };

  const handlePaymentError = (errorMsg: string) => {
    setError(errorMsg);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        {step === "form" && (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-ink">
                Place Your Bid
              </DialogTitle>
              <DialogDescription>
                Enter your bid amount for{" "}
                <span className="font-semibold text-ink">{productTitle}</span>
              </DialogDescription>
            </DialogHeader>

            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleFormSubmit}
            >
              {({ values, isValid, setFieldValue, errors, touched }) => {
                const entryCount = values.bidAmounts.length;
                const totalCost = entryCount * biddingFee;

                return (
                  <Form className="space-y-5 mt-4">
                    {/* Number of Entries */}
                    <div>
                      <label className="block text-sm font-medium text-ink mb-2">
                        Number of Entries
                      </label>
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
                          disabled={entryCount <= 1 || isCreatingIntent}
                          className="size-10 rounded-full bg-soft-cloud hover:bg-hairline-soft font-medium text-lg text-ink transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          −
                        </button>
                        <div className="flex-1 h-10 px-4 flex items-center justify-center text-lg font-semibold rounded-full bg-soft-cloud text-ink">
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
                          disabled={entryCount >= 100 || isCreatingIntent}
                          className="size-10 rounded-full bg-soft-cloud hover:bg-hairline-soft font-medium text-lg text-ink transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Quick Select */}
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
                          disabled={isCreatingIntent}
                          className={cn(
                            "h-10 rounded-full border text-xs font-medium transition-colors disabled:opacity-50",
                            entryCount === count
                              ? "border-ink bg-ink text-background"
                              : "border-hairline hover:bg-soft-cloud text-ink",
                          )}
                        >
                          {count}x
                        </button>
                      ))}
                    </div>

                    {/* Per-entry bid amounts */}
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-ink">
                        Your Bid Amount{entryCount > 1 ? "s" : ""}{" "}
                        <span className="text-sale">*</span>
                      </label>
                      {values.bidAmounts.map((_, index) => (
                        <div key={index}>
                          <div className="flex items-center gap-2">
                            {entryCount > 1 && (
                              <span className="w-14 shrink-0 text-xs text-mute">
                                #{index + 1}
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
                                disabled={isCreatingIntent}
                                className="w-full h-12 pl-14 pr-5 text-lg font-semibold rounded-full bg-soft-cloud outline-none transition-[background-color,box-shadow] focus:bg-background focus:ring-2 focus:ring-ink focus:ring-offset-4 focus:ring-offset-soft-cloud disabled:opacity-50 disabled:cursor-not-allowed"
                              />
                            </div>
                            {entryCount > 1 && (
                              <button
                                type="button"
                                onClick={() =>
                                  setFieldValue(
                                    "bidAmounts",
                                    values.bidAmounts.filter(
                                      (_, i) => i !== index,
                                    ),
                                  )
                                }
                                disabled={isCreatingIntent}
                                aria-label={`Remove entry ${index + 1}`}
                                className="size-9 shrink-0 rounded-full hover:bg-soft-cloud text-mute hover:text-sale transition-colors disabled:opacity-50"
                              >
                                <Trash2 className="h-4 w-4 mx-auto" />
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
                      <p className="text-xs text-mute">
                        Lowest unique bid wins — each entry needs its own
                        amount.
                      </p>
                    </div>

                    {/* Cost Summary */}
                    <div className="py-4 space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-mute">
                          Entry Fee ({entryCount}x {formatPrice(biddingFee)})
                        </span>
                        <span className="font-medium text-ink">
                          {formatPrice(totalCost)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-ink">Total</span>
                        <span className="text-xl font-semibold text-ink">
                          {formatPrice(totalCost)}
                        </span>
                      </div>
                    </div>

                    {/* Terms */}
                    <div>
                      <label
                        htmlFor="acceptTerms"
                        className="flex items-start gap-3 cursor-pointer"
                      >
                        <Field
                          type="checkbox"
                          id="acceptTerms"
                          name="acceptTerms"
                          disabled={isCreatingIntent}
                          className="mt-0.5 h-4 w-4 border border-hairline accent-ink"
                        />
                        <p className="text-xs text-mute">
                          I agree to the{" "}
                          <a
                            href="/terms"
                            className="text-ink underline underline-offset-4"
                          >
                            Terms
                          </a>{" "}
                          and understand that entry fees are non-refundable.
                        </p>
                      </label>
                      <ErrorMessage name="acceptTerms">
                        {(msg) => (
                          <div className="text-sale text-xs mt-1.5 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {msg}
                          </div>
                        )}
                      </ErrorMessage>
                    </div>

                    {/* Error Display */}
                    {error && (
                      <div className="flex items-center gap-2 p-3 bg-sale/10 text-sale">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        <p className="text-sm">{error}</p>
                      </div>
                    )}

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={!isValid || isCreatingIntent}
                      size="lg"
                      className="w-full"
                    >
                      {isCreatingIntent ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Preparing Payment...
                        </>
                      ) : (
                        <>
                          <CreditCard className="h-5 w-5" />
                          Continue to Payment
                        </>
                      )}
                    </Button>
                  </Form>
                );
              }}
            </Formik>
          </>
        )}

        {step === "payment" && clientSecret && bidData && (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-ink">
                Complete Payment
              </DialogTitle>
              <DialogDescription>
                {bidData.bidAmounts.length}{" "}
                {bidData.bidAmounts.length === 1 ? "entry" : "entries"}
                {bidData.bidAmounts.length === 1 ? (
                  <>
                    {" "}
                    for{" "}
                    <span className="font-semibold text-ink">
                      {formatPrice(bidData.bidAmounts[0])}
                    </span>{" "}
                    bid
                  </>
                ) : (
                  <>
                    {" "}
                    with bids from{" "}
                    <span className="font-semibold text-ink">
                      {formatPrice(Math.min(...bidData.bidAmounts))}
                    </span>{" "}
                    to{" "}
                    <span className="font-semibold text-ink">
                      {formatPrice(Math.max(...bidData.bidAmounts))}
                    </span>
                  </>
                )}
              </DialogDescription>
            </DialogHeader>

            <div className="mt-4">
              <StripeProvider clientSecret={clientSecret}>
                <CheckoutForm
                  totalAmount={bidData.totalAmount}
                  productId={productId}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              </StripeProvider>
            </div>

            {/* Back Button */}
            <button
              type="button"
              onClick={() => {
                setStep("form");
                setClientSecret(null);
                setError(null);
                // Going back means the next submit is a fresh attempt (the
                // user may change amounts/entry count) — a new key is
                // required or Stripe will reject it as a param mismatch
                // against the first attempt's cached idempotent response.
                idempotencyKeyRef.current = null;
              }}
              className="w-full py-2 text-sm text-mute hover:text-ink transition-colors"
            >
              ← Back to bid details
            </button>
          </>
        )}

        {step === "success" && (
          <div className="py-8 text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-success/10 rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-success" />
            </div>
            <DialogTitle className="text-xl font-semibold text-ink">
              Bid Placed Successfully!
            </DialogTitle>
            <DialogDescription className="text-base">
              Your bid has been submitted. Good luck!
            </DialogDescription>
            <Button onClick={onClose} className="mt-4">
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
