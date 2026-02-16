"use client";

import { useEffect, useMemo } from "react";
import { UserBid } from "@/lib/types";
import {
  Gavel,
  Trophy,
  Clock,
  TrendingUp,
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
import { ScrollArea } from "@/components/ui/scroll-area";

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
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
        <Trophy className="h-3 w-3" />
        Winner
      </span>
    ) : (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
        Ended
      </span>
    );
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {isWinning && (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
          <Trophy className="h-3 w-3" />
          Leading
        </span>
      )}
      {isUnique && (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
          <Sparkles className="h-3 w-3" />
          Unique
        </span>
      )}
      {!isWinning && !isUnique && (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
          <Clock className="h-3 w-3" />
          Active
        </span>
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
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
        isEnding
          ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 animate-pulse"
          : "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
      }`}
    >
      <Clock className="h-3 w-3" />
      {timeRemaining}
    </span>
  );
}

// KLM-inspired Won Auction Card
function WonAuctionCard({ bid }: { bid: UserBid }) {
  const bidAmount = parseAmount(bid.bidAmount);
  const entryFee = parseAmount(bid.entryFeePaid);
  const totalPaid = parseAmount(bid.totalPaid);
  const prizeValue = bid.auction.prizeValue ? parseAmount(bid.auction.prizeValue) : null;

  return (
    <div className="rounded-2xl border border-green-200 dark:border-green-800/50 overflow-hidden bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow">
      {/* Header - KLM inspired colored top section */}
      <div className="bg-linear-to-r from-green-500 to-emerald-600 px-5 py-4 text-white">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <Trophy className="h-4 w-4 shrink-0" />
              <span className="text-xs font-medium text-white/80 uppercase tracking-wider">Auction Won</span>
            </div>
            <h3 className="font-bold text-lg leading-tight truncate">{bid.auction.title}</h3>
          </div>
          <div className="shrink-0 ml-3 bg-white/20 backdrop-blur-sm rounded-lg px-2.5 py-1">
            <span className="text-xs font-bold">WON</span>
          </div>
        </div>
      </div>

      {/* Pricing rows - KLM table-style */}
      <div className="divide-y divide-border/60">
        {prizeValue !== null && (
          <div className="flex items-center justify-between px-5 py-3.5">
            <div className="flex items-center gap-2.5">
              <Package className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Product Value</span>
            </div>
            <span className="text-base font-bold text-foreground">{formatPrice(prizeValue)}</span>
          </div>
        )}

        <div className="flex items-center justify-between px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            <Target className="h-4 w-4 text-green-600 dark:text-green-400" />
            <span className="text-sm font-medium text-foreground">Your Winning Bid</span>
          </div>
          <span className="text-base font-bold text-green-600 dark:text-green-400">{formatPrice(bidAmount)}</span>
        </div>

        <div className="flex items-center justify-between px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            <CreditCard className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Entry Fee Paid</span>
          </div>
          <span className="text-sm font-semibold">{formatPrice(entryFee)}</span>
        </div>

        <div className="flex items-center justify-between px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Total Paid</span>
          </div>
          <span className="text-sm font-semibold">{formatPrice(totalPaid)}</span>
        </div>

        <div className="flex items-center justify-between px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Date Won</span>
          </div>
          <span className="text-sm font-medium">{formatDateTime(bid.placedAt)}</span>
        </div>

        <div className="flex items-center justify-between px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Payment</span>
          </div>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              bid.paymentStatus === "PAID"
                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                : bid.paymentStatus === "PENDING"
                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
            }`}
          >
            {bid.paymentStatus}
          </span>
        </div>

        {prizeValue !== null && bidAmount > 0 && (
          <div className="flex items-center justify-between px-5 py-3.5 bg-green-50/50 dark:bg-green-950/10">
            <div className="flex items-center gap-2.5">
              <Sparkles className="h-4 w-4 text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium text-green-700 dark:text-green-400">You Saved</span>
            </div>
            <span className="text-base font-bold text-green-600 dark:text-green-400">
              {formatPrice(prizeValue - totalPaid)}
            </span>
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <Link
        href={`/product/${bid.auctionId}`}
        className="flex items-center justify-center gap-2 px-5 py-3.5 bg-green-500 hover:bg-green-600 text-white font-medium text-sm transition-colors"
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
      href={`/product/${bid.auctionId}`}
      className={`group relative flex flex-col rounded-2xl border transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 overflow-hidden ${
        bid.isWinning && isActive
          ? "border-green-300 dark:border-green-700 bg-linear-to-br from-green-50 to-white dark:from-green-950/20 dark:to-gray-900"
          : "border-border bg-white dark:bg-gray-900 hover:border-primary/30"
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
          <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
        </div>

        {/* Title */}
        <h3 className="font-semibold leading-tight mb-2 text-base line-clamp-2 group-hover:text-primary transition-colors">
          {bid.auction.title}
        </h3>

        {/* Date */}
        <p className="text-xs text-muted-foreground mb-4">
          {formatDateTime(bid.placedAt)}
        </p>

        {/* Bid details */}
        <div className="grid gap-3 grid-cols-2">
          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Your Bid</p>
            <p className="font-bold text-primary text-lg">
              {formatPrice(bidAmount)}
            </p>
          </div>
          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Entry Fee</p>
            <p className="font-semibold text-lg">
              {formatPrice(entryFee)}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom action bar */}
      <div className="border-t border-border/50 px-4 py-3 bg-muted/30 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">View details</span>
        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
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
            <h1 className="text-2xl font-bold">My Bids</h1>
            <p className="text-muted-foreground mt-1">Track all your auction bids</p>
          </div>
        </div>

        <div className="rounded-2xl border border-destructive/50 bg-destructive/5 p-8 text-center">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-destructive" />
          <h2 className="text-lg font-semibold mb-2">Unable to load bids</h2>
          <p className="text-muted-foreground mb-4 max-w-md mx-auto">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
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
            <h1 className="text-2xl font-bold">My Bids</h1>
            <p className="text-muted-foreground mt-1">Track all your auction bids</p>
          </div>
        </div>

        <div className="rounded-2xl border bg-linear-to-br from-muted/30 to-muted/10 p-8 sm:p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
            <Gavel className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-xl font-semibold mb-2">No bids yet</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Start bidding on auctions to see your bid history here. Find amazing deals on unique products!
          </p>
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
          >
            Browse Auctions
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-280px)] min-h-[500px]">
      {/* Fixed Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold">My Bids</h1>
          <p className="text-muted-foreground mt-1">
            {stats.total} bid{stats.total !== 1 ? "s" : ""} across{" "}
            {new Set(bids.map((b) => b.auctionId)).size} auction
            {new Set(bids.map((b) => b.auctionId)).size !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/catalog"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium shadow-sm"
        >
          <Gavel className="h-4 w-4" />
          Place New Bid
        </Link>
      </div>

      {/* Scrollable Content */}
      <ScrollArea className="flex-1">
        <div className="space-y-6 pr-4">
          {/* Quick Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl bg-linear-to-br from-green-500 to-emerald-600 p-4 text-white">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="h-4 w-4 text-white/70" />
                <span className="text-xs text-white/70">Won</span>
              </div>
              <p className="text-3xl font-bold">{stats.wonAuctions.length}</p>
            </div>
            <div className="rounded-xl border border-border p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-blue-500" />
                <span className="text-xs text-muted-foreground">Active</span>
              </div>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.active}</p>
            </div>
            <div className="rounded-xl border border-border p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-primary" />
                <span className="text-xs text-muted-foreground">Leading</span>
              </div>
              <p className="text-3xl font-bold text-primary">{stats.leading}</p>
            </div>
            <div className="rounded-xl border border-border p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Spent</span>
              </div>
              <p className="text-2xl font-bold">{formatPrice(stats.totalSpent)}</p>
            </div>
          </div>

          {/* Won Auctions Section - KLM Inspired */}
          {stats.wonAuctions.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="h-5 w-5 text-green-600" />
                <h2 className="text-lg font-semibold">Won Auctions</h2>
                <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                  {stats.wonAuctions.length}
                </span>
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
                <Clock className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-semibold">Active Bids</h2>
                <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                  {stats.activeBids.length}
                </span>
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
                <Gavel className="h-5 w-5 text-muted-foreground" />
                <h2 className="text-lg font-semibold">Past Bids</h2>
                <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                  {stats.endedBids.filter((b) => !b.isWinning).length}
                </span>
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
      </ScrollArea>
    </div>
  );
}
