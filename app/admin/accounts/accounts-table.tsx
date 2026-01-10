"use client";

import { useState } from "react";
import { Search, Eye, Ban, CheckCircle, XCircle, Calendar, Mail, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { terminateAccount, reactivateAccount } from "../actions/accounts";
import { useRouter } from "next/navigation";

// Mock data - replace with real data from server
const mockAccounts = [
  {
    id: "acc_1",
    kindeId: "kinde_123",
    email: "john.doe@example.com",
    fullName: "John Doe",
    status: "ACTIVE",
    kycStatus: "APPROVED",
    totalBids: 45,
    joinedAt: new Date("2024-01-10"),
  },
  {
    id: "acc_2",
    kindeId: "kinde_456",
    email: "jane.smith@example.com",
    fullName: "Jane Smith",
    status: "ACTIVE",
    kycStatus: "PENDING",
    totalBids: 12,
    joinedAt: new Date("2024-01-15"),
  },
  {
    id: "acc_3",
    kindeId: "kinde_789",
    email: "bob.wilson@example.com",
    fullName: "Bob Wilson",
    status: "SUSPENDED",
    kycStatus: "APPROVED",
    totalBids: 89,
    joinedAt: new Date("2023-12-05"),
    suspensionReason: "Suspicious bidding activity",
  },
];

function StatusBadge({ status }: { status: string }) {
  const styles = {
    ACTIVE: "bg-green-500/10 text-green-600 border-green-500/20",
    SUSPENDED: "bg-red-500/10 text-red-600 border-red-500/20",
    TERMINATED: "bg-gray-500/10 text-gray-600 border-gray-500/20",
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

function KYCStatusBadge({ status }: { status: string }) {
  const styles = {
    APPROVED: "bg-green-500/10 text-green-600",
    PENDING: "bg-amber-500/10 text-amber-600",
    REJECTED: "bg-red-500/10 text-red-600",
    NOT_SUBMITTED: "bg-gray-500/10 text-gray-600",
  };

  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-full ${
        styles[status as keyof typeof styles]
      }`}
    >
      {status.replace("_", " ")}
    </span>
  );
}

function TerminateAccountModal({
  account,
  onConfirm,
  onCancel,
  isProcessing,
}: {
  account: any;
  onConfirm: (reason: string, permanent: boolean) => void;
  onCancel: () => void;
  isProcessing: boolean;
}) {
  const [reason, setReason] = useState("");
  const [permanent, setPermanent] = useState(false);

  const handleSubmit = () => {
    if (!reason.trim()) {
      alert("Please provide a reason for termination");
      return;
    }
    onConfirm(reason, permanent);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-xl border border-border max-w-lg w-full p-6">
        <h3 className="text-xl font-bold text-foreground mb-2">Terminate Account</h3>
        <p className="text-sm text-muted-foreground mb-4">
          You are about to {permanent ? "permanently terminate" : "suspend"} the account for{" "}
          <strong>{account.fullName}</strong> ({account.email})
        </p>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Reason for termination *
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain why this account is being terminated..."
              className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              rows={4}
            />
          </div>

          <div className="flex items-start gap-3 p-4 bg-destructive/5 rounded-lg border border-destructive/20">
            <input
              type="checkbox"
              id="permanent"
              checked={permanent}
              onChange={(e) => setPermanent(e.target.checked)}
              className="mt-0.5"
            />
            <label htmlFor="permanent" className="flex-1 text-sm">
              <p className="font-medium text-foreground">Permanent Termination</p>
              <p className="text-muted-foreground text-xs mt-1">
                If checked, this account cannot be reactivated. Otherwise, it will be suspended and
                can be restored later.
              </p>
            </label>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={isProcessing}
            className="px-4 py-2 border border-border rounded-lg hover:bg-accent transition-all text-sm font-medium disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isProcessing}
            className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-all text-sm font-medium disabled:opacity-50"
          >
            {isProcessing ? "Processing..." : permanent ? "Terminate Permanently" : "Suspend Account"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AccountsTable() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [accountToTerminate, setAccountToTerminate] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const filteredAccounts = mockAccounts.filter((account) => {
    const matchesSearch =
      account.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "ALL" || account.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleTerminate = async (reason: string, permanent: boolean) => {
    if (!accountToTerminate) return;
    setIsProcessing(true);
    const result = await terminateAccount(accountToTerminate.id, reason, permanent);
    if (result.success) {
      setAccountToTerminate(null);
      router.refresh();
    }
    setIsProcessing(false);
  };

  const handleReactivate = async (accountId: string) => {
    if (!confirm("Are you sure you want to reactivate this account?")) return;
    const result = await reactivateAccount(accountId);
    if (result.success) {
      router.refresh();
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring text-sm"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
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
            onClick={() => setFilterStatus("SUSPENDED")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              filterStatus === "SUSPENDED"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-foreground hover:bg-accent"
            }`}
          >
            Suspended
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="glass-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  User
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  KYC
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Total Bids
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Joined
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredAccounts.map((account) => (
                <tr key={account.id} className="hover:bg-accent/50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-foreground">{account.fullName}</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                        <Mail className="h-3 w-3" />
                        {account.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={account.status} />
                    {account.suspensionReason && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {account.suspensionReason}
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <KYCStatusBadge status={account.kycStatus} />
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-foreground">{account.totalBids}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {account.joinedAt.toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/accounts/${account.id}`}
                        className="p-2 hover:bg-accent rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      </Link>
                      {account.status === "SUSPENDED" ? (
                        <button
                          onClick={() => handleReactivate(account.id)}
                          className="p-2 hover:bg-green-500/10 rounded-lg transition-colors"
                          title="Reactivate"
                        >
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </button>
                      ) : (
                        <button
                          onClick={() => setAccountToTerminate(account)}
                          className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                          title="Suspend/Terminate"
                        >
                          <Ban className="h-4 w-4 text-destructive" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredAccounts.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-muted-foreground">No accounts found</p>
          </div>
        )}
      </div>

      {/* Terminate Modal */}
      {accountToTerminate && (
        <TerminateAccountModal
          account={accountToTerminate}
          onConfirm={handleTerminate}
          onCancel={() => setAccountToTerminate(null)}
          isProcessing={isProcessing}
        />
      )}
    </div>
  );
}
