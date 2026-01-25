"use client";

import { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Loader2, ShieldCheck, AlertCircle } from "lucide-react";
import { formatPrice } from "@/lib/format";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/product/${productId}?payment=success`,
      },
    });

    if (error) {
      // This point is reached if there's an immediate error when
      // confirming the payment. Show the error to your customer.
      setErrorMessage(error.message || "An unexpected error occurred.");
      onError?.(error.message || "Payment failed");
      setIsProcessing(false);
    } else {
      // Payment succeeded - the customer will be redirected to return_url
      onSuccess?.();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Payment Element */}
      <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-800">
        <PaymentElement
          options={{
            layout: "tabs",
            paymentMethodOrder: ["card", "apple_pay", "google_pay"],
          }}
        />
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p className="text-sm">{errorMessage}</p>
        </div>
      )}

      {/* Total Amount Display */}
      <div className="flex justify-between items-center p-4 bg-primary/5 rounded-lg border-2 border-primary/20">
        <span className="font-semibold">Total to Pay</span>
        <span className="text-2xl font-bold text-primary">
          {formatPrice(totalAmount)}
        </span>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!stripe || !elements || isProcessing}
        className="w-full py-4 bg-gradient-to-r from-primary to-orange-600 text-white rounded-xl font-bold text-lg hover:from-primary/90 hover:to-orange-600/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 transition-all shadow-lg hover:shadow-xl"
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
      </button>

      {/* Security Badge */}
      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <ShieldCheck className="h-3 w-3" />
        <span className="uppercase tracking-wider">
          Secured by Stripe • SSL Encrypted
        </span>
      </div>
    </form>
  );
}
