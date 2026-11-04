"use client";

import { useEffect, useMemo, useState } from "react";
import { UserBid, UserBidAuction } from "@/lib/types";
import {
  Gavel,
  Trophy,
  Clock,
  Sparkles,
  ChevronRight,
  ChevronDown,
  AlertCircle,
  DollarSign,
  Target,
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

// One auction, with every entry (bid amount) the user placed on it. Multiple
// entries on the same auction are "the same product" for display purposes —
// they get one parent row, with each entry as an expandable child, instead of
// N near-identical cards cluttering the grid.
interface BidGroup {
  auctionId: string;
  auction: UserBidAuction;
  bids: UserBid[]; // sorted lowest bid amount first
  totalEntryFees: number;
  totalPaid: number; // sum of every entry's totalPaid (entry fees + the winning amount, if any)
  lowestBid: number;
  highestBid: number;
  isWinning: boolean;
  winningBid?: UserBid;
}

// Helper to parse currency string to number
function parseAmount(amount: string): number {
  return parseFloat(amount) || 0;
}

// Helper to check if an auction has concluded (ended or winner determined)
function isAuctionEnded(status: string): boolean {
  return status === "ENDED" || status === "WINNER_DETERMINED";
}

function groupBidsByAuction(bids: UserBid[]): BidGroup[] {
  const groups = new Map<string, UserBid[]>();
  for (const bid of bids) {
    const existing = groups.get(bid.auctionId);
    if (existing) {
      existing.push(bid);
    } else {
      groups.set(bid.auctionId, [bid]);
    }
  }

  return Array.from(groups.values()).map((groupBids) => {
    const sorted = [...groupBids].sort(
      (a, b) => parseAmount(a.bidAmount) - parseAmount(b.bidAmount),
    );
    const amounts = sorted.map((b) => parseAmount(b.bidAmount));
    const winningBid = sorted.find((b) => b.isWinning);

    return {
      auctionId: sorted[0].auctionId,
      auction: sorted[0].auction,
      bids: sorted,
      totalEntryFees: sorted.reduce(
        (sum, b) => sum + parseAmount(b.entryFeePaid),
        0,
      ),
      totalPaid: sorted.reduce((sum, b) => sum + parseAmount(b.totalPaid), 0),
      lowestBid: Math.min(...amounts),
      highestBid: Math.max(...amounts),
      isWinning: !!winningBid,
      winningBid,
    };
  });
}

// Status badge for a single entry (child row)
function EntryStatusBadge({
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
        Winning Entry
      </Badge>
    ) : (
      <Badge variant="default">Not Unique</Badge>
    );
  }

  if (isWinning) {
    return (
      <Badge variant="success">
        <Trophy className="h-3 w-3" />
        Leading
      </Badge>
    );
  }

  return isUnique ? (
    <Badge variant="default">
      <Sparkles className="h-3 w-3" />
      Unique
    </Badge>
  ) : (
    <Badge variant="default">Not Unique</Badge>
  );
}

