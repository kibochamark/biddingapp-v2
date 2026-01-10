import { Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import KYCList from "./kyc-list";
import { fetchKYCSubmissions, fetchKYCStats } from "../actions/kyc";

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
            <p className="text-2xl font-bold text-foreground">{stats.pending || 0}</p>
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
            <p className="text-2xl font-bold text-foreground">{stats.approved || 0}</p>
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
            <p className="text-2xl font-bold text-foreground">{stats.rejected || 0}</p>
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
            <p className="text-2xl font-bold text-foreground">{stats.notSubmitted || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function KYCPage() {
  // Fetch KYC stats and submissions from server
  const statsResult = await fetchKYCStats();
  const submissionsResult = await fetchKYCSubmissions();

  const stats = statsResult.success ? statsResult.data : {
    pending: 0,
    approved: 0,
    rejected: 0,
    notSubmitted: 0,
  };

  const submissions = submissionsResult.success && submissionsResult.data ? submissionsResult.data : [];

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
      <KYCList initialSubmissions={submissions} />
    </div>
  );
}

export const metadata = {
  title: "KYC Verification - Admin Portal",
  description: "Manage user KYC submissions",
};
