"use client";

import { useEffect, useMemo } from "react";
import { UserBid } from "@/lib/types";
import {
  Gavel,
  Trophy,
  Clock,
  Sparkles,
  ChevronRight,
  AlertCircle,
  DollarSign,
  Target,
  ArrowUpRight,
  Package,
  Calendar,
  CreditCard,
  CheckCircle2,
} from "lucide-react";
import { formatPrice, formatDateTime, formatTimeRemaining } from "@/lib/format";
import { toast } from "@/lib/toast";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface MyBidsSectionProps {
  bids: UserBid[];
  error?: string;
}

// Helper to parse currency string to number
function parseAmount(amount: string): number {
  return parseFloat(amount) || 0;
}

// Helper to check if an auction has concluded (ended or winner determined)
function isAuctionEnded(status: string): boolean {
  return status === "ENDED" || status === "WINNER_DETERMINED";
}

// Status badge component
function StatusBadge({
  isWinning,
  isUnique,
  auctionStatus,
}: {
  isWinning: boolean;
  isUnique: boolean;
  auctionStatus: string;
}) {
  if (isAuctionEnded(auctionStatus)) {
    return isWinning ? (
      <Badge variant="success">
        <Trophy className="h-3 w-3" />
        Winner
      </Badge>
    ) : (
      <Badge variant="default">Ended</Badge>
    );
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {isWinning && (
        <Badge variant="success">
          <Trophy className="h-3 w-3" />
          Leading
        </Badge>
      )}
      {isUnique && (
        <Badge variant="default">
          <Sparkles className="h-3 w-3" />
          Unique
        </Badge>
      )}
      {!isWinning && !isUnique && (
        <Badge variant="default">
          <Clock className="h-3 w-3" />
          Active
        </Badge>
      )}
    </div>
  );
}

// Countdown timer component
function CountdownBadge({ endDate }: { endDate: string }) {
  const timeRemaining = formatTimeRemaining(new Date(endDate));
  const isEnding = timeRemaining !== "Ended" && !timeRemaining.includes("d");

  if (timeRemaining === "Ended") {
    return null;
  }

  return (
    <Badge variant={isEnding ? "sale" : "default"}>
      <Clock className="h-3 w-3" />
      {timeRemaining}
    </Badge>
  );
}

