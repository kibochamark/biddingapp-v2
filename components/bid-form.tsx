"use client";

import { useState } from "react";
import { formatPrice } from "@/lib/format";
import { Gavel, Loader2, CheckCircle2, Plus } from "lucide-react";
import { useKindeBrowserClient, LoginLink } from "@kinde-oss/kinde-auth-nextjs";
import BidPaymentModal from "./stripe/bid-payment-modal";

interface UserBidInfo {
  totalEntries: number;
  bidAmounts: number[]; // Different bid amounts the user has placed
  totalSpent: number;
}

interface BidFormProps {
  productId: string;
  productTitle: string;
  biddingFee?: number;
  totalBids?: number;
  productStatus?: string;
  userBidInfo?: UserBidInfo | null;
  auction_id:string;
  bidended:boolean
}

export default function BidFormNew({
  productId,
  productTitle,
  biddingFee = 5,
  totalBids = 0,
  productStatus = "ACTIVE",
  userBidInfo,
  auction_id,
  bidended
}: BidFormProps) {
  const { isAuthenticated, isLoading, user } = useKindeBrowserClient();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePlaceBid = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const isActive = productStatus === "ACTIVE";
  const hasActiveBid = userBidInfo && userBidInfo.totalEntries > 0;


  return (
    <div className="space-y-4">
      {/* User's Active Bid Status */}
      {hasActiveBid && isAuthenticated && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
            <p className="font-semibold text-green-800 dark:text-green-200">
              You&apos;re in this auction!
            </p>
          </div>
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-green-700 dark:text-green-300">Your Entries</span>
              <span className="font-bold text-green-800 dark:text-green-200">
                {userBidInfo.totalEntries} {userBidInfo.totalEntries === 1 ? 'entry' : 'entries'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-green-700 dark:text-green-300">Your Bid{userBidInfo.bidAmounts.length > 1 ? 's' : ''}</span>
              <span className="font-bold text-green-800 dark:text-green-200">
                {userBidInfo.bidAmounts.map(a => formatPrice(a)).join(', ')}
              </span>
            </div>
            <div className="flex justify-between items-center pt-1 border-t border-green-200 dark:border-green-700">
              <span className="text-green-700 dark:text-green-300">Total Invested</span>
              <span className="font-bold text-green-800 dark:text-green-200">
                {formatPrice(userBidInfo.totalSpent)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Bidding Info */}
      <div className="p-5 rounded-2xl border border-primary/20 bg-primary/5">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
          Entry Fee per Bid
        </p>
        <p className="text-3xl font-extrabold text-primary">
          {formatPrice(biddingFee)}
        </p>
        <div className="flex items-center gap-1 mt-2">
          <Gavel className="h-4 w-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            {totalBids} {totalBids === 1 ? "Entry" : "Entries"}
          </p>
        </div>
      </div>

      {/* Status Messages */}
      {!isActive && (
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-2xl">
          <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-200">
            {productStatus === "CLOSED" &&
              "Bidding has ended. Winner selection in progress."}
            {productStatus === "WINNER_SELECTED" &&
              "Winner has been selected!"}
            {productStatus === "COMPLETED" &&
              "This auction has been completed."}
          </p>
        </div>
      )}

      {/* Main Action Button */}
      {!isLoading && !bidended && (
        <>
          {isAuthenticated ? (
            <button
              onClick={handlePlaceBid}
              disabled={!isActive}
              className="w-full py-3.5 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              {hasActiveBid ? (
                <>
                  <Plus className="h-5 w-5" />
                  Add More Entries
                </>
              ) : (
                <>
                  <Gavel className="h-5 w-5" />
                  Place Bid Now
                </>
              )}
            </button>
          ) : (
            <div className="space-y-3">
              <LoginLink className="w-full py-3.5 bg-primary text-primary-foreground rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors shadow-sm">
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
        <div className="w-full py-3.5 bg-muted rounded-xl flex items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Payment Modal */}
      {isAuthenticated && user && (
        <BidPaymentModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          productId={productId}
          productTitle={productTitle}
          biddingFee={biddingFee}
          auction_id={auction_id}
          user={{
            id: user.id || "",
            name: `${user.given_name || ""} ${user.family_name || ""}`.trim() || "User",
            email: user.email || "",
          }}
        />
      )}
    </div>
  );
}
