"use client";

import { useEffect, useState } from "react";
import { Bid } from "@/lib/types";
import { User, TrendingUp } from "lucide-react";
import { formatDateTime } from "@/lib/format";

interface BidHistoryProps {
  productId: string;
  initialBids?: Bid[];
}

export default function BidHistory({ productId, initialBids = [] }: BidHistoryProps) {
  const [bids, setBids] = useState<Bid[]>(initialBids);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch bids on mount and refresh
  useEffect(() => {
    const fetchBids = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/products/${productId}/bids`);
        if (response.ok) {
          const data = await response.json();
          setBids(data);
        }
      } catch (error) {
        console.error("Failed to fetch bids:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBids();

    // Poll for updates every 30 seconds (optional - can be removed for MVP)
    const interval = setInterval(fetchBids, 30000);
    return () => clearInterval(interval);
  }, [productId]);

  if (isLoading && bids.length === 0) {
    return (
      <div className="glass-card rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Recent Bids
        </h3>
        <p className="text-muted-foreground text-center py-4">Loading bids...</p>
      </div>
    );
  }

  if (bids.length === 0) {
    return (
      <div className="glass-card rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Recent Bids
        </h3>
        <p className="text-muted-foreground text-center py-8">
          No bids yet. Be the first to bid!
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <TrendingUp className="h-5 w-5" />
        Recent Bids ({bids.length})
      </h3>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {bids.slice(0, 20).map((bid, index) => (
          <div
            key={bid.id}
            className="flex items-center justify-between p-3 bg-background/50 rounded-lg border border-border/50"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">
                  {bid.bidderName || "Anonymous"}
                </p>
                <p className="text-xs text-muted-foreground">
                  Entry #{bids.length - index}
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-xs text-muted-foreground">
                {formatDateTime(bid.createdAt)}
              </p>
              {bid.isWinner && (
                <span className="text-xs font-semibold text-green-600">
                  🏆 Winner
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {bids.length > 20 && (
        <p className="text-xs text-muted-foreground text-center mt-3">
          Showing 20 most recent bids
        </p>
      )}
    </div>
  );
}
