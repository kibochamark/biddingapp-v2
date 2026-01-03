"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { setKYCData } from "@/lib/redux/slices/kycSlice";
import { fetchKYCStatus } from "@/app/actions/kyc";
import KYCFormNew from "./kyc-form-new";

interface KYCSectionNewProps {
  accountId: string;
  initialKYCData: any;
}

export default function KYCSectionNew({ accountId, initialKYCData }: KYCSectionNewProps) {
  const dispatch = useAppDispatch();
  const { data } = useAppSelector((state) => state.kyc);
  const [showForm, setShowForm] = useState(false);

  // Initialize Redux state with server data
  useEffect(() => {
    if (initialKYCData) {
      dispatch(setKYCData(initialKYCData));
    } else {
      // No KYC data, initialize empty state
      dispatch(setKYCData({
        accountId,
        status: 'NOT_SUBMITTED',
        documents: [],
      }));
    }
  }, [accountId, initialKYCData, dispatch]);

  const status = data?.status || 'NOT_SUBMITTED';

  return (
    <div className="space-y-6">
      <div className="glass-card rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-primary" />
          Identity Verification
        </h2>
        <p className="text-muted-foreground mb-6">
          Complete your identity verification to unlock full bidding privileges.
        </p>

        {/* NOT_SUBMITTED */}
        {status === 'NOT_SUBMITTED' && !showForm && (
          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                    Verification Required
                  </h3>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    To place bids and participate in auctions, you need to verify
                    your identity. This process typically takes 1-2 business days.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">What you'll need:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Valid government-issued ID (National ID, Passport, or Driver's License)</li>
                <li>Clear photo of yourself (selfie)</li>
                <li>Proof of address document (utility bill or bank statement)</li>
              </ul>
            </div>

            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90"
            >
              Start Verification
            </button>
          </div>
        )}

        {/* FORM */}
        {showForm && status === 'NOT_SUBMITTED' && (
          <KYCFormNew
            accountId={accountId}
            onSuccess={() => {
              setShowForm(false);
              // Refresh KYC status
              fetchKYCStatus().then(result => {
                if (result.success && result.data) {
                  dispatch(setKYCData(result.data));
                }
              });
            }}
            onCancel={() => setShowForm(false)}
          />
        )}

        {/* PENDING */}
        {status === 'PENDING' && (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 dark:bg-yellow-900 rounded-full mb-4">
              <Clock className="h-8 w-8 text-yellow-600 dark:text-yellow-300" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Verification Pending</h3>
            <p className="text-muted-foreground mb-4">
              Your documents are being reviewed. This usually takes 1-2 business
              days.
            </p>
            {data?.personalInfo && (
              <div className="mt-6 bg-muted rounded-lg p-4 max-w-md mx-auto text-left">
                <h4 className="font-semibold mb-2 text-sm">Submitted Information:</h4>
                <div className="space-y-1 text-sm">
                  <p><span className="text-muted-foreground">Name:</span> {data.personalInfo.fullName}</p>
                  <p><span className="text-muted-foreground">Date of Birth:</span> {data.personalInfo.dateOfBirth}</p>
                  <p><span className="text-muted-foreground">Nationality:</span> {data.personalInfo.nationality}</p>
                  <p><span className="text-muted-foreground">Documents:</span> {data.documents.length} uploaded</p>
                </div>
              </div>
            )}
            {data?.submittedAt && (
              <p className="text-sm text-muted-foreground mt-4">
                Submitted on {new Date(data.submittedAt).toLocaleDateString()}
              </p>
            )}
          </div>
        )}

        {/* APPROVED */}
        {status === 'APPROVED' && (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full mb-4">
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-300" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              Verification Complete
            </h3>
            <p className="text-muted-foreground mb-4">
              Your account is fully verified and ready to bid!
            </p>
            {data?.reviewedAt && (
              <p className="text-sm text-muted-foreground">
                Verified on {new Date(data.reviewedAt).toLocaleDateString()}
              </p>
            )}
            <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg max-w-md mx-auto">
              <h4 className="font-semibold mb-2 text-green-900 dark:text-green-100">
                Benefits Unlocked:
              </h4>
              <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                <li>✓ Unlimited bidding access</li>
                <li>✓ Ability to create listings</li>
                <li>✓ Priority customer support</li>
                <li>✓ Faster checkout process</li>
              </ul>
            </div>
          </div>
        )}

        {/* REJECTED */}
        {status === 'REJECTED' && (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full mb-4">
              <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-300" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Verification Failed</h3>
            <p className="text-muted-foreground mb-2">
              Unfortunately, we couldn't verify your documents.
            </p>
            {data?.rejectionReason && (
              <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg max-w-md mx-auto">
                <p className="text-sm text-red-700 dark:text-red-300">
                  <strong>Reason:</strong> {data.rejectionReason}
                </p>
              </div>
            )}
            <p className="text-muted-foreground mb-4">
              Please review the reason above and try again with clearer images or
              correct information.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90"
            >
              Resubmit Verification
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
