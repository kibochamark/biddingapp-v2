"use client";

import { useAppSelector } from "@/lib/redux/hooks";
import { isUserVerified, getVerificationMessage } from "@/lib/utils/verification";
import { AlertCircle, ShieldCheck, Clock, XCircle } from "lucide-react";
import Link from "next/link";

interface VerificationGateProps {
  children: React.ReactNode;
  action?: string; // e.g., "place a bid", "create a listing"
}

/**
 * Component that enforces KYC verification before allowing certain actions
 * Shows children only if user is verified, otherwise shows verification prompt
 */
export default function VerificationGate({ children, action = "perform this action" }: VerificationGateProps) {
  const { data } = useAppSelector((state) => state.kyc);
  const verified = isUserVerified(data);
  const { type, message } = getVerificationMessage(data);

  if (verified) {
    return <>{children}</>;
  }

  // Not verified - show appropriate message
  const getIcon = () => {
    switch (type) {
      case 'info':
        return <Clock className="h-5 w-5" />;
      case 'error':
        return <XCircle className="h-5 w-5" />;
      case 'warning':
      default:
        return <AlertCircle className="h-5 w-5" />;
    }
  };

  const getStyles = () => {
    switch (type) {
      case 'info':
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300';
      case 'error':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300';
      case 'warning':
      default:
        return 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300';
    }
  };

  return (
    <div className={`border rounded-lg p-4 ${getStyles()}`}>
      <div className="flex gap-3">
        {getIcon()}
        <div className="flex-1">
          <h3 className="font-semibold mb-1">
            Verification Required
          </h3>
          <p className="text-sm mb-3">
            {message} You need to complete identity verification to {action}.
          </p>
          <Link
            href="/profile?tab=verification"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <ShieldCheck className="h-4 w-4" />
            Complete Verification
          </Link>
        </div>
      </div>
    </div>
  );
}

/**
 * Inline verification badge that can be shown near actions
 */
export function VerificationBadge() {
  const { data } = useAppSelector((state) => state.kyc);
  const verified = isUserVerified(data);

  if (verified) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-full text-xs font-medium">
        <ShieldCheck className="h-3 w-3" />
        Verified
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 rounded-full text-xs font-medium">
      <AlertCircle className="h-3 w-3" />
      Unverified
    </span>
  );
}
