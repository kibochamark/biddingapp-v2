"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

export default function CancelledNotification() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const payment = searchParams.get("payment");

    if (payment === "cancelled") {
      toast.warning("Payment was cancelled", {
        duration: 4000,
        description: "No charges were made. You can try placing your bid again.",
      });

      // Clean up URL parameters
      const url = new URL(window.location.href);
      url.searchParams.delete("payment");
      window.history.replaceState({}, "", url.toString());
    }
  }, [searchParams]);

  return null;
}
