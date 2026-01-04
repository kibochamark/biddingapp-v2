"use client";

import { useState } from "react";
import { formatPrice } from "@/lib/format";
import { Gavel, CreditCard, Wallet, X, Loader2, ShieldCheck, Clock, AlertCircle } from "lucide-react";
import { useKindeBrowserClient, LoginLink } from "@kinde-oss/kinde-auth-nextjs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAppSelector } from "@/lib/redux/hooks";
import Link from "next/link";

interface BidFormProps {
  productId: string;
  productTitle: string;
  biddingFee?: number;
  totalBids?: number;
  productStatus?: string;
}

export default function BidFormNew({
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

  // Get verification status from Redux
  const kycStatus = useAppSelector((state) => state.kyc.data?.status);
  const isVerified = kycStatus === 'VERIFIED';
  const isPending = kycStatus === 'PENDING';
  const needsVerification = !kycStatus || kycStatus === 'NOT_SUBMITTED' || kycStatus === 'REJECTED';

  const handlePlaceBid = async () => {
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

      toast.success(`Bid placed successfully! Total entries: ${totalBids + 1}`);
      setShowPaymentModal(false);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to place bid");
    } finally {
      setIsRedirecting(false);
    }
  };

  const isActive = productStatus === "ACTIVE";

  // Render verification message based on status
  const renderVerificationMessage = () => {
    if (isPending) {
      return (
        <div className="p-6 border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/40 rounded-full shrink-0">
              <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg text-blue-900 dark:text-blue-100 mb-2">
                Verification Pending
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-300 mb-4">
                Your identity verification is currently being reviewed. This usually takes 1-2 business days.
                You'll be able to place bids once your account is approved.
              </p>
              <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span>Under Review</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (needsVerification) {
      return (
        <div className="p-6 border-2 border-amber-200 dark:border-amber-800 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40 rounded-full shrink-0">
              <AlertCircle className="h-6 w-6 text-amber-700 dark:text-amber-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg text-amber-900 dark:text-amber-100 mb-2">
                Verification Required
              </h3>
              <p className="text-sm text-amber-700 dark:text-amber-300 mb-4">
                To place bids and participate in auctions, you need to verify your identity.
                This helps us maintain a safe and trusted marketplace for all users.
              </p>
              <Link
                href="/profile/verification"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg transform hover:scale-105"
              >
                <ShieldCheck className="h-4 w-4" />
                Complete Verification
              </Link>
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-3">
                ✓ Takes only 2-3 minutes  •  ✓ Review in 1-2 business days
              </p>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="space-y-4">
      {/* Bidding Info */}
      <div className="p-4 glass-card rounded-lg border-2 border-primary/20">
        <p className="text-sm text-muted-foreground mb-1">Entry Fee per Bid</p>
        <p className="text-3xl font-bold text-primary">{formatPrice(biddingFee)}</p>
        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center gap-1">
            <Gavel className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {totalBids} {totalBids === 1 ? 'Entry' : 'Entries'}
            </p>
          </div>
        </div>
      </div>

      {/* Status Messages */}
      {!isActive && (
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-lg">
          <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
            {productStatus === "CLOSED" && "Bidding has ended. Winner selection in progress."}
            {productStatus === "WINNER_SELECTED" && "Winner has been selected!"}
            {productStatus === "COMPLETED" && "This auction has been completed."}
          </p>
        </div>
      )}

      {/* Main Action Button */}
      {!isLoading && (
        <>
          {isAuthenticated ? (
            isVerified ? (
              <button
                onClick={() => setShowPaymentModal(true)}
                disabled={!isActive}
                className="w-full py-3.5 bg-gradient-to-r from-primary to-orange-600 text-white rounded-lg font-semibold hover:from-primary/90 hover:to-orange-600/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg transform hover:scale-105"
              >
                <Gavel className="h-5 w-5" />
                Place Bid Now
              </button>
            ) : (
              renderVerificationMessage()
            )
          ) : (
            <div className="space-y-3">
              <LoginLink className="w-full py-3.5 bg-gradient-to-r from-primary to-orange-600 text-white rounded-lg font-semibold hover:from-primary/90 hover:to-orange-600/90 flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg transform hover:scale-105">
                <Gavel className="h-5 w-5" />
                Sign In to Place Bid
              </LoginLink>
              <p className="text-xs text-center text-muted-foreground">
                New to BidMarket? Sign in to get started
              </p>
            </div>
          )}
        </>
      )}

      {isLoading && (
        <div className="w-full py-3.5 bg-muted rounded-lg flex items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="glass-card bg-background border-2 border-border w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-border bg-gradient-to-r from-primary/5 to-orange-600/5">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold">Select Payment Method</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Entry Fee: <span className="font-semibold text-primary">{formatPrice(biddingFee)}</span>
                  </p>
                </div>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="p-2 hover:bg-muted rounded-full transition-colors"
                  disabled={isRedirecting}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Payment Options */}
            <div className="p-6 space-y-3">
              <button
                disabled={isRedirecting}
                onClick={handlePlaceBid}
                className="w-full group relative flex items-center justify-between p-5 border-2 border-border rounded-xl hover:border-primary hover:bg-primary/5 transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="flex items-center gap-4 relative z-10">
                  <div className="p-3 bg-primary/10 rounded-xl text-primary group-hover:scale-110 transition-transform">
                    <CreditCard className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground">Card Payment (Stripe)</p>
                    <p className="text-xs text-muted-foreground">Visa, Mastercard, Apple Pay, Google Pay</p>
                  </div>
                </div>
                {isRedirecting ? (
                  <Loader2 className="h-5 w-5 animate-spin text-primary relative z-10" />
                ) : (
                  <div className="h-5 w-5 rounded-full border-2 border-primary relative z-10" />
                )}
              </button>

              <button
                disabled={isRedirecting}
                onClick={() => toast.info("PayPal integration coming soon!")}
                className="w-full group relative flex items-center justify-between p-5 border-2 border-border rounded-xl hover:border-blue-500 hover:bg-blue-500/5 transition-all text-left disabled:opacity-50"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="flex items-center gap-4 relative z-10">
                  <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500 group-hover:scale-110 transition-transform">
                    <Wallet className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground">PayPal</p>
                    <p className="text-xs text-muted-foreground">PayPal Balance or Credit</p>
                  </div>
                </div>
                <div className="h-5 w-5 rounded-full border-2 border-blue-500 relative z-10" />
              </button>
            </div>

            {/* Footer */}
            <div className="p-4 bg-muted/30 text-center border-t border-border">
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="h-3 w-3" />
                <span className="uppercase tracking-wider">Secure Payment • SSL Encrypted</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
