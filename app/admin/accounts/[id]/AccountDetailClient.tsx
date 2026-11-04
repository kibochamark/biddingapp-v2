"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft,
  Mail,
  Phone,
  Calendar,
  Fingerprint,
  MapPin,
  Store,
  Ban,
  CheckCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/format";
import { terminateAccount, reactivateAccount } from "../../actions/accounts";
import {
  StatusBadge,
  KYCStatusBadge,
  TerminateAccountModal,
} from "../accounts-table";
import type { Account } from "@/lib/types";

export default function AccountDetailClient({ account }: { account: Account }) {
  const router = useRouter();
  const [showTerminate, setShowTerminate] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const status = account.status ?? "ACTIVE";
  const isSeller = Boolean(account.sellerProfile);
  const addresses = account.addresses ?? [];

  const handleTerminate = async (reason: string, permanent: boolean) => {
    setIsProcessing(true);
    const result = await terminateAccount(account.id, reason, permanent);
    if (result.success) {
      setShowTerminate(false);
      router.refresh();
    }
    setIsProcessing(false);
  };

  const handleReactivate = async () => {
    if (!confirm("Are you sure you want to reactivate this account?")) return;
    setIsProcessing(true);
    const result = await reactivateAccount(account.id);
    if (result.success) {
      router.refresh();
    }
    setIsProcessing(false);
  };

  return (
    <div className="space-y-8">
      <Link
        href="/admin/accounts"
        className="inline-flex items-center gap-1.5 text-sm text-mute hover:text-ink"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Accounts
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-ink">
              {account.fullName ?? account.email ?? "Unnamed account"}
            </h1>
            <StatusBadge status={status} />
            {isSeller && (
              <Badge>
                <Store className="h-3 w-3" />
                Seller
              </Badge>
            )}
          </div>
          <p className="text-sm text-mute">Account ID: {account.id}</p>
          {account.suspensionReason && (
            <p className="text-sm text-sale mt-1">{account.suspensionReason}</p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {status === "SUSPENDED" ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleReactivate}
              disabled={isProcessing}
              className="text-success hover:bg-success/10"
            >
              <CheckCircle className="h-4 w-4" />
              Reactivate
            </Button>
          ) : (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowTerminate(true)}
              disabled={isProcessing}
            >
              <Ban className="h-4 w-4" />
              Suspend / Terminate
            </Button>
          )}
        </div>
      </div>

      {/* Identity strip — flat, no boxing rule, matches the auction-detail stats strip */}
      <div className="flex flex-wrap items-center gap-x-10 gap-y-4 py-5">
        <div>
          <p className="text-xs text-mute uppercase tracking-wider mb-1">Email</p>
          <p className="text-sm font-medium text-ink flex items-center gap-1.5">
            <Mail className="h-3.5 w-3.5" />
            {account.email ?? "—"}
          </p>
        </div>
        <div>
          <p className="text-xs text-mute uppercase tracking-wider mb-1">Contact</p>
          <p className="text-sm font-medium text-ink flex items-center gap-1.5">
            <Phone className="h-3.5 w-3.5" />
            {account.contact ?? "—"}
          </p>
        </div>
        <div>
          <p className="text-xs text-mute uppercase tracking-wider mb-1">Kinde ID</p>
          <p className="text-sm font-medium text-ink flex items-center gap-1.5">
            <Fingerprint className="h-3.5 w-3.5" />
            {account.kindeId}
          </p>
        </div>
        <div>
          <p className="text-xs text-mute uppercase tracking-wider mb-1">Member Since</p>
          <p className="text-sm font-medium text-ink flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            {formatDateTime(account.createdAt)}
          </p>
        </div>
        {account.kycStatus && (
          <div>
            <p className="text-xs text-mute uppercase tracking-wider mb-1">KYC</p>
            <KYCStatusBadge status={account.kycStatus} />
          </div>
        )}
        {typeof account.totalBids === "number" && (
          <div>
            <p className="text-xs text-mute uppercase tracking-wider mb-1">Total Bids</p>
            <p className="text-sm font-medium text-ink">{account.totalBids}</p>
          </div>
        )}
      </div>

      {/* Addresses */}
      <div>
        <h2 className="text-lg font-semibold text-ink mb-4">
          Addresses ({addresses.length})
        </h2>

        {addresses.length === 0 ? (
          <div className="bg-soft-cloud p-8 text-center">
            <p className="text-mute">No addresses on file.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {addresses.map((address) => {
              const recipientName = address.recipientName ?? address.recipientname ?? "—";
              return (
                <div key={address.id} className="shadow-surface p-5 space-y-2">
                  <div className="flex items-center gap-2">
                    {address.label && <Badge>{address.label}</Badge>}
                    {address.isPrimary && <Badge variant="success">Primary</Badge>}
                  </div>
                  <p className="text-sm font-medium text-ink">{recipientName}</p>
                  <p className="text-sm text-mute flex items-start gap-1.5">
                    <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                    <span>
                      {address.street}, {address.city}, {address.state}{" "}
                      {address.zipCode}, {address.country}
                    </span>
                  </p>
                  <p className="text-sm text-mute flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 shrink-0" />
                    {address.phone}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showTerminate && (
        <TerminateAccountModal
          account={account}
          onConfirm={handleTerminate}
          onCancel={() => setShowTerminate(false)}
          isProcessing={isProcessing}
        />
      )}
    </div>
  );
}
