"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

export default function PaymentNotification() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const payment = searchParams.get("payment");
    const sessionId = searchParams.get("session_id");

    if (payment === "success" && sessionId) {
      toast.success("Payment successful! Your bid entry has been recorded.", {
        duration: 5000,
        description: "You will receive a confirmation email shortly.",
      });

      // Clean up URL parameters
      const url = new URL(window.location.href);
      url.searchParams.delete("payment");
      url.searchParams.delete("session_id");
      window.history.replaceState({}, "", url.toString());
    } else if (payment === "cancelled") {
      toast.error("Payment was cancelled", {
        duration: 4000,
        description: "Your bid entry was not placed. You can try again anytime.",
      });

      // Clean up URL parameters
      const url = new URL(window.location.href);
      url.searchParams.delete("payment");
      window.history.replaceState({}, "", url.toString());
    }
  }, [searchParams]);

  return null;
}
