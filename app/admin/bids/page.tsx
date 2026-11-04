import { Suspense } from "react";
import { Loader, Gavel, TrendingUp, DollarSign } from "lucide-react";
import BidsTable from "./bids-table";

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
            <p className="text-2xl font-semibold text-ink">${stats.avgBidFee}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function BidsPage() {
  // TODO: Fetch real stats from API
  const stats = {
    totalBids: 5678,
    todayBids: 234,
    totalRevenue: 28390,
    avgBidFee: 5,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-ink mb-2">Bids Management</h1>
        <p className="text-mute">
          View and monitor all bidding activity across the platform
        </p>
      </div>

      {/* Stats */}
      <BidsStats stats={stats} />

      {/* Bids Table */}
      <Suspense fallback={<BidsLoading />}>
        <BidsTable />
      </Suspense>
    </div>
  );
}

export const metadata = {
  title: "Bids - Admin Portal",
  description: "Manage and monitor bids",
};
