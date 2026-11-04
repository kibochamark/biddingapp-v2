"use client";

import { useRef, useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Loader2, ShieldCheck, AlertCircle } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/button";

interface CheckoutFormProps {
  totalAmount: number;
  productId: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export default function CheckoutForm({
  totalAmount,
  productId,
  onSuccess,
  onError,
}: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  // Synchronous re-entry lock — isProcessing (state) has a small window
  // between click and re-render where a second click/Enter could still
  // call confirmPayment again before the button visually disables.
  const isSubmittingRef = useRef(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements || isSubmittingRef.current) {
      return;
    }

    isSubmittingRef.current = true;
    setIsProcessing(true);
    setErrorMessage(null);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/product/${productId}?payment=success`,
      },
      // Only redirect the browser when the chosen payment method actually
      // requires it (e.g. certain bank/wallet methods). A plain card payment
      // that completes with no further action should resolve right here
      // instead of always bouncing through a full-page redirect — without
      // this, onSuccess below never runs for the common case, and the only
      // confirmation the user gets is whatever the return_url page happens
      // to show, which skews later attempts toward resubmitting.
      redirect: "if_required",
    });

    if (error) {
      // This point is reached if there's an immediate error when
      // confirming the payment. Show the error to your customer.
      setErrorMessage(error.message || "An unexpected error occurred.");
      onError?.(error.message || "Payment failed");
      setIsProcessing(false);
      isSubmittingRef.current = false;
    } else {
      // Payment succeeded without needing a redirect.
      onSuccess?.();
      setIsProcessing(false);
      isSubmittingRef.current = false;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Payment Element */}
      <div className="bg-soft-cloud p-4">
        <PaymentElement
          options={{
            layout: "tabs",
            paymentMethodOrder: ["card", "apple_pay", "google_pay"],
          }}
        />
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="flex items-center gap-2 p-4 bg-sale/10 text-sale">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p className="text-sm">{errorMessage}</p>
        </div>
      )}

      {/* Total Amount Display */}
      <div className="flex justify-between items-center py-4 ">
        <span className="font-medium text-ink">Total to Pay</span>
        <span className="text-2xl font-semibold text-ink">
          {formatPrice(totalAmount)}
        </span>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={!stripe || !elements || isProcessing}
        size="lg"
        className="w-full text-base"
      >
        {isProcessing ? (
          <>
            <Loader2 className="h-6 w-6 animate-spin" />
            Processing Payment...
          </>
        ) : (
          <>
            <ShieldCheck className="h-6 w-6" />
            Pay {formatPrice(totalAmount)}
          </>
        )}
      </Button>

      {/* Security Badge */}
      <div className="flex items-center justify-center gap-2 text-xs text-mute">
        <ShieldCheck className="h-3 w-3" />
        <span className="uppercase tracking-wider">
          Secured by Stripe • SSL Encrypted
        </span>
      </div>
    </form>
  );
}
