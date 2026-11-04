"use client";

import { useState } from "react";
import { formatPrice } from "@/lib/format";
import { Gavel, Loader2, CheckCircle2, Plus } from "lucide-react";
import { useKindeBrowserClient, LoginLink } from "@kinde-oss/kinde-auth-nextjs";
import BidPaymentModal from "./stripe/bid-payment-modal";
import { Button } from "@/components/ui/button";

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
        <div className="p-4 bg-success/10">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="h-5 w-5 text-success" />
            <p className="font-medium text-success">
              You&apos;re in this auction!
            </p>
          </div>
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-success/80">Your Entries</span>
              <span className="font-semibold text-success">
                {userBidInfo.totalEntries} {userBidInfo.totalEntries === 1 ? 'entry' : 'entries'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-success/80">Your Bid{userBidInfo.bidAmounts.length > 1 ? 's' : ''}</span>
              <span className="font-semibold text-success">
                {userBidInfo.bidAmounts.map(a => formatPrice(a)).join(', ')}
              </span>
            </div>
            <div className="flex justify-between items-center pt-1 border-t border-success/20">
              <span className="text-success/80">Total Invested</span>
              <span className="font-semibold text-success">
                {formatPrice(userBidInfo.totalSpent)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Bidding Info */}
      <div className="pb-4  ">
        <p className="text-xs font-medium text-mute uppercase tracking-wider mb-1">
          Entry Fee per Bid
        </p>
        <p className="text-3xl font-semibold text-ink">
          {formatPrice(biddingFee)}
        </p>
        <div className="flex items-center gap-1 mt-2">
          <Gavel className="h-4 w-4 text-mute" />
          <p className="text-sm text-mute">
            {totalBids} {totalBids === 1 ? "Entry" : "Entries"}
          </p>
        </div>
      </div>

      {/* Status Messages */}
      {!isActive && (
        <div className="p-4 bg-soft-cloud">
          <p className="text-sm font-medium text-ink">
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
            <Button
              onClick={handlePlaceBid}
              disabled={!isActive}
              size="lg"
              className="w-full"
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
            </Button>
          ) : (
            <div className="space-y-3">
              <LoginLink className="w-full h-12 bg-primary text-primary-foreground rounded-full font-medium flex items-center justify-center gap-2 hover:bg-primary/90 active:scale-95 transition-[transform,background-color]">
                <Gavel className="h-5 w-5" />
                Sign In to Place Bid
              </LoginLink>
              <p className="text-xs text-center text-mute">
                New to BidMarket? Sign in to get started
              </p>
            </div>
          )}
        </>
      )}

      {isLoading && (
        <div className="w-full h-12 bg-soft-cloud rounded-full flex items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-mute" />
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
