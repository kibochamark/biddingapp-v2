"use client";

import { useState } from "react";
import { formatPrice } from "@/lib/format";
import { Gavel } from "lucide-react";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { LoginLink } from "@kinde-oss/kinde-auth-nextjs";
import { useRouter } from "next/navigation";

interface BidFormProps {
  productId: string;
  productTitle: string;
  biddingFee?: number;
  totalBids?: number;
  productStatus?: string;
}

export default function BidForm({
  productId,
  productTitle,
  biddingFee = 5,  // Default $5 per bid
  totalBids = 0,
  productStatus = "ACTIVE",
}: BidFormProps) {
  const [isPlacingBid, setIsPlacingBid] = useState(false);
  const { isAuthenticated, isLoading } = useKindeBrowserClient();
  const router = useRouter();

  const handlePlaceBid = async () => {
    if (!isAuthenticated || isPlacingBid) return;

    setIsPlacingBid(true);
    try {
      const response = await fetch("/api/bids", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to place bid");
      }

      const bid = await response.json();

      // Show success message
      alert(
        `🎉 Bid placed successfully!\n\n` +
        `Product: ${productTitle}\n` +
        `Bid Fee: ${formatPrice(biddingFee)}\n` +
        `Your Entry #${totalBids + 1}\n\n` +
        `Good luck! Winner will be selected when bidding ends.`
      );

      // Refresh the page to show updated bid count
      router.refresh();
    } catch (error: any) {
      alert(`Failed to place bid: ${error.message}`);
    } finally {
      setIsPlacingBid(false);
    }
  };

  const isActive = productStatus === "ACTIVE";
  const canBid = isActive && isAuthenticated && !isPlacingBid;

  return (
    <div className="space-y-4">
      {/* Bidding Info */}
      <div className="p-4 glass-card rounded-lg">
        <p className="text-sm text-muted-foreground mb-1">Entry Fee per Bid</p>
        <p className="text-3xl font-bold">{formatPrice(biddingFee)}</p>
        <p className="text-sm text-muted-foreground mt-1">
          Total Entries: {totalBids}
        </p>
      </div>

      {/* Status Message */}
      {!isActive && (
        <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            {productStatus === "CLOSED" && "Bidding has ended. Winner selection in progress."}
            {productStatus === "WINNER_SELECTED" && "Winner has been selected!"}
            {productStatus === "COMPLETED" && "This auction is completed."}
            {productStatus === "CANCELLED" && "This auction has been cancelled."}
            {productStatus === "DRAFT" && "This auction is not yet active."}
          </p>
        </div>
      )}

      {/* Place Bid Button */}
      {!isLoading && (
        <>
          {isAuthenticated ? (
            <button
              onClick={handlePlaceBid}
              disabled={!canBid}
              className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Gavel className="h-5 w-5" />
              {isPlacingBid ? "Placing Bid..." : "Place Bid"}
            </button>
          ) : (
            <LoginLink className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 flex items-center justify-center gap-2">
              <Gavel className="h-5 w-5" />
              Sign In to Place Bid
            </LoginLink>
          )}
        </>
      )}

      {/* Info */}
      <div className="text-xs text-muted-foreground space-y-1">
        <p>• Each bid costs {formatPrice(biddingFee)} (entry fee)</p>
        <p>• You can place multiple bids to increase your chances</p>
        <p>• Winner is randomly selected when bidding ends</p>
        <p>• More entries = higher chance of winning</p>
      </div>
    </div>
  );
}
