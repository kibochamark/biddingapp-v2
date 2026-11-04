"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { toast } from "sonner";
import { revalidateBidsAction } from "@/lib/actions/revalidateBidAction";
import { BID_TAGS } from "@/lib/api/bids";

interface RealtimeEvent {
  type: "payment_success" | "payment_failed" | "connected" | "error";
  productId?: string;
  productTitle?: string;
  message?: string;
}

export default function RealtimeNotifications() {
  const { isAuthenticated, isLoading, user } = useKindeBrowserClient();
  const router = useRouter();
  const pathname = usePathname();
  const pathnameRef = useRef(pathname);
  pathnameRef.current = pathname;
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
          const data: RealtimeEvent = JSON.parse(event.data);

          if (data.type === "connected") {
            retryCountRef.current = 0;
            return;
          }

          if (data.type === "error") {
            console.error("Realtime notification stream error:", data.message);
            return;
          }

          if (data.type === "payment_success" || data.type === "payment_failed") {
            // A payment message landed — invalidate the bid-history cache
            // right away rather than waiting out fetchUserBids' own
            // revalidate window (lib/api/bids.ts tags this BID_TAGS.user(id),
            // cached 60s via apiFetch). Both the route's own cache and the
            // underlying fetch's Data Cache entry need clearing.
            if (user?.id) {
              revalidateBidsAction({
                path: "/profile/bids",
                tag: BID_TAGS.user(user.id),
              }).catch((err) => {
                console.error("Failed to revalidate bids after payment event:", err);
              });
            }
          }

          if (data.type === "payment_success") {
            toast.success("Payment successful!", {
              duration: 5000,
              description: data.productTitle
                ? `Your bid entry for "${data.productTitle}" has been recorded.`
                : "Your bid entry has been recorded.",
            });
            // The product page is fully dynamic — refresh it so the bidder's
            // own entry/bid count shows up immediately if they're still on it.
            if (data.productId && pathnameRef.current === `/product/${data.productId}`) {
              router.refresh();
            }
            // Refresh in place if they're already looking at their bid history.
            if (pathnameRef.current === "/profile/bids") {
              router.refresh();
            }
          }

          if (data.type === "payment_failed") {
            toast.error("Payment failed", {
              duration: 5000,
              description:
                data.message ||
                "Your payment could not be processed. Please try again.",
            });
            if (pathnameRef.current === "/profile/bids") {
              router.refresh();
            }
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
