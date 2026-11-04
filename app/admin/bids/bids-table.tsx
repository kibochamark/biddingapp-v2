"use client";

import { useState } from "react";
import { Search, ExternalLink, Calendar, DollarSign, Package, User } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Mock data - replace with real data from server
const mockBids = [
  {
    id: "bid_1",
    auctionId: "auction_1",
    productId: "prod_1",
    productTitle: "iPhone 15 Pro Max",
    userId: "user_1",
    userName: "John Doe",
    userEmail: "john@example.com",
    bidAmount: 899,
    bidFee: 5,
    placedAt: new Date("2024-01-20T10:30:00"),
    status: "ACTIVE",
  },
  {
    id: "bid_2",
    auctionId: "auction_2",
    productId: "prod_2",
    productTitle: "MacBook Pro 16-inch",
    userId: "user_2",
    userName: "Jane Smith",
    userEmail: "jane@example.com",
    bidAmount: 2299,
    bidFee: 10,
    placedAt: new Date("2024-01-20T11:15:00"),
    status: "ACTIVE",
  },
  {
    id: "bid_3",
    auctionId: "auction_1",
    productId: "prod_1",
    productTitle: "iPhone 15 Pro Max",
    userId: "user_3",
    userName: "Bob Wilson",
    userEmail: "bob@example.com",
    bidAmount: 899,
    bidFee: 5,
    placedAt: new Date("2024-01-20T09:45:00"),
    status: "WON",
  },
];

function StatusBadge({ status }: { status: string }) {
  const variants = {
    ACTIVE: "default",
    WON: "success",
    CONFIRMED: "success",
    LOST: "default",
    PENDING: "default",
    FAILED: "sale",
    REFUNDED: "sale",
  } as const;

  return (
    <Badge variant={variants[status as keyof typeof variants] ?? "default"}>
      {status}
    </Badge>
  );
}

export default function BidsTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");

  const filteredBids = mockBids.filter((bid) => {
    const matchesSearch =
      bid.productTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bid.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bid.userEmail.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "ALL" || bid.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Calculate totals
  const totalBids = filteredBids.length;
  const totalRevenue = filteredBids.reduce((sum, bid) => sum + bid.bidFee, 0);

  return (
    <div className="space-y-4">
      {/* Filters and Summary */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-mute pointer-events-none" />
          <Input
            type="text"
            placeholder="Search by product, user, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-11"
          />
        </div>

        {/* Summary */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-mute">Total:</span>
            <span className="font-semibold text-ink">{totalBids} bids</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-mute">Revenue:</span>
            <span className="font-semibold text-primary">${totalRevenue}</span>
          </div>
        </div>
      </div>

      {/* Status Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <Button
          type="button"
          size="sm"
          variant={filterStatus === "ALL" ? "default" : "outline"}
          onClick={() => setFilterStatus("ALL")}
        >
          All
        </Button>
        <Button
          type="button"
          size="sm"
          variant={filterStatus === "ACTIVE" ? "default" : "outline"}
          onClick={() => setFilterStatus("ACTIVE")}
        >
          Active
        </Button>
        <Button
          type="button"
          size="sm"
          variant={filterStatus === "WON" ? "default" : "outline"}
          onClick={() => setFilterStatus("WON")}
        >
          Won
        </Button>
        <Button
          type="button"
          size="sm"
          variant={filterStatus === "LOST" ? "default" : "outline"}
          onClick={() => setFilterStatus("LOST")}
        >
          Lost
        </Button>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-soft-cloud">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-ink">
                  Product
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-ink">
                  User
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-ink">
                  Bid Amount
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-ink">
                  Fee
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-ink">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-ink">
                  Placed At
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-ink">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {filteredBids.map((bid) => (
                <tr key={bid.id} className="hover:bg-soft-cloud/60 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-mute shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-ink line-clamp-1">
                          {bid.productTitle}
                        </p>
                        <p className="text-xs text-mute">ID: {bid.productId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-mute shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-ink">{bid.userName}</p>
                        <p className="text-xs text-mute">{bid.userEmail}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4 text-mute" />
                      <span className="text-sm font-semibold text-ink">
                        {bid.bidAmount.toLocaleString()}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-primary">${bid.bidFee}</span>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={bid.status} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-mute">
                      <Calendar className="h-4 w-4" />
                      <div>
                        <p>{bid.placedAt.toLocaleDateString()}</p>
                        <p className="text-xs">{bid.placedAt.toLocaleTimeString()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button asChild size="sm" title="View auction detail, bidders, and controls">
                        <Link href={`/admin/bids/${bid.auctionId}`}>
                          View Auction
                        </Link>
                      </Button>
                      <Button asChild variant="ghost" size="icon-sm" title="Open public product page">
                        <Link href={`/product/${bid.productId}`} target="_blank">
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button asChild variant="ghost" size="icon-sm" title="View User">
                        <Link href={`/admin/accounts/${bid.userId}`}>
                          <User className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredBids.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-mute">No bids found</p>
          </div>
        )}
      </div>
    </div>
  );
}
