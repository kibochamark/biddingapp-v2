"use client";

import { useState } from "react";
import { Search, Eye, Ban, CheckCircle, XCircle, Calendar, Mail, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { terminateAccount, reactivateAccount } from "../actions/accounts";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

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
  const variants = {
    ACTIVE: "success",
    SUSPENDED: "sale",
    TERMINATED: "default",
  } as const;

  return (
    <Badge variant={variants[status as keyof typeof variants] ?? "default"}>
      {status}
    </Badge>
  );
}

function KYCStatusBadge({ status }: { status: string }) {
  const variants = {
    APPROVED: "success",
    PENDING: "default",
    REJECTED: "sale",
    NOT_SUBMITTED: "default",
  } as const;

  return (
    <Badge variant={variants[status as keyof typeof variants] ?? "default"}>
      {status.replace("_", " ")}
    </Badge>
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
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-background shadow-overlay max-w-lg w-full p-6">
        <h3 className="text-xl font-semibold text-ink mb-2">Terminate Account</h3>
        <p className="text-sm text-mute mb-4">
          You are about to {permanent ? "permanently terminate" : "suspend"} the account for{" "}
          <strong>{account.fullName}</strong> ({account.email})
        </p>

        <div className="space-y-4 mb-6">
          <div>
            <Label htmlFor="termination-reason" className="mb-2">
              Reason for termination *
            </Label>
            <Textarea
              id="termination-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain why this account is being terminated..."
              rows={4}
            />
          </div>

          <div className="flex items-start gap-3 p-4 bg-sale/10 border border-sale/20">
            <Checkbox
              id="permanent"
              checked={permanent}
              onChange={(e) => setPermanent(e.target.checked)}
              className="mt-0.5"
            />
            <label htmlFor="permanent" className="flex-1 text-sm">
              <p className="font-medium text-ink">Permanent Termination</p>
              <p className="text-mute text-xs mt-1">
                If checked, this account cannot be reactivated. Otherwise, it will be suspended and
                can be restored later.
              </p>
            </label>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <Button variant="outline" onClick={onCancel} disabled={isProcessing}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleSubmit} disabled={isProcessing}>
            {isProcessing ? "Processing..." : permanent ? "Terminate Permanently" : "Suspend Account"}
          </Button>
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
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-mute pointer-events-none" />
          <Input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-11"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
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
            variant={filterStatus === "SUSPENDED" ? "default" : "outline"}
            onClick={() => setFilterStatus("SUSPENDED")}
          >
            Suspended
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-soft-cloud">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-ink">
                  User
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-ink">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-ink">
                  KYC
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-ink">
                  Total Bids
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-ink">
                  Joined
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-ink">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className=" ">
              {filteredAccounts.map((account) => (
                <tr key={account.id} className="hover:bg-soft-cloud/60 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-ink">{account.fullName}</p>
                      <div className="flex items-center gap-1 text-xs text-mute mt-1">
                        <Mail className="h-3 w-3" />
                        {account.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={account.status} />
                    {account.suspensionReason && (
                      <p className="text-xs text-mute mt-1">
                        {account.suspensionReason}
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <KYCStatusBadge status={account.kycStatus} />
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-ink">{account.totalBids}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-mute">
                      <Calendar className="h-4 w-4" />
                      {account.joinedAt.toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button asChild variant="ghost" size="icon-sm" title="View Details">
                        <Link href={`/admin/accounts/${account.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      {account.status === "SUSPENDED" ? (
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => handleReactivate(account.id)}
                          title="Reactivate"
                          className="text-success hover:bg-success/10"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => setAccountToTerminate(account)}
                          title="Suspend/Terminate"
                          className="text-sale hover:bg-sale/10"
                        >
                          <Ban className="h-4 w-4" />
                        </Button>
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
            <p className="text-mute">No accounts found</p>
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
