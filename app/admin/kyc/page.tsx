import { Suspense } from "react";
import { Loader, ShieldCheck, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import KYCList from "./kyc-list";

function KYCLoading() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-4">
        <Loader className="animate-spin text-primary w-12 h-12" />
        <p className="text-muted-foreground">Loading KYC submissions...</p>
      </div>
    </div>
  );
}

// Stats cards for KYC overview
function KYCStats({ stats }: { stats: any }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="glass-card p-4 rounded-lg border border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500/10 rounded-lg">
            <Clock className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Pending</p>
            <p className="text-2xl font-bold text-foreground">{stats.pending}</p>
          </div>
        </div>
      </div>
      <div className="glass-card p-4 rounded-lg border border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-500/10 rounded-lg">
            <CheckCircle className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Approved</p>
            <p className="text-2xl font-bold text-foreground">{stats.approved}</p>
          </div>
        </div>
      </div>
      <div className="glass-card p-4 rounded-lg border border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-500/10 rounded-lg">
            <XCircle className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Rejected</p>
            <p className="text-2xl font-bold text-foreground">{stats.rejected}</p>
          </div>
        </div>
      </div>
      <div className="glass-card p-4 rounded-lg border border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <AlertCircle className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Not Submitted</p>
            <p className="text-2xl font-bold text-foreground">{stats.notSubmitted}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function KYCPage() {
  // TODO: Fetch KYC stats from API
  const stats = {
    pending: 12,
    approved: 458,
    rejected: 23,
    notSubmitted: 750,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">KYC Verification</h1>
        <p className="text-muted-foreground">
          Review and manage user identity verification submissions
        </p>
      </div>

      {/* Stats */}
      <KYCStats stats={stats} />

      {/* KYC List */}
      <Suspense fallback={<KYCLoading />}>
        <KYCList />
      </Suspense>
    </div>
  );
}

export const metadata = {
  title: "KYC Verification - Admin Portal",
  description: "Manage user KYC submissions",
};
