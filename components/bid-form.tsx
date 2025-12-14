"use client";

import { useState } from "react";
import { formatPrice } from "@/lib/format";
import { Gavel } from "lucide-react";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { LoginLink } from "@kinde-oss/kinde-auth-nextjs";

interface BidFormProps {
  currentBid: number;
  minBid: number;
  buyNowPrice?: number;
  productTitle: string;
}

export default function BidForm({
  currentBid,
  minBid,
  buyNowPrice,
  productTitle,
}: BidFormProps) {
  const [bidAmount, setBidAmount] = useState<string>(minBid.toString());
  const { isAuthenticated, isLoading } = useKindeBrowserClient();

  const handlePlaceBid = () => {
    if (!isAuthenticated) {
      return; // This should not happen as the button is disabled
    }
    // This would initiate the payment process - out of scope for now
    alert(`Bid placement initiated for ${formatPrice(parseFloat(bidAmount))} on "${productTitle}". Payment processing is not implemented in this MVP.`);
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      return; // This should not happen as the button is disabled
    }
    // This would initiate the payment process - out of scope for now
    alert(`Buy Now initiated for ${formatPrice(buyNowPrice!)} on "${productTitle}". Payment processing is not implemented in this MVP.`);
  };

  return (
    <div className="space-y-4">
      {/* Current Bid */}
      <div className="p-4 glass-card rounded-lg">
        <p className="text-sm text-muted-foreground mb-1">Current bid</p>
        <p className="text-3xl font-bold">{formatPrice(currentBid)}</p>
        <p className="text-sm text-muted-foreground mt-1">
          Minimum next bid: {formatPrice(minBid)}
        </p>
      </div>

      {/* Bid Input */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Your bid amount</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            $
          </span>
          <input
            type="number"
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
            min={minBid}
            step="1"
            className="w-full pl-8 pr-4 py-3 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      {/* Place Bid Button */}
      {!isLoading && (
        <>
          {isAuthenticated ? (
            <button
              onClick={handlePlaceBid}
              disabled={parseFloat(bidAmount) < minBid}
              className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Gavel className="h-5 w-5" />
              Place Bid
            </button>
          ) : (
            <LoginLink className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 flex items-center justify-center gap-2">
              <Gavel className="h-5 w-5" />
              Sign In to Place Bid
            </LoginLink>
          )}

          {/* Buy Now Button */}
          {buyNowPrice && (
            <>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">or</span>
                </div>
              </div>

              {isAuthenticated ? (
                <button
                  onClick={handleBuyNow}
                  className="w-full py-3 bg-secondary text-secondary-foreground rounded-lg font-semibold hover:bg-secondary/90 border border-border"
                >
                  Buy Now for {formatPrice(buyNowPrice)}
                </button>
              ) : (
                <LoginLink className="w-full py-3 bg-secondary text-secondary-foreground rounded-lg font-semibold hover:bg-secondary/90 border border-border block text-center">
                  Sign In to Buy Now
                </LoginLink>
              )}
            </>
          )}
        </>
      )}

      {/* Info */}
      <div className="text-xs text-muted-foreground space-y-1">
        <p>• Bids are binding commitments</p>
        <p>• Payment will be processed if you win</p>
        <p>• Secure checkout with buyer protection</p>
      </div>
    </div>
  );
}