// Status badge for a whole group (parent row) — summarizes across every entry
function GroupStatusBadge({ group }: { group: BidGroup }) {
  const ended = isAuctionEnded(group.auction.status);

  if (ended) {
    return group.isWinning ? (
      <Badge variant="success">
        <Trophy className="h-3 w-3" />
        Won
      </Badge>
    ) : (
      <Badge variant="default">Ended</Badge>
    );
  }

  return group.isWinning ? (
    <Badge variant="success">
      <Trophy className="h-3 w-3" />
      Leading
    </Badge>
  ) : (
    <Badge variant="default">
      <Clock className="h-3 w-3" />
      Active
    </Badge>
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

// A single entry row, used as a child under its auction's parent row.
function EntryRow({
  bid,
  auctionStatus,
}: {
  bid: UserBid;
  auctionStatus: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-3">
      <div className="flex items-center gap-3 min-w-0">
        <EntryStatusBadge
          isWinning={bid.isWinning}
          isUnique={bid.isUnique}
          auctionStatus={auctionStatus}
        />
        <span className="text-xs text-mute truncate">
          {formatDateTime(bid.placedAt)}
        </span>
      </div>
      <div className="flex items-center gap-6 shrink-0">
        <span className="text-xs text-mute hidden sm:inline">
          Fee {formatPrice(parseAmount(bid.entryFeePaid))}
        </span>
        <span
          className={`text-base font-semibold ${bid.isWinning ? "text-success" : "text-ink"}`}
        >
          {formatPrice(parseAmount(bid.bidAmount))}
        </span>
      </div>
    </div>
  );
}

// KLM-inspired Won Auction Card — one per auction, every entry listed so the
// user can see which specific bid of theirs won (and what their other entries were).
function WonAuctionCard({ group }: { group: BidGroup }) {
  const winningAmount = group.winningBid
    ? parseAmount(group.winningBid.bidAmount)
    : group.lowestBid;
  const prizeValue = group.auction.prizeValue
    ? parseAmount(group.auction.prizeValue)
    : null;
  const wonAt = group.winningBid?.placedAt ?? group.bids[0].placedAt;

  return (
    <div className="shadow-surface overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 px-5 py-4 ">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <Trophy className="h-4 w-4 shrink-0 text-success" />
            <span className="text-xs font-medium text-mute uppercase tracking-wider">
              Auction Won
            </span>
          </div>
          <h3 className="font-medium text-lg leading-tight truncate text-ink">
            {group.auction.title}
          </h3>
        </div>
        <Badge variant="success" className="shrink-0">
          Won
        </Badge>
      </div>

      {/* Pricing rows */}
      <div className=" ">
        {prizeValue !== null && (
          <div className="flex items-center justify-between px-5 py-3.5">
            <div className="flex items-center gap-2.5">
              <Package className="h-4 w-4 text-mute" />
              <span className="text-sm text-mute">Product Value</span>
            </div>
            <span className="text-base font-medium text-ink">
              {formatPrice(prizeValue)}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            <Target className="h-4 w-4 text-success" />
            <span className="text-sm font-medium text-ink">
              Your Winning Bid
            </span>
          </div>
          <span className="text-base font-medium text-success">
            {formatPrice(winningAmount)}
          </span>
        </div>

        <div className="flex items-center justify-between px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            <CreditCard className="h-4 w-4 text-mute" />
            <span className="text-sm text-mute">
              Entry Fees Paid ({group.bids.length}x)
            </span>
          </div>
          <span className="text-sm font-medium text-ink">
            {formatPrice(group.totalEntryFees)}
          </span>
        </div>

        <div className="flex items-center justify-between px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            <Calendar className="h-4 w-4 text-mute" />
            <span className="text-sm text-mute">Date Won</span>
          </div>
          <span className="text-sm font-medium text-ink">
            {formatDateTime(wonAt)}
          </span>
        </div>

        {prizeValue !== null && (
          <div className="flex items-center justify-between px-5 py-3.5">
            <div className="flex items-center gap-2.5">
              <Sparkles className="h-4 w-4 text-success" />
              <span className="text-sm font-medium text-success">
                You Saved
              </span>
            </div>
            <span className="text-base font-medium text-success">
              {formatPrice(prizeValue - group.totalPaid)}
            </span>
          </div>
        )}
      </div>

      {/* Every entry placed on this auction, winning one included */}
      {group.bids.length > 1 && (
        <div className="bg-soft-cloud">
          <div className="px-5 pt-3 pb-1">
            <span className="text-xs font-medium text-mute uppercase tracking-wider">
              All {group.bids.length} Entries
            </span>
          </div>
          <div className=" ">
            {group.bids.map((bid) => (
              <EntryRow
                key={bid.id}
                bid={bid}
                auctionStatus={group.auction.status}
              />
            ))}
          </div>
        </div>
      )}

      {/* Footer CTA */}
      <Link
        href={`/product/${group.auction.productId}`}
        className="flex items-center justify-center gap-2 px-5 py-3.5 bg-success text-white hover:bg-success/90 font-medium text-sm transition-colors"
      >
        Claim Your Prize
        <ChevronRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

// One auction's bids as a disclosure row — a single entry renders as a plain
// linked row; more than one renders a parent summary that expands to list
// every entry, instead of repeating near-identical cards per bid.
function BidGroupRow({ group }: { group: BidGroup }) {
  const [expanded, setExpanded] = useState(false);
  const isActive = group.auction.status === "ACTIVE";
  const hasMultipleEntries = group.bids.length > 1;

  const parentContent = (
    <>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1.5">
          <GroupStatusBadge group={group} />
          {isActive && <CountdownBadge endDate={group.auction.endDate} />}
          {hasMultipleEntries && (
            <span className="text-xs text-mute">
              {group.bids.length} entries
            </span>
          )}
        </div>
        <h3 className="font-medium leading-tight text-base truncate text-ink">
          {group.auction.title}
        </h3>
        <p className="text-xs text-mute mt-1">
          {formatDateTime(group.bids[group.bids.length - 1].placedAt)}
        </p>
      </div>

      <div className="flex items-center gap-6 shrink-0">
        <div className="text-right hidden sm:block">
          <p className="text-[10px] uppercase tracking-wider text-mute mb-0.5">
            {hasMultipleEntries ? "Bid Range" : "Your Bid"}
          </p>
          <p className="font-medium text-ink">
            {hasMultipleEntries
              ? `${formatPrice(group.lowestBid)} – ${formatPrice(group.highestBid)}`
              : formatPrice(group.lowestBid)}
          </p>
        </div>
        {hasMultipleEntries ? (
          <ChevronDown
            className={`h-4 w-4 text-mute shrink-0 transition-transform ${expanded ? "rotate-180" : ""}`}
          />
        ) : (
          <ChevronRight className="h-4 w-4 text-mute shrink-0" />
        )}
      </div>
    </>
  );

  return (
    <div className="shadow-surface overflow-hidden">
      {hasMultipleEntries ? (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className="w-full flex items-center justify-between gap-4 p-4 text-left hover:bg-soft-cloud transition-colors"
        >
          {parentContent}
        </button>
      ) : (
        <Link
          href={`/product/${group.auction.productId}`}
          className="flex items-center justify-between gap-4 p-4 hover:bg-soft-cloud transition-colors"
        >
          {parentContent}
        </Link>
      )}

      {hasMultipleEntries && expanded && (
        <div className=" bg-soft-cloud">
          <div className=" ">
            {group.bids.map((bid) => (
              <EntryRow
                key={bid.id}
                bid={bid}
                auctionStatus={group.auction.status}
              />
            ))}
          </div>
          <Link
            href={`/product/${group.auction.productId}`}
            className="flex items-center justify-center gap-2 px-4 py-3 text-sm text-ink hover:text-primary transition-colors"
          >
            View product
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </div>
  );
}

export default function MyBidsSection({ bids, error }: MyBidsSectionProps) {
  // Show error toast on mount if there's an error
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Group every bid by auction first — "bids of the same product" collapse
  // into one parent with their individual entries as children — then compute
  // stats and bucket at the group level, not the individual-entry level.
  const stats = useMemo(() => {
    const groups = groupBidsByAuction(bids);
    const activeGroups = groups.filter((g) => g.auction.status === "ACTIVE");
    const endedGroups = groups.filter((g) => isAuctionEnded(g.auction.status));
    const wonGroups = endedGroups.filter((g) => g.isWinning);
    const leadingGroups = activeGroups.filter((g) => g.isWinning);

    const totalSpent = bids.reduce(
      (sum, b) => sum + parseAmount(b.entryFeePaid),
      0,
    );

    return {
      totalBids: bids.length,
      totalAuctions: groups.length,
      activeGroups,
      endedGroups,
      wonGroups,
      leading: leadingGroups.length,
      totalSpent,
    };
  }, [bids]);

  // Error state
  if (error && bids.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-medium text-ink uppercase">
              My Bids
            </h1>
            <p className="text-mute mt-1">Track all your auction bids</p>
          </div>
        </div>

        <div className="bg-soft-cloud p-8 text-center">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-sale" />
          <h2 className="text-lg font-medium mb-2 text-ink">
            Unable to load bids
          </h2>
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
            <h1 className="text-2xl sm:text-3xl font-medium text-ink uppercase">
              My Bids
            </h1>
            <p className="text-mute mt-1">Track all your auction bids</p>
          </div>
        </div>

        <div className="bg-soft-cloud p-8 sm:p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-background mb-6">
            <Gavel className="h-8 w-8 text-ink" />
          </div>
          <h2 className="text-xl font-medium mb-2 text-ink">No bids yet</h2>
          <p className="text-mute mb-6 max-w-md mx-auto">
            Start bidding on auctions to see your bid history here. Find amazing
            deals on unique products!
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

  const pastGroups = stats.endedGroups.filter((g) => !g.isWinning);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-medium text-ink uppercase">
            My Bids
          </h1>
          <p className="text-mute mt-1">
            {stats.totalBids} bid{stats.totalBids !== 1 ? "s" : ""} across{" "}
            {stats.totalAuctions} auction
            {stats.totalAuctions !== 1 ? "s" : ""}
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
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3 py-4 ">
            <div>
              <p className="text-xs text-mute mb-0.5">Won</p>
              <p className="text-xl font-medium text-ink">
                {stats.wonGroups.length}
              </p>
            </div>
            <div>
              <p className="text-xs text-mute mb-0.5">Active</p>
              <p className="text-xl font-medium text-ink">
                {stats.activeGroups.length}
              </p>
            </div>
            <div>
              <p className="text-xs text-mute mb-0.5">Leading</p>
              <p className="text-xl font-medium text-ink">{stats.leading}</p>
            </div>
            <div>
              <p className="text-xs text-mute mb-0.5">Spent</p>
              <p className="text-xl font-medium text-ink">
                {formatPrice(stats.totalSpent)}
              </p>
            </div>
          </div>

          {/* Won Auctions Section */}
          {stats.wonGroups.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="h-5 w-5 text-success" />
                <h2 className="text-lg font-medium text-ink">Won Auctions</h2>
                <Badge variant="success">{stats.wonGroups.length}</Badge>
              </div>
              <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
                {stats.wonGroups.map((group) => (
                  <WonAuctionCard key={group.auctionId} group={group} />
                ))}
              </div>
            </section>
          )}

          {/* Active Bids Section */}
          {stats.activeGroups.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Clock className="h-5 w-5 text-ink" />
                <h2 className="text-lg font-medium text-ink">Active Bids</h2>
                <Badge variant="default">{stats.activeGroups.length}</Badge>
              </div>
              <div className="space-y-3">
                {stats.activeGroups.map((group) => (
                  <BidGroupRow key={group.auctionId} group={group} />
                ))}
              </div>
            </section>
          )}

          {/* Past Bids Section */}
          {pastGroups.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Gavel className="h-5 w-5 text-mute" />
                <h2 className="text-lg font-medium text-ink">Past Bids</h2>
                <Badge variant="default">{pastGroups.length}</Badge>
              </div>
              <div className="space-y-3">
                {pastGroups.map((group) => (
                  <BidGroupRow key={group.auctionId} group={group} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
