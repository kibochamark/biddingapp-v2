"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

export default function PaymentNotification() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const payment = searchParams.get("payment");
    const sessionId = searchParams.get("session_id");
    const redirectStatus = searchParams.get("redirect_status");

    const cleanUrl = () => {
      const url = new URL(window.location.href);
      url.searchParams.delete("payment");
      url.searchParams.delete("session_id");
      url.searchParams.delete("redirect_status");
      url.searchParams.delete("payment_intent");
      url.searchParams.delete("payment_intent_client_secret");
      window.history.replaceState({}, "", url.toString());
    };

    // Stripe redirect_status after 3D Secure or similar redirects
    if (redirectStatus === "failed") {
      toast.error("Payment failed", {
        duration: 5000,
        description:
          "Your payment could not be processed. Please try again or use a different payment method.",
      });
      cleanUrl();
      return;
    }

    if (payment === "success" && sessionId) {
      toast.success("Payment successful! Your bid entry has been recorded.", {
        duration: 5000,
        description: "You will receive a confirmation email shortly.",
      });
      cleanUrl();
    } else if (
      payment === "success" ||
      redirectStatus === "succeeded"
    ) {
      toast.success("Payment successful! Your bid entry has been recorded.", {
        duration: 5000,
        description: "You will receive a confirmation email shortly.",
      });
      cleanUrl();
    } else if (payment === "failed") {
      toast.error("Payment failed", {
        duration: 5000,
        description:
          "Your payment could not be processed. Please try again or use a different payment method.",
      });
      cleanUrl();
    } else if (payment === "cancelled") {
      toast.error("Payment was cancelled", {
        duration: 4000,
        description:
          "Your bid entry was not placed. You can try again anytime.",
      });
      cleanUrl();
    }
  }, [searchParams]);

  return null;
}
