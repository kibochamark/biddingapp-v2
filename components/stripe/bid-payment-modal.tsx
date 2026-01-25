"use client";

import { useState, useEffect } from "react";
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
} from "lucide-react";
import StripeProvider from "./stripe-provider";
import CheckoutForm from "./checkout-form";
import { createPaymentIntent } from "@/lib/actions/payment-actions";

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
  auction_id:string
}

interface BidFormValues {
  bidAmount: string;
  numberOfBids: number;
  acceptTerms: boolean;
  auctionId:string
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
});

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
    bidAmount: number;
    numberOfBids: number;
    totalAmount: number;
  } | null>(null);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setStep("form");
      setClientSecret(null);
      setError(null);
      setBidData(null);
    }
  }, [isOpen]);

  const initialValues: BidFormValues = {
    bidAmount: "",
    numberOfBids: 1,
    acceptTerms: false,
    auctionId: auction_id
  };

  const handleFormSubmit = async (values: BidFormValues) => {
    setIsCreatingIntent(true);
    setError(null);

    const totalAmount = values.numberOfBids * biddingFee;
    const bidAmount = parseFloat(values.bidAmount);

    try {
      // Call server action to create PaymentIntent
      const result = await createPaymentIntent({
        productId,
        productTitle,
        biddingFee,
        bidAmount,
        numberOfBids: values.numberOfBids,
        bidderId: user.id,
        bidderName: user.name,
        bidderEmail: user.email,
        auctionId: auction_id
      });

      if (result.error) {
        throw new Error(result.error);
      }

      if (result.clientSecret) {
        setClientSecret(result.clientSecret);
        setBidData({
          bidAmount,
          numberOfBids: values.numberOfBids,
          totalAmount,
        });
        setStep("payment");
      }
    } catch (err: any) {
      setError(err.message || "Failed to initialize payment. Please try again.");
    } finally {
      setIsCreatingIntent(false);
    }
  };

  const handlePaymentSuccess = () => {
    setStep("success");
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
              <DialogTitle className="text-xl font-bold">
                Place Your Bid
              </DialogTitle>
              <DialogDescription>
                Enter your bid amount for{" "}
                <span className="font-semibold text-foreground">
                  {productTitle}
                </span>
              </DialogDescription>
            </DialogHeader>

            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleFormSubmit}
            >
              {({ values, isValid, setFieldValue, errors, touched }) => {
                const totalCost = values.numberOfBids * biddingFee;

                return (
                  <Form className="space-y-5 mt-4">
                    {/* Bid Amount */}
                    <div>
                      <label
                        htmlFor="bidAmount"
                        className="block text-sm font-medium mb-2"
                      >
                        Your Bid Amount <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-muted-foreground">
                          $
                        </span>
                        <Field
                          type="text"
                          id="bidAmount"
                          name="bidAmount"
                          placeholder="0.00"
                          disabled={isCreatingIntent}
                          className="w-full h-12 pl-10 pr-4 text-xl font-bold rounded-lg border-2 border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-background"
                        />
                      </div>
                      <ErrorMessage name="bidAmount">
                        {(msg) => (
                          <div className="text-red-500 text-sm mt-1 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {msg}
                          </div>
                        )}
                      </ErrorMessage>
                      <p className="text-xs text-muted-foreground mt-1">
                        Lowest unique bid wins!
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
                          disabled={values.numberOfBids <= 1 || isCreatingIntent}
                          className="h-10 w-10 rounded-lg border-2 border-border hover:border-primary hover:bg-primary/5 font-bold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          −
                        </button>
                        <Field
                          type="number"
                          id="numberOfBids"
                          name="numberOfBids"
                          min="1"
                          max="100"
                          disabled={isCreatingIntent}
                          className="flex-1 h-10 px-4 text-center text-lg font-bold rounded-lg border-2 border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-background"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setFieldValue(
                              "numberOfBids",
                              Math.min(100, values.numberOfBids + 1)
                            )
                          }
                          disabled={values.numberOfBids >= 100 || isCreatingIntent}
                          className="h-10 w-10 rounded-lg border-2 border-border hover:border-primary hover:bg-primary/5 font-bold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          +
                        </button>
                      </div>
                      <ErrorMessage name="numberOfBids">
                        {(msg) => (
                          <div className="text-red-500 text-sm mt-1 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {msg}
                          </div>
                        )}
                      </ErrorMessage>
                    </div>

                    {/* Quick Select */}
                    <div className="grid grid-cols-4 gap-2">
                      {[1, 5, 10, 20].map((count) => (
                        <button
                          key={count}
                          type="button"
                          onClick={() => setFieldValue("numberOfBids", count)}
                          disabled={isCreatingIntent}
                          className={`py-2 px-3 rounded-lg border-2 font-semibold text-xs transition-all disabled:opacity-50 ${
                            values.numberOfBids === count
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border hover:border-primary hover:bg-primary/5"
                          }`}
                        >
                          {count}x
                        </button>
                      ))}
                    </div>

                    {/* Cost Summary */}
                    <div className="p-4 rounded-lg border-2 border-primary/20 bg-primary/5">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">
                          Entry Fee ({values.numberOfBids}x {formatPrice(biddingFee)})
                        </span>
                        <span className="font-semibold">
                          {formatPrice(totalCost)}
                        </span>
                      </div>
                      <div className="h-px bg-border my-2" />
                      <div className="flex justify-between items-center">
                        <span className="font-bold">Total</span>
                        <span className="text-xl font-bold text-primary">
                          {formatPrice(totalCost)}
                        </span>
                      </div>
                    </div>

                    {/* Terms */}
                    <div>
                      <label
                        htmlFor="acceptTerms"
                        className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                          values.acceptTerms
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary"
                        } ${
                          errors.acceptTerms && touched.acceptTerms
                            ? "border-red-500"
                            : ""
                        }`}
                      >
                        <Field
                          type="checkbox"
                          id="acceptTerms"
                          name="acceptTerms"
                          disabled={isCreatingIntent}
                          className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-primary"
                        />
                        <p className="text-xs text-muted-foreground">
                          I agree to the{" "}
                          <a href="/terms" className="text-primary hover:underline">
                            Terms
                          </a>{" "}
                          and understand that entry fees are non-refundable.
                        </p>
                      </label>
                      <ErrorMessage name="acceptTerms">
                        {(msg) => (
                          <div className="text-red-500 text-xs mt-1 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {msg}
                          </div>
                        )}
                      </ErrorMessage>
                    </div>

                    {/* Error Display */}
                    {error && (
                      <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        <p className="text-sm">{error}</p>
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={!isValid || isCreatingIntent}
                      className="w-full py-3.5 bg-linear-to-r from-primary to-orange-600 text-white rounded-lg font-bold hover:from-primary/90 hover:to-orange-600/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
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
                    </button>
                  </Form>
                );
              }}
            </Formik>
          </>
        )}

        {step === "payment" && clientSecret && bidData && (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">
                Complete Payment
              </DialogTitle>
              <DialogDescription>
                {bidData.numberOfBids} {bidData.numberOfBids === 1 ? "entry" : "entries"} for{" "}
                <span className="font-semibold text-foreground">
                  ${bidData.bidAmount.toFixed(2)}
                </span>{" "}
                bid
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
              }}
              className="w-full py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Back to bid details
            </button>
          </>
        )}

        {step === "success" && (
          <div className="py-8 text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <DialogTitle className="text-xl font-bold">
              Bid Placed Successfully!
            </DialogTitle>
            <DialogDescription className="text-base">
              Your bid has been submitted. Good luck!
            </DialogDescription>
            <button
              type="button"
              onClick={onClose}
              className="mt-4 px-6 py-2.5 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
