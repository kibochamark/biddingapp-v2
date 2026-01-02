"use client";

import { Bid } from "@/lib/types";
import { Gavel, Trophy, XCircle, Clock } from "lucide-react";
import { formatPrice, formatDateTime } from "@/lib/format";
import Link from "next/link";

interface MyBidsSectionProps {
  bids: Bid[];
}

export default function MyBidsSection({ bids }: MyBidsSectionProps) {
  if (bids.length === 0) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-bold">My Bids</h2>
        <div className="glass-card rounded-lg p-8 text-center">
          <Gavel className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground mb-4">
            You haven't placed any bids yet
          </p>
          <Link
            href="/catalog"
            className="inline-block px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            Browse Auctions
          </Link>
        </div>
      </div>
    );
  }

  // Group bids by status
  const activeBids = bids.filter(b => b.status === "CONFIRMED" && !b.isWinner);
  const wonBids = bids.filter(b => b.isWinner);
  const lostBids = bids.filter(b => b.status === "LOST");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">My Bids</h2>
        <div className="text-sm text-muted-foreground">
          Total Bids: {bids.length}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold">Active</h3>
          </div>
          <p className="text-2xl font-bold">{activeBids.length}</p>
          <p className="text-xs text-muted-foreground">Pending results</p>
        </div>

        <div className="glass-card rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="h-5 w-5 text-green-600" />
            <h3 className="font-semibold">Won</h3>
          </div>
          <p className="text-2xl font-bold">{wonBids.length}</p>
          <p className="text-xs text-muted-foreground">Winning bids</p>
        </div>

        <div className="glass-card rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <XCircle className="h-5 w-5 text-gray-600" />
            <h3 className="font-semibold">Ended</h3>
          </div>
          <p className="text-2xl font-bold">{lostBids.length}</p>
          <p className="text-xs text-muted-foreground">Not won</p>
        </div>
      </div>

      {/* Won Bids */}
      {wonBids.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Trophy className="h-5 w-5 text-green-600" />
            Winning Bids
          </h3>
          <div className="space-y-3">
            {wonBids.map((bid) => (
              <div
                key={bid.id}
                className="glass-card rounded-lg p-4 border-2 border-green-500/50"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl">🏆</span>
                      <h4 className="font-semibold">Product #{bid.productId}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Bid placed: {formatDateTime(bid.createdAt)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Entry fee: {formatPrice(bid.amount)}
                    </p>
                  </div>
                  <Link
                    href={`/product/${bid.productId}`}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-semibold"
                  >
                    Claim Prize
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Bids */}
      {activeBids.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-600" />
            Active Bids
          </h3>
          <div className="space-y-3">
            {activeBids.map((bid) => (
              <div key={bid.id} className="glass-card rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">Product #{bid.productId}</h4>
                    <p className="text-sm text-muted-foreground">
                      Bid placed: {formatDateTime(bid.createdAt)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Entry fee: {formatPrice(bid.amount)}
                    </p>
                    <span className="inline-block mt-2 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded">
                      Waiting for winner selection
                    </span>
                  </div>
                  <Link
                    href={`/product/${bid.productId}`}
                    className="px-4 py-2 border border-border rounded-lg hover:bg-accent text-sm font-semibold"
                  >
                    View Product
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lost Bids */}
      {lostBids.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <XCircle className="h-5 w-5 text-gray-600" />
            Ended Bids
          </h3>
          <div className="space-y-3">
            {lostBids.slice(0, 5).map((bid) => (
              <div
                key={bid.id}
                className="glass-card rounded-lg p-4 opacity-70"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">Product #{bid.productId}</h4>
                    <p className="text-sm text-muted-foreground">
                      Bid placed: {formatDateTime(bid.createdAt)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Entry fee: {formatPrice(bid.amount)}
                    </p>
                  </div>
                  <span className="text-sm text-gray-600">
                    Not selected
                  </span>
                </div>
              </div>
            ))}
            {lostBids.length > 5 && (
              <p className="text-sm text-muted-foreground text-center">
                +{lostBids.length - 5} more ended bids
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