// KLM-inspired Won Auction Card
function WonAuctionCard({ bid }: { bid: UserBid }) {
  const bidAmount = parseAmount(bid.bidAmount);
  const entryFee = parseAmount(bid.entryFeePaid);
  const totalPaid = parseAmount(bid.totalPaid);
  const prizeValue = bid.auction.prizeValue ? parseAmount(bid.auction.prizeValue) : null;

  return (
    <div className="border border-hairline overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 px-5 py-4 border-b border-hairline">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <Trophy className="h-4 w-4 shrink-0 text-success" />
            <span className="text-xs font-medium text-mute uppercase tracking-wider">Auction Won</span>
          </div>
          <h3 className="font-medium text-lg leading-tight truncate text-ink">{bid.auction.title}</h3>
        </div>
        <Badge variant="success" className="shrink-0">Won</Badge>
      </div>

      {/* Pricing rows */}
      <div className="divide-y divide-hairline">
        {prizeValue !== null && (
          <div className="flex items-center justify-between px-5 py-3.5">
            <div className="flex items-center gap-2.5">
              <Package className="h-4 w-4 text-mute" />
              <span className="text-sm text-mute">Product Value</span>
            </div>
            <span className="text-base font-medium text-ink">{formatPrice(prizeValue)}</span>
          </div>
        )}

        <div className="flex items-center justify-between px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            <Target className="h-4 w-4 text-success" />
            <span className="text-sm font-medium text-ink">Your Winning Bid</span>
          </div>
          <span className="text-base font-medium text-success">{formatPrice(bidAmount)}</span>
        </div>

        <div className="flex items-center justify-between px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            <CreditCard className="h-4 w-4 text-mute" />
            <span className="text-sm text-mute">Entry Fee Paid</span>
          </div>
          <span className="text-sm font-medium text-ink">{formatPrice(entryFee)}</span>
        </div>

        <div className="flex items-center justify-between px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            <DollarSign className="h-4 w-4 text-mute" />
            <span className="text-sm text-mute">Total Paid</span>
          </div>
          <span className="text-sm font-medium text-ink">{formatPrice(totalPaid)}</span>
        </div>

        <div className="flex items-center justify-between px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            <Calendar className="h-4 w-4 text-mute" />
            <span className="text-sm text-mute">Date Won</span>
          </div>
          <span className="text-sm font-medium text-ink">{formatDateTime(bid.placedAt)}</span>
        </div>

        <div className="flex items-center justify-between px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-mute" />
            <span className="text-sm text-mute">Payment</span>
          </div>
          <Badge
            variant={
              bid.paymentStatus === "PAID"
                ? "success"
                : bid.paymentStatus === "PENDING"
                ? "default"
                : "sale"
            }
          >
            {bid.paymentStatus}
          </Badge>
        </div>

        {prizeValue !== null && bidAmount > 0 && (
          <div className="flex items-center justify-between px-5 py-3.5">
            <div className="flex items-center gap-2.5">
              <Sparkles className="h-4 w-4 text-success" />
              <span className="text-sm font-medium text-success">You Saved</span>
            </div>
            <span className="text-base font-medium text-success">
              {formatPrice(prizeValue - totalPaid)}
            </span>
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <Link
        href={`/product/${bid.auction.productId}`}
        className="flex items-center justify-center gap-2 px-5 py-3.5 bg-success text-white hover:bg-success/90 font-medium text-sm transition-colors"
      >
        Claim Your Prize
        <ChevronRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

// Compact bid card for active/past bids
function BidCard({ bid }: { bid: UserBid }) {
  const bidAmount = parseAmount(bid.bidAmount);
  const entryFee = parseAmount(bid.entryFeePaid);
  const isActive = bid.auction.status === "ACTIVE";

  return (
    <Link
      href={`/product/${bid.auction.productId}`}
      className={`group relative flex flex-col border overflow-hidden transition-colors ${
        bid.isWinning && isActive
          ? "border-success/40"
          : "border-hairline hover:border-ink/30"
      }`}
    >
      <div className="flex flex-col flex-1 p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <StatusBadge
              isWinning={bid.isWinning}
              isUnique={bid.isUnique}
              auctionStatus={bid.auction.status}
            />
            {isActive && <CountdownBadge endDate={bid.auction.endDate} />}
          </div>
          <ArrowUpRight className="h-4 w-4 text-mute opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
        </div>

        {/* Title */}
        <h3 className="font-medium leading-tight mb-2 text-base line-clamp-2 text-ink group-hover:text-primary transition-colors">
          {bid.auction.title}
        </h3>

        {/* Date */}
        <p className="text-xs text-mute mb-4">
          {formatDateTime(bid.placedAt)}
        </p>

        {/* Bid details */}
        <div className="grid gap-3 grid-cols-2">
          <div className="bg-soft-cloud rounded-lg p-3">
            <p className="text-[10px] uppercase tracking-wider text-mute mb-1">Your Bid</p>
            <p className="font-medium text-primary text-lg">
              {formatPrice(bidAmount)}
            </p>
          </div>
          <div className="bg-soft-cloud rounded-lg p-3">
            <p className="text-[10px] uppercase tracking-wider text-mute mb-1">Entry Fee</p>
            <p className="font-medium text-ink text-lg">
              {formatPrice(entryFee)}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom action bar */}
      <div className="border-t border-hairline px-4 py-3 bg-soft-cloud flex items-center justify-between">
        <span className="text-xs text-mute">View details</span>
        <ChevronRight className="h-4 w-4 text-mute group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
      </div>
    </Link>
  );
}

export default function MyBidsSection({ bids, error }: MyBidsSectionProps) {
  // Show error toast on mount if there's an error
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Compute stats
  const stats = useMemo(() => {
    const activeBids = bids.filter((b) => b.auction.status === "ACTIVE");
    const winningBids = bids.filter((b) => b.isWinning);
    const endedBids = bids.filter((b) => isAuctionEnded(b.auction.status));
    const uniqueBids = bids.filter((b) => b.isUnique);

    const totalSpent = bids.reduce((sum, b) => sum + parseAmount(b.entryFeePaid), 0);
    const leadingBidsCount = activeBids.filter((b) => b.isWinning).length;

    return {
      total: bids.length,
      active: activeBids.length,
      winning: winningBids.length,
      ended: endedBids.length,
      unique: uniqueBids.length,
      totalSpent,
      leading: leadingBidsCount,
      activeBids,
      endedBids,
      wonAuctions: endedBids.filter((b) => b.isWinning),
    };
  }, [bids]);

  // Error state
  if (error && bids.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-medium text-ink uppercase">My Bids</h1>
            <p className="text-mute mt-1">Track all your auction bids</p>
          </div>
        </div>

        <div className="bg-soft-cloud p-8 text-center">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-sale" />
          <h2 className="text-lg font-medium mb-2 text-ink">Unable to load bids</h2>
          <p className="text-mute mb-4 max-w-md mx-auto">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  // Empty state
  if (bids.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-medium text-ink uppercase">My Bids</h1>
            <p className="text-mute mt-1">Track all your auction bids</p>
          </div>
        </div>

        <div className="bg-soft-cloud p-8 sm:p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-background mb-6">
            <Gavel className="h-8 w-8 text-ink" />
          </div>
          <h2 className="text-xl font-medium mb-2 text-ink">No bids yet</h2>
          <p className="text-mute mb-6 max-w-md mx-auto">
            Start bidding on auctions to see your bid history here. Find amazing deals on unique products!
          </p>
          <Button asChild>
            <Link href="/catalog?sortBy=ending_soon">
              Browse Auctions
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-medium text-ink uppercase">My Bids</h1>
          <p className="text-mute mt-1">
            {stats.total} bid{stats.total !== 1 ? "s" : ""} across{" "}
            {new Set(bids.map((b) => b.auctionId)).size} auction
            {new Set(bids.map((b) => b.auctionId)).size !== 1 ? "s" : ""}
          </p>
        </div>
        <Button asChild>
          <Link href="/catalog?sortBy=ending_soon">
            <Gavel className="h-4 w-4" />
            Place New Bid
          </Link>
        </Button>
      </div>

      {/* Scrollable Content */}
      <div className="max-h-[600px] overflow-y-auto pr-1">
        <div className="space-y-6">
          {/* Quick Stats Row */}
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3 py-4 border-y border-hairline">
            <div>
              <p className="text-xs text-mute mb-0.5">Won</p>
              <p className="text-xl font-medium text-ink">{stats.wonAuctions.length}</p>
            </div>
            <div>
              <p className="text-xs text-mute mb-0.5">Active</p>
              <p className="text-xl font-medium text-ink">{stats.active}</p>
            </div>
            <div>
              <p className="text-xs text-mute mb-0.5">Leading</p>
              <p className="text-xl font-medium text-ink">{stats.leading}</p>
            </div>
            <div>
              <p className="text-xs text-mute mb-0.5">Spent</p>
              <p className="text-xl font-medium text-ink">{formatPrice(stats.totalSpent)}</p>
            </div>
          </div>

          {/* Won Auctions Section */}
          {stats.wonAuctions.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="h-5 w-5 text-success" />
                <h2 className="text-lg font-medium text-ink">Won Auctions</h2>
                <Badge variant="success">{stats.wonAuctions.length}</Badge>
              </div>
              <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
                {stats.wonAuctions.map((bid) => (
                  <WonAuctionCard key={bid.id} bid={bid} />
                ))}
              </div>
            </section>
          )}

          {/* Active Bids Section */}
          {stats.activeBids.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Clock className="h-5 w-5 text-ink" />
                <h2 className="text-lg font-medium text-ink">Active Bids</h2>
                <Badge variant="default">{stats.activeBids.length}</Badge>
              </div>
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {stats.activeBids.map((bid) => (
                  <BidCard key={bid.id} bid={bid} />
                ))}
              </div>
            </section>
          )}

          {/* Past Bids Section */}
          {stats.endedBids.filter((b) => !b.isWinning).length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Gavel className="h-5 w-5 text-mute" />
                <h2 className="text-lg font-medium text-ink">Past Bids</h2>
                <Badge variant="default">
                  {stats.endedBids.filter((b) => !b.isWinning).length}
                </Badge>
              </div>
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {stats.endedBids
                  .filter((b) => !b.isWinning)
                  .map((bid) => (
                    <BidCard key={bid.id} bid={bid} />
                  ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
