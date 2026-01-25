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
  Zap,
} from "lucide-react";
import { formatPrice, formatDateTime, formatTimeRemaining } from "@/lib/format";
import { toast } from "@/lib/toast";
import Link from "next/link";

interface MyBidsSectionProps {
  bids: UserBid[];
  error?: string;
}

// Helper to parse currency string to number
function parseAmount(amount: string): number {
  return parseFloat(amount) || 0;
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
  if (auctionStatus === "ENDED") {
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

// Compact bid card for bento grid
function BidCard({ bid, size = "default" }: { bid: UserBid; size?: "default" | "featured" }) {
  const bidAmount = parseAmount(bid.bidAmount);
  const entryFee = parseAmount(bid.entryFeePaid);
  const isActive = bid.auction.status === "ACTIVE";
  const isFeatured = size === "featured";

  return (
    <Link
      href={`/product/${bid.auctionId}`}
      className={`group relative flex flex-col rounded-2xl border transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 overflow-hidden ${
        bid.isWinning && isActive
          ? "border-green-300 dark:border-green-700 bg-linear-to-br from-green-50 to-white dark:from-green-950/20 dark:to-gray-900"
          : bid.isWinning && !isActive
          ? "border-green-400 dark:border-green-600 bg-linear-to-br from-green-50 to-emerald-50/50 dark:from-green-950/30 dark:to-emerald-950/20"
          : "border-border bg-white dark:bg-gray-900 hover:border-primary/30"
      } ${isFeatured ? "h-full" : ""}`}
    >
      {/* Winner ribbon */}
      {bid.isWinning && !isActive && (
        <div className="absolute top-0 right-0 z-10">
          <div className="bg-green-500 text-white text-[10px] font-bold px-6 py-1 transform rotate-45 translate-x-6 translate-y-2">
            WON
          </div>
        </div>
      )}

      <div className={`flex flex-col flex-1 ${isFeatured ? "p-5 sm:p-6" : "p-4"}`}>
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
        <h3 className={`font-semibold leading-tight mb-2 group-hover:text-primary transition-colors ${isFeatured ? "text-lg" : "text-base line-clamp-2"}`}>
          {bid.auction.title}
        </h3>

        {/* Date */}
        <p className="text-xs text-muted-foreground mb-4">
          {formatDateTime(bid.placedAt)}
        </p>

        {/* Spacer for featured cards */}
        {isFeatured && <div className="flex-1" />}

        {/* Bid details */}
        <div className={`grid gap-3 ${isFeatured ? "grid-cols-2" : "grid-cols-2"}`}>
          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Your Bid</p>
            <p className={`font-bold text-primary ${isFeatured ? "text-xl" : "text-lg"}`}>
              {formatPrice(bidAmount)}
            </p>
          </div>
          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Entry Fee</p>
            <p className={`font-semibold ${isFeatured ? "text-xl" : "text-lg"}`}>
              {formatPrice(entryFee)}
            </p>
          </div>
        </div>

        {/* Payment status for featured */}
        {isFeatured && (
          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Payment</span>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
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
        )}
      </div>

      {/* Bottom action bar */}
      <div className={`border-t border-border/50 px-4 py-3 bg-muted/30 flex items-center justify-between ${isFeatured ? "px-5 sm:px-6" : ""}`}>
        <span className="text-xs text-muted-foreground">
          {bid.isWinning && !isActive ? "Claim your prize" : "View details"}
        </span>
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
    const endedBids = bids.filter((b) => b.auction.status === "ENDED");
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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

      {/* Bento Grid Stats + Featured */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Winning stat - large card */}
        <div className="col-span-2 row-span-2 rounded-2xl bg-linear-to-br from-green-500 to-emerald-600 p-5 sm:p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Trophy className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium text-white/80">Winning Bids</span>
            </div>
            <p className="text-5xl sm:text-6xl font-bold mb-2">{stats.winning}</p>
            <p className="text-sm text-white/70">
              {stats.wonAuctions.length} auction{stats.wonAuctions.length !== 1 ? "s" : ""} won
            </p>
          </div>
        </div>

        {/* Leading bids */}
        <div className="col-span-1 rounded-2xl bg-linear-to-br from-primary/10 to-orange-100 dark:from-primary/20 dark:to-orange-950/30 border border-primary/20 p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 bg-primary/20 rounded-lg">
              <Target className="h-4 w-4 text-primary" />
            </div>
          </div>
          <p className="text-3xl font-bold text-primary mb-1">{stats.leading}</p>
          <p className="text-xs text-muted-foreground">Leading</p>
        </div>

        {/* Active bids */}
        <div className="col-span-1 rounded-2xl bg-linear-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-800 p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
              <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">{stats.active}</p>
          <p className="text-xs text-muted-foreground">Active</p>
        </div>

        {/* Total spent - wide card */}
        <div className="col-span-2 rounded-2xl bg-white dark:bg-gray-900 border border-border p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-muted rounded-lg">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </div>
                <span className="text-xs text-muted-foreground">Total Spent</span>
              </div>
              <p className="text-2xl sm:text-3xl font-bold">{formatPrice(stats.totalSpent)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Unique Bids</p>
              <p className="text-lg font-semibold flex items-center gap-1 justify-end">
                <Sparkles className="h-4 w-4 text-purple-500" />
                {stats.unique}
              </p>
            </div>
          </div>
        </div>

        {/* Quick action card */}
        <div className="col-span-2 lg:col-span-2 rounded-2xl bg-linear-to-br from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 p-4 sm:p-5 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent)]" />
          <div className="relative flex items-center justify-between h-full">
            <div>
              <p className="text-sm text-white/70 mb-1">Ready to win?</p>
              <p className="font-semibold">Find your next auction</p>
            </div>
            <Link
              href="/catalog"
              className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
            >
              <Zap className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Won Auctions Section */}
      {stats.wonAuctions.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="h-5 w-5 text-green-600" />
            <h2 className="text-lg font-semibold">Won Auctions</h2>
            <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
              {stats.wonAuctions.length}
            </span>
          </div>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {stats.wonAuctions.map((bid, idx) => (
              <BidCard key={bid.id} bid={bid} size={idx === 0 ? "featured" : "default"} />
            ))}
          </div>
        </section>
      )}

      {/* Active Bids Section - Bento Layout */}
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
            {stats.activeBids.map((bid, idx) => (
              <div
                key={bid.id}
                className={
                  idx === 0 && stats.activeBids.length > 2
                    ? "sm:col-span-2 lg:col-span-1 lg:row-span-2"
                    : ""
                }
              >
                <BidCard
                  bid={bid}
                  size={idx === 0 && stats.activeBids.length > 2 ? "featured" : "default"}
                />
              </div>
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
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {stats.endedBids
              .filter((b) => !b.isWinning)
              .slice(0, 8)
              .map((bid) => (
                <BidCard key={bid.id} bid={bid} />
              ))}
          </div>
          {stats.endedBids.filter((b) => !b.isWinning).length > 8 && (
            <p className="text-center text-sm text-muted-foreground mt-4">
              +{stats.endedBids.filter((b) => !b.isWinning).length - 8} more past bids
            </p>
          )}
        </section>
      )}
    </div>
  );
}
