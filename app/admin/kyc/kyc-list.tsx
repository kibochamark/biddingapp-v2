"use client";

import { useState, useEffect } from "react";
import { XCircle, CheckCircle, User, FileText, X, Trash2 } from "lucide-react";
import Image from "next/image";
import { approveKYC, rejectKYC, deleteKYC, requestMoreInfo } from "../actions/kyc";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { DataTable } from "@/Globalcomponents/ReusableTable";
import { kycColumns } from "./columns";

interface KYCListProps {
  initialSubmissions: any[];
}

function KYCReviewModal({
  submission,
  onClose,
  onApprove,
  onReject,
  onRequestMoreInfo,
  onDelete,
}: {
  submission: any;
  onClose: () => void;
  onApprove: () => void;
  onReject: (reason: string) => void;
  onRequestMoreInfo: (reason: string) => void;
  onDelete: () => void;
}) {
  const [rejectionReason, setRejectionReason] = useState("");
  const [moreInfoReason, setMoreInfoReason] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [showMoreInfoForm, setShowMoreInfoForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleApprove = () => {
    setIsSubmitting(true);
    onApprove();
    setIsSubmitting(false);
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }
    setIsSubmitting(true);
    onReject(rejectionReason);
    setIsSubmitting(false);
  };

  const handleRequestMoreInfo = () => {
    if (!moreInfoReason.trim()) {
      toast.error("Please provide a reason for requesting more information");
      return;
    }
    setIsSubmitting(true);
    onRequestMoreInfo(moreInfoReason);
    setIsSubmitting(false);
  };

  const handleDelete = () => {
    setIsSubmitting(true);
    onDelete();
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-xl border border-border max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border p-6 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">KYC Review</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Review submission for {submission.fullName}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-accent rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Personal Info */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Full Name</p>
                <p className="text-base font-medium text-foreground">
                  {submission.fullName}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date of Birth</p>
                <p className="text-base font-medium text-foreground">
                  {submission.dateOfBirth}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Nationality</p>
                <p className="text-base font-medium text-foreground">
                  {submission.nationality}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Account ID</p>
                <p className="text-xs font-medium text-foreground font-mono">
                  {submission.accountId}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Document Type</p>
                <p className="text-base font-medium text-foreground">
                  {submission.documentType?.replace("_", " ") || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Documents */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Uploaded Documents
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* ID Document */}
              {submission.idDocumentUrl && (
                <div className="border border-border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground">
                      {submission.documentType?.replace("_", " ") || "ID Document"}
                    </p>
                    {submission.idDocumentNumber && (
                      <span className="text-xs text-muted-foreground">
                        #{submission.idDocumentNumber}
                      </span>
                    )}
                  </div>
                  <div className="relative aspect-video bg-muted rounded-lg overflow-hidden group">
                    <Image
                      src={submission.idDocumentUrl}
                      alt="ID Document"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <a
                        href={submission.idDocumentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-white text-black rounded-md text-xs font-medium hover:bg-white/90"
                      >
                        View Full Size
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* Proof of Address */}
              {submission.proofOfAddressUrl && (
                <div className="border border-border rounded-lg p-4 space-y-3">
                  <p className="text-sm font-medium text-foreground">
                    Proof of Address
                  </p>
                  <div className="relative aspect-video bg-muted rounded-lg overflow-hidden group">
                    <Image
                      src={submission.proofOfAddressUrl}
                      alt="Proof of Address"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <a
                        href={submission.proofOfAddressUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-white text-black rounded-md text-xs font-medium hover:bg-white/90"
                      >
                        View Full Size
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* Selfie */}
              {submission.selfieUrl && (
                <div className="border border-border rounded-lg p-4 space-y-3">
                  <p className="text-sm font-medium text-foreground">
                    Selfie Verification
                  </p>
                  <div className="relative aspect-video bg-muted rounded-lg overflow-hidden group">
                    <Image
                      src={submission.selfieUrl}
                      alt="Selfie"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <a
                        href={submission.selfieUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-white text-black rounded-md text-xs font-medium hover:bg-white/90"
                      >
                        View Full Size
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {!submission.idDocumentUrl && !submission.proofOfAddressUrl && !submission.selfieUrl && (
                <p className="text-sm text-muted-foreground col-span-full">No documents uploaded</p>
              )}
            </div>
          </div>

          {/* Rejection Reason (if rejected) */}
          {submission.status === "REJECTED" && submission.rejectionReason && (
            <div className="border border-red-500/20 rounded-lg p-4 bg-red-500/5">
              <h3 className="text-sm font-semibold text-foreground mb-2">Rejection Reason</h3>
              <p className="text-sm text-muted-foreground">{submission.rejectionReason}</p>
            </div>
          )}

          {/* More Info Reason (if needs more info) */}
          {submission.status === "NEEDS_MORE_INFO" && submission.rejectionReason && (
            <div className="border border-blue-500/20 rounded-lg p-4 bg-blue-500/5">
              <h3 className="text-sm font-semibold text-foreground mb-2">Additional Information Requested</h3>
              <p className="text-sm text-muted-foreground">{submission.rejectionReason}</p>
            </div>
          )}

          {/* Rejection Form */}
          {showRejectForm && (
            <div className="border border-border rounded-lg p-4 bg-red-500/5">
              <label className="block text-sm font-medium text-foreground mb-2">
                Rejection Reason *
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Explain why this KYC submission is being rejected..."
                className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                rows={4}
              />
            </div>
          )}

          {/* Request More Info Form */}
          {showMoreInfoForm && (
            <div className="border border-border rounded-lg p-4 bg-blue-500/5">
              <label className="block text-sm font-medium text-foreground mb-2">
                What additional information is needed? *
              </label>
              <textarea
                value={moreInfoReason}
                onChange={(e) => setMoreInfoReason(e.target.value)}
                placeholder="Explain what additional information or documents are needed..."
                className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                rows={4}
              />
            </div>
          )}

          {/* Delete Confirmation */}
          {showDeleteConfirm && (
            <div className="border border-destructive/20 rounded-lg p-4 bg-destructive/5">
              <p className="text-sm font-medium text-foreground mb-2">
                Are you sure you want to delete this KYC submission?
              </p>
              <p className="text-xs text-muted-foreground">This action cannot be undone.</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="sticky bottom-0 bg-card border-t border-border p-6">
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => setShowDeleteConfirm(!showDeleteConfirm)}
              disabled={isSubmitting}
              className="px-4 py-2 text-destructive hover:bg-destructive/10 rounded-lg transition-all text-sm font-medium flex items-center gap-2 disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />
              Delete KYC
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                disabled={isSubmitting}
                className="px-6 py-2.5 border border-border rounded-lg hover:bg-accent transition-all text-sm font-medium disabled:opacity-50"
              >
                Cancel
              </button>
              {showDeleteConfirm ? (
                <>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={isSubmitting}
                    className="px-6 py-2.5 border border-border rounded-lg hover:bg-accent transition-all text-sm font-medium disabled:opacity-50"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={isSubmitting}
                    className="px-6 py-2.5 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-all text-sm font-medium disabled:opacity-50"
                  >
                    {isSubmitting ? "Deleting..." : "Confirm Delete"}
                  </button>
                </>
              ) : !showRejectForm && !showMoreInfoForm && submission.status === "PENDING" ? (
                <>
                  <button
                    onClick={() => setShowMoreInfoForm(true)}
                    disabled={isSubmitting}
                    className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-sm font-medium flex items-center gap-2 disabled:opacity-50"
                  >
                    <FileText className="h-4 w-4" />
                    Request More Info
                  </button>
                  <button
                    onClick={() => setShowRejectForm(true)}
                    disabled={isSubmitting}
                    className="px-6 py-2.5 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-all text-sm font-medium flex items-center gap-2 disabled:opacity-50"
                  >
                    <XCircle className="h-4 w-4" />
                    Reject
                  </button>
                  <button
                    onClick={handleApprove}
                    disabled={isSubmitting}
                    className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all text-sm font-medium flex items-center gap-2 disabled:opacity-50"
                  >
                    <CheckCircle className="h-4 w-4" />
                    {isSubmitting ? "Approving..." : "Approve"}
                  </button>
                </>
              ) : showRejectForm ? (
                <>
                  <button
                    onClick={() => setShowRejectForm(false)}
                    disabled={isSubmitting}
                    className="px-6 py-2.5 border border-border rounded-lg hover:bg-accent transition-all text-sm font-medium disabled:opacity-50"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleReject}
                    disabled={isSubmitting}
                    className="px-6 py-2.5 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-all text-sm font-medium disabled:opacity-50"
                  >
                    {isSubmitting ? "Rejecting..." : "Confirm Rejection"}
                  </button>
                </>
              ) : showMoreInfoForm ? (
                <>
                  <button
                    onClick={() => setShowMoreInfoForm(false)}
                    disabled={isSubmitting}
                    className="px-6 py-2.5 border border-border rounded-lg hover:bg-accent transition-all text-sm font-medium disabled:opacity-50"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleRequestMoreInfo}
                    disabled={isSubmitting}
                    className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-sm font-medium disabled:opacity-50"
                  >
                    {isSubmitting ? "Requesting..." : "Send Request"}
                  </button>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function KYCList({ initialSubmissions }: KYCListProps) {
  const router = useRouter();
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);

  const handleApprove = async () => {
    if (!selectedSubmission) return;
    const result = await approveKYC(selectedSubmission.id);
    if (result.success) {
      toast.success("KYC approved successfully");
      setSelectedSubmission(null);
      router.refresh();
    } else {
      toast.error(result.error || "Failed to approve KYC");
    }
  };

  const handleReject = async (reason: string) => {
    if (!selectedSubmission) return;
    const result = await rejectKYC(selectedSubmission.id, reason);
    if (result.success) {
      toast.success("KYC rejected");
      setSelectedSubmission(null);
      router.refresh();
    } else {
      toast.error(result.error || "Failed to reject KYC");
    }
  };

  const handleRequestMoreInfo = async (reason: string) => {
    if (!selectedSubmission) return;
    const result = await requestMoreInfo(selectedSubmission.id, reason);
    if (result.success) {
      toast.success("Request for additional information sent");
      setSelectedSubmission(null);
      router.refresh();
    } else {
      toast.error(result.error || "Failed to request more information");
    }
  };

  const handleDelete = async () => {
    if (!selectedSubmission) return;
    const result = await deleteKYC(selectedSubmission.id);
    if (result.success) {
      toast.success("KYC submission deleted");
      setSelectedSubmission(null);
      router.refresh();
    } else {
      toast.error(result.error || "Failed to delete KYC");
    }
  };

  // Listen for custom review events from the table
  useEffect(() => {
    const handleReviewEvent = (event: any) => {
      setSelectedSubmission(event.detail.submission);
    };

    document.addEventListener("kyc-review", handleReviewEvent);
    return () => {
      document.removeEventListener("kyc-review", handleReviewEvent);
    };
  }, []);

  return (
    <div className="space-y-4">
      <DataTable
        columns={kycColumns}
        data={initialSubmissions}
        search_alias_name="KYC submissions"
        filters={[
          {
            filtercolumn: "status",
            filtervalue: "All",
          },
          {
            filtercolumn: "status",
            filtervalue: "PENDING",
            classnames: "border border-amber-500/20 bg-amber-500/10 text-amber-600 hover:bg-amber-500/20",
          },
          {
            filtercolumn: "status",
            filtervalue: "NEEDS_MORE_INFO",
            classnames: "border border-blue-500/20 bg-blue-500/10 text-blue-600 hover:bg-blue-500/20",
          },
          {
            filtercolumn: "status",
            filtervalue: "APPROVED",
            classnames: "border border-green-500/20 bg-green-500/10 text-green-600 hover:bg-green-500/20",
          },
          {
            filtercolumn: "status",
            filtervalue: "REJECTED",
            classnames: "border border-red-500/20 bg-red-500/10 text-red-600 hover:bg-red-500/20",
          },
        ]}
        defaultfilter="All"
      />

      {/* Review Modal */}
      {selectedSubmission && (
        <KYCReviewModal
          submission={selectedSubmission}
          onClose={() => setSelectedSubmission(null)}
          onApprove={handleApprove}
          onReject={handleReject}
          onRequestMoreInfo={handleRequestMoreInfo}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
