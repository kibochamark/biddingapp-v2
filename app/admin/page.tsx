import { Suspense } from "react";
import { Package, Users, Gavel, ShieldCheck, TrendingUp, Clock } from "lucide-react";
import { Loader } from "lucide-react";

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
    <div className="glass-card p-6 rounded-xl border border-border">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-primary/10 rounded-lg">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        {trend && (
          <div
            className={`flex items-center gap-1 text-sm font-medium ${
              trend === "up" ? "text-green-600" : "text-red-600"
            }`}
          >
            {trend === "up" ? "↑" : "↓"} {trendValue}
          </div>
        )}
      </div>
      <h3 className="text-sm font-medium text-muted-foreground mb-1">{title}</h3>
      <p className="text-3xl font-bold text-foreground">{value}</p>
    </div>
  );
}

// Loading Component
function DashboardLoading() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-4">
        <Loader className="animate-spin text-primary w-12 h-12" />
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    </div>
  );
}

// Dashboard Stats Component (will fetch data)
async function DashboardStats() {
  // TODO: Fetch real stats from API
  // For now, using mock data
  const stats = {
    totalProducts: 156,
    activeProducts: 89,
    totalUsers: 1243,
    pendingKYC: 12,
    totalBids: 5678,
    todayBids: 234,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <StatsCard
        title="Total Products"
        value={stats.totalProducts}
        icon={Package}
        trend="up"
        trendValue="12%"
      />
      <StatsCard
        title="Active Products"
        value={stats.activeProducts}
        icon={TrendingUp}
        trend="up"
        trendValue="8%"
      />
      <StatsCard
        title="Total Users"
        value={stats.totalUsers.toLocaleString()}
        icon={Users}
        trend="up"
        trendValue="15%"
      />
      <StatsCard
        title="Total Bids"
        value={stats.totalBids.toLocaleString()}
        icon={Gavel}
        trend="up"
        trendValue="23%"
      />
      <StatsCard
        title="Today's Bids"
        value={stats.todayBids}
        icon={Clock}
        trend="up"
        trendValue="5%"
      />
      <StatsCard
        title="Pending KYC"
        value={stats.pendingKYC}
        icon={ShieldCheck}
      />
    </div>
  );
}

// Recent Activity Component
function RecentActivity() {
  const activities = [
    {
      id: 1,
      type: "product",
      message: "New product added: iPhone 15 Pro",
      time: "5 minutes ago",
    },
    {
      id: 2,
      type: "kyc",
      message: "KYC approved for user John Doe",
      time: "15 minutes ago",
    },
    {
      id: 3,
      type: "bid",
      message: "New bid placed on MacBook Pro",
      time: "23 minutes ago",
    },
    {
      id: 4,
      type: "user",
      message: "New user registration: jane@example.com",
      time: "1 hour ago",
    },
  ];

  return (
    <div className="glass-card p-6 rounded-xl border border-border">
      <h2 className="text-xl font-bold text-foreground mb-6">Recent Activity</h2>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start gap-3 pb-4 border-b border-border last:border-b-0 last:pb-0"
          >
            <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
            <div className="flex-1">
              <p className="text-sm text-foreground">{activity.message}</p>
              <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
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
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to the admin portal. Here's an overview of your platform.
        </p>
      </div>

      {/* Stats */}
      <Suspense fallback={<DashboardLoading />}>
        <DashboardStats />
      </Suspense>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity />
        <div className="glass-card p-6 rounded-xl border border-border">
          <h2 className="text-xl font-bold text-foreground mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <a
              href="/admin/products/new"
              className="flex flex-col items-center justify-center gap-2 p-4 bg-primary/5 hover:bg-primary/10 rounded-lg transition-all border border-primary/20"
            >
              <Package className="h-8 w-8 text-primary" />
              <span className="text-sm font-medium text-foreground">Add Product</span>
            </a>
            <a
              href="/admin/kyc"
              className="flex flex-col items-center justify-center gap-2 p-4 bg-primary/5 hover:bg-primary/10 rounded-lg transition-all border border-primary/20"
            >
              <ShieldCheck className="h-8 w-8 text-primary" />
              <span className="text-sm font-medium text-foreground">Review KYC</span>
            </a>
            <a
              href="/admin/accounts"
              className="flex flex-col items-center justify-center gap-2 p-4 bg-primary/5 hover:bg-primary/10 rounded-lg transition-all border border-primary/20"
            >
              <Users className="h-8 w-8 text-primary" />
              <span className="text-sm font-medium text-foreground">Manage Users</span>
            </a>
            <a
              href="/admin/bids"
              className="flex flex-col items-center justify-center gap-2 p-4 bg-primary/5 hover:bg-primary/10 rounded-lg transition-all border border-primary/20"
            >
              <Gavel className="h-8 w-8 text-primary" />
              <span className="text-sm font-medium text-foreground">View Bids</span>
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
