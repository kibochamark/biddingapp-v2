"use client";

import { useState } from "react";
import { Search, Eye, Calendar, DollarSign, Package, User } from "lucide-react";
import Link from "next/link";

// Mock data - replace with real data from server
const mockBids = [
  {
    id: "bid_1",
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
  const styles = {
    ACTIVE: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    WON: "bg-green-500/10 text-green-600 border-green-500/20",
    LOST: "bg-gray-500/10 text-gray-600 border-gray-500/20",
    REFUNDED: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  };

  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-full border ${
        styles[status as keyof typeof styles]
      }`}
    >
      {status}
    </span>
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
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by product, user, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring text-sm"
          />
        </div>

        {/* Summary */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Total:</span>
            <span className="font-semibold text-foreground">{totalBids} bids</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Revenue:</span>
            <span className="font-semibold text-primary">${totalRevenue}</span>
          </div>
        </div>
      </div>

      {/* Status Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => setFilterStatus("ALL")}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
            filterStatus === "ALL"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-foreground hover:bg-accent"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilterStatus("ACTIVE")}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
            filterStatus === "ACTIVE"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-foreground hover:bg-accent"
          }`}
        >
          Active
        </button>
        <button
          onClick={() => setFilterStatus("WON")}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
            filterStatus === "WON"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-foreground hover:bg-accent"
          }`}
        >
          Won
        </button>
        <button
          onClick={() => setFilterStatus("LOST")}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
            filterStatus === "LOST"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-foreground hover:bg-accent"
          }`}
        >
          Lost
        </button>
      </div>

      {/* Table */}
      <div className="glass-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Product
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  User
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Bid Amount
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Fee
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Placed At
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredBids.map((bid) => (
                <tr key={bid.id} className="hover:bg-accent/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-muted-foreground shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-foreground line-clamp-1">
                          {bid.productTitle}
                        </p>
                        <p className="text-xs text-muted-foreground">ID: {bid.productId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-foreground">{bid.userName}</p>
                        <p className="text-xs text-muted-foreground">{bid.userEmail}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-semibold text-foreground">
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
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <div>
                        <p>{bid.placedAt.toLocaleDateString()}</p>
                        <p className="text-xs">{bid.placedAt.toLocaleTimeString()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/product/${bid.productId}`}
                        target="_blank"
                        className="p-2 hover:bg-accent rounded-lg transition-colors"
                        title="View Product"
                      >
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      </Link>
                      <Link
                        href={`/admin/accounts/${bid.userId}`}
                        className="p-2 hover:bg-accent rounded-lg transition-colors"
                        title="View User"
                      >
                        <User className="h-4 w-4 text-muted-foreground" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredBids.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-muted-foreground">No bids found</p>
          </div>
        )}
      </div>
    </div>
  );
}
