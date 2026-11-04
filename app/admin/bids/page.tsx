import { Suspense } from "react";
import { Loader, Gavel, TrendingUp, DollarSign } from "lucide-react";
import BidsTable, { type AdminBidRow } from "./bids-table";
import { getAllProducts } from "@/lib/api/products";
import { fetchAuctionDetail } from "../actions/auctions";

function BidsLoading() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-4">
        <Loader className="animate-spin text-primary w-12 h-12" />
        <p className="text-mute">Loading bids...</p>
      </div>
    </div>
  );
}

// Stats for bids overview
function BidsStats({ stats }: { stats: any }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="glass-card p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-soft-cloud rounded-lg">
            <Gavel className="h-5 w-5 text-ink" />
          </div>
          <div>
            <p className="text-sm text-mute">Total Bids</p>
            <p className="text-2xl font-semibold text-ink">{stats.totalBids.toLocaleString()}</p>
          </div>
        </div>
      </div>
      <div className="glass-card p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-soft-cloud rounded-lg">
            <TrendingUp className="h-5 w-5 text-success" />
          </div>
          <div>
            <p className="text-sm text-mute">Today</p>
            <p className="text-2xl font-semibold text-ink">{stats.todayBids}</p>
          </div>
        </div>
      </div>
      <div className="glass-card p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-soft-cloud rounded-lg">
            <DollarSign className="h-5 w-5 text-ink" />
          </div>
          <div>
            <p className="text-sm text-mute">Total Revenue</p>
            <p className="text-2xl font-semibold text-ink">
              ${stats.totalRevenue.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
      <div className="glass-card p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-soft-cloud rounded-lg">
            <Gavel className="h-5 w-5 text-ink" />
          </div>
          <div>
            <p className="text-sm text-mute">Avg. Bid Fee</p>
            <p className="text-2xl font-semibold text-ink">${stats.avgBidFee.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Flattens every auction's admin detail (product inline, bidder list) into
// one row per bid. There's no bulk "all bids" admin endpoint — this composes
// it from the real product list (auction ids) + fetchAuctionDetail per
// auction, the same two admin APIs the auction-detail page already uses.
async function fetchAllBidRows(): Promise<AdminBidRow[]> {
  const products = await getAllProducts();
  const auctionRefs = products.flatMap((p) =>
    (p.auctions ?? []).map((a) => ({
      auctionId: a.id,
      productId: p.id,
      productTitle: p.title,
    }))
  );

  const details = await Promise.all(
    auctionRefs.map((ref) => fetchAuctionDetail(ref.auctionId))
  );

  const rows: AdminBidRow[] = [];
  details.forEach((result, index) => {
    if (!result.success || !result.data) return;
    const auction = result.data;
    const ref = auctionRefs[index];
    for (const bidder of auction.bidders) {
      rows.push({
        id: bidder.id,
        auctionId: auction.id,
        productId: ref.productId,
        productTitle: ref.productTitle,
        userId: bidder.bidderId,
        userName: bidder.bidderName,
        userEmail: bidder.bidderEmail,
        bidAmount: bidder.bidAmount,
        bidFee: auction.entryFee,
        placedAt: new Date(bidder.placedAt),
        status: bidder.paymentStatus,
        isWinner: auction.winnerId === bidder.bidderId,
      });
    }
  });

  return rows;
}

async function BidsPageData() {
  const bids = await fetchAllBidRows();

  const totalBids = bids.length;
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayBids = bids.filter((b) => b.placedAt >= todayStart).length;
  const totalRevenue = bids.reduce((sum, b) => sum + b.bidFee, 0);
  const avgBidFee = totalBids > 0 ? totalRevenue / totalBids : 0;

  const stats = { totalBids, todayBids, totalRevenue, avgBidFee };

  return (
    <>
      <BidsStats stats={stats} />
      <BidsTable bids={bids} />
    </>
  );
}

export default async function BidsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-ink mb-2">Bids Management</h1>
        <p className="text-mute">
          View and monitor all bidding activity across the platform
        </p>
      </div>

      <Suspense fallback={<BidsLoading />}>
        <BidsPageData />
      </Suspense>
    </div>
  );
}

export const metadata = {
  title: "Bids - Admin Portal",
  description: "Manage and monitor bids",
};
