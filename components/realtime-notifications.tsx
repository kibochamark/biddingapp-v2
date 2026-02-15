"use client";

import { useEffect, useRef } from "react";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { toast } from "sonner";

interface PaymentEvent {
  type: "payment_success" | "payment_failed" | "connected";
  productId?: string;
  productTitle?: string;
  message?: string;
}

export default function RealtimeNotifications() {
  const { isAuthenticated, isLoading } = useKindeBrowserClient();
  const eventSourceRef = useRef<EventSource | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const retryCountRef = useRef(0);

  useEffect(() => {
    if (isLoading || !isAuthenticated) return;

    function connect() {
      // Close existing connection if any
      eventSourceRef.current?.close();

      const es = new EventSource("/api/notifications/stream");
      eventSourceRef.current = es;

      es.onmessage = (event) => {
        try {
          const data: PaymentEvent = JSON.parse(event.data);

          if (data.type === "connected") {
            retryCountRef.current = 0;
            return;
          }

          if (data.type === "payment_success") {
            toast.success("Payment successful!", {
              duration: 5000,
              description: data.productTitle
                ? `Your bid entry for "${data.productTitle}" has been recorded.`
                : "Your bid entry has been recorded.",
            });
          }

          if (data.type === "payment_failed") {
            toast.error("Payment failed", {
              duration: 5000,
              description:
                data.message ||
                "Your payment could not be processed. Please try again.",
            });
          }
        } catch {
          // Ignore malformed messages
        }
      };

      es.onerror = () => {
        es.close();
        // Exponential backoff: 1s, 2s, 4s, 8s, 16s, max 30s
        const delay = Math.min(1000 * 2 ** retryCountRef.current, 30_000);
        retryCountRef.current++;
        retryTimeoutRef.current = setTimeout(connect, delay);
      };
    }

    connect();

    return () => {
      eventSourceRef.current?.close();
      if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
    };
  }, [isAuthenticated, isLoading]);

  return null;
}
