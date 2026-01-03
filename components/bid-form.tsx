"use client";

import { useState } from "react";
import { formatPrice } from "@/lib/format";
import { Gavel, CreditCard, Wallet, X, Loader2 } from "lucide-react";
import { useKindeBrowserClient, LoginLink } from "@kinde-oss/kinde-auth-nextjs";
import { createBidCheckout } from "@/lib/stripe-actions";
import { useRouter } from "next/navigation";
import { toast } from "@/lib/toast";

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
  biddingFee = 5,
  totalBids = 0,
  productStatus = "ACTIVE",
}: BidFormProps) {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const { isAuthenticated, isLoading } = useKindeBrowserClient();
  const router = useRouter();

  const [isPlacingBid, setIsPlacingBid] = useState(false);

  const handleStripeChoice = async () => {
    setIsRedirecting(true);
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

      await response.json();

      // Show success message with toast
      toast.bid.placed(totalBids + 1);

      // Refresh the page to show updated bid count
      router.refresh();
    } catch (error: any) {
      toast.bid.failed(error.message);
    } finally {
      setIsPlacingBid(false);
    }
  };

  const isActive = productStatus === "ACTIVE";

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

      {/* Status Messages */}
      {!isActive && (
        <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            {productStatus === "CLOSED" && "Bidding has ended. Winner selection in progress."}
            {productStatus === "WINNER_SELECTED" && "Winner has been selected!"}
            {/* ... other statuses */}
          </p>
        </div>
      )}

      {/* Main Action Button */}
      {!isLoading && (
        <>
          {isAuthenticated ? (
            <button
              onClick={() => setShowPaymentModal(true)}
              disabled={!isActive}
              className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2"
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
        </>
      )}

      {/* CUSTOM PAYMENT SELECTION WINDOW (Modal) */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="glass-card bg-background border border-border w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-border flex justify-between items-center bg-muted/10">
              <div>
                <h3 className="text-xl font-bold">Select Payment</h3>
                <p className="text-sm text-muted-foreground italic">Fee: {formatPrice(biddingFee)}</p>
              </div>
              <button 
                onClick={() => setShowPaymentModal(false)} 
                className="p-2 hover:bg-muted rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Selection Options */}
            <div className="p-6 space-y-3">
              <button
                disabled={isRedirecting}
                onClick={handleStripeChoice}
                className="w-full group flex items-center justify-between p-4 border-2 border-border rounded-xl hover:border-primary hover:bg-primary/5 transition-all text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <CreditCard className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-bold">Global Methods (Stripe)</p>
                    <p className="text-xs text-muted-foreground">Visa, Apple Pay, Klarna</p>
                  </div>
                </div>
                {isRedirecting ? <Loader2 className="animate-spin h-5 w-5" /> : <div className="h-4 w-4 rounded-full border border-primary" />}
              </button>

              <button
                disabled={isRedirecting}
                onClick={() => alert('PayPal Integration Selected')}
                className="w-full group flex items-center justify-between p-4 border-2 border-border rounded-xl hover:border-blue-500 hover:bg-blue-500/5 transition-all text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                    <Wallet className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-bold">PayPal</p>
                    <p className="text-xs text-muted-foreground">PayPal Balance or Credit</p>
                  </div>
                </div>
                <div className="h-4 w-4 rounded-full border border-blue-500" />
              </button>
            </div>

            <div className="p-4 bg-muted/5 text-center border-t border-border">
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Secure Global Checkout</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}