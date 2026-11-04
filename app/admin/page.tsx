import { Suspense } from "react";
import {
  Package,
  Users,
  Gavel,
  ShieldCheck,
  TrendingUp,
  Clock,
} from "lucide-react";
import { Loader } from "lucide-react";
import { getAllProducts } from "@/lib/api/products";
import { fetchAccounts } from "./actions/accounts";
import { fetchKYCStats } from "./actions/kyc";
import { formatRelativeTime } from "@/lib/format";

// Stats Card Component
function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
}: {
  title: string;
  value: string | number;
  icon: any;
  trend?: "up" | "down";
  trendValue?: string;
}) {
  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-soft-cloud rounded-lg">
          <Icon className="h-6 w-6 text-ink" />
        </div>
        {trend && (
          <div
            className={`flex items-center gap-1 text-sm font-medium ${
              trend === "up" ? "text-success" : "text-sale"
            }`}
          >
            {trend === "up" ? "↑" : "↓"} {trendValue}
          </div>
        )}
      </div>
      <h3 className="text-sm font-medium text-mute mb-1">{title}</h3>
      <p className="text-3xl font-semibold text-ink">{value}</p>
    </div>
  );
}

// Loading Component
function DashboardLoading() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-4">
        <Loader className="animate-spin text-primary w-12 h-12" />
        <p className="text-mute">Loading dashboard...</p>
      </div>
    </div>
  );
}

// Dashboard Stats Component — pulls real counts from the existing
// product/account/KYC admin APIs instead of hardcoded numbers.
async function DashboardStats() {
  const [products, accountsResult, kycResult] = await Promise.all([
    getAllProducts(),
    fetchAccounts(),
    fetchKYCStats(),
  ]);

  const totalProducts = products.length;
  const activeProducts = products.filter((p) => p.status === "ACTIVE").length;

  const allAuctions = products.flatMap((p) => p.auctions ?? []);
  const totalBids = allAuctions.reduce(
    (sum, a) => sum + (a.totalBidsCount ?? 0),
    0,
  );
  const activeAuctions = allAuctions.filter(
    (a) => a.status === "ACTIVE",
  ).length;

  // Both of these are permission-gated (manage:accounts / approve:kyc) — an
  // admin role without that grant gets { success: false }, so we degrade to
  // 0 rather than let a missing permission break the whole dashboard.
  const accountsData = accountsResult.success ? accountsResult.data : null;
  const totalUsers = Array.isArray(accountsData)
    ? accountsData.length
    : (accountsData?.total ?? accountsData?.accounts?.length ?? 0);

  const pendingKYC = kycResult.success ? (kycResult.data?.pending ?? 0) : 0;

  const stats = {
    totalProducts,
    activeProducts,
    totalUsers,
    pendingKYC,
    totalBids,
    activeAuctions,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <StatsCard
        title="Total Products"
        value={stats.totalProducts}
        icon={Package}
      />
      <StatsCard
        title="Active Products"
        value={stats.activeProducts}
        icon={TrendingUp}
      />
      <StatsCard
        title="Total Users"
        value={stats.totalUsers.toLocaleString()}
        icon={Users}
      />
      <StatsCard
        title="Total Bids"
        value={stats.totalBids.toLocaleString()}
        icon={Gavel}
      />
      <StatsCard
        title="Active Auctions"
        value={stats.activeAuctions}
        icon={Clock}
      />
      <StatsCard
        title="Pending KYC"
        value={stats.pendingKYC}
        icon={ShieldCheck}
      />
    </div>
  );
}

// Recent Activity Component — derived from real product creation dates
// (no unified activity-log endpoint exists yet, so this surfaces the
// genuinely real signal we have: newest listings).
async function RecentActivity() {
  const products = await getAllProducts();
  const recent = [...products]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5);

  return (
    <div className="glass-card p-6">
      <h2 className="text-xl font-semibold text-ink mb-6">Recent Activity</h2>
      <div className="space-y-4">
        {recent.length === 0 && (
          <p className="text-sm text-mute">No recent activity</p>
        )}
        {recent.map((product) => (
          <div
            key={product.id}
            className="flex items-start gap-3 pb-4 last:border-b-0 last:pb-0"
          >
            <div className="w-2 h-2 bg-stone rounded-full mt-2"></div>
            <div className="flex-1">
              <p className="text-sm text-ink">
                New product added: {product.title}
              </p>
              <p className="text-xs text-mute mt-1">
                {formatRelativeTime(product.createdAt)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function page() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-ink mb-2">Dashboard</h1>
        <p className="text-mute">
          Welcome to the admin portal. Here's an overview of your platform.
        </p>
      </div>

      {/* Stats */}
      <Suspense fallback={<DashboardLoading />}>
        <DashboardStats />
      </Suspense>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Suspense fallback={<DashboardLoading />}>
          <RecentActivity />
        </Suspense>
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold text-ink mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <a
              href="/admin/products/new"
              className="flex flex-col items-center justify-center gap-2 p-4 bg-soft-cloud hover:bg-hairline-soft rounded-lg transition-colors"
            >
              <Package className="h-8 w-8 text-ink" />
              <span className="text-sm font-medium text-ink">Add Product</span>
            </a>
            <a
              href="/admin/kyc"
              className="flex flex-col items-center justify-center gap-2 p-4 bg-soft-cloud hover:bg-hairline-soft rounded-lg transition-colors"
            >
              <ShieldCheck className="h-8 w-8 text-ink" />
              <span className="text-sm font-medium text-ink">Review KYC</span>
            </a>
            <a
              href="/admin/accounts"
              className="flex flex-col items-center justify-center gap-2 p-4 bg-soft-cloud hover:bg-hairline-soft rounded-lg transition-colors"
            >
              <Users className="h-8 w-8 text-ink" />
              <span className="text-sm font-medium text-ink">Manage Users</span>
            </a>
            <a
              href="/admin/bids"
              className="flex flex-col items-center justify-center gap-2 p-4 bg-soft-cloud hover:bg-hairline-soft rounded-lg transition-colors"
            >
              <Gavel className="h-8 w-8 text-ink" />
              <span className="text-sm font-medium text-ink">View Bids</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export const metadata = {
  title: "Admin Dashboard - BidMarket",
  description: "Admin portal dashboard for managing the platform",
};
