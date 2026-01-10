"use client";

import { useState } from "react";
import { Eye, CheckCircle, XCircle, User, FileText, Calendar } from "lucide-react";
import Image from "next/image";
import { approveKYC, rejectKYC } from "../actions/kyc";
import { useRouter } from "next/navigation";

// Mock data - replace with real data from server
const mockKYCSubmissions = [
  {
    id: "1",
    accountId: "acc_123",
    userName: "John Doe",
    userEmail: "john@example.com",
    status: "PENDING",
    submittedAt: new Date("2024-01-15"),
    personalInfo: {
      fullName: "John Doe",
      dateOfBirth: "1990-05-15",
      nationality: "United States",
    },
    documents: [
      { documentType: "NATIONAL_ID", url: "/placeholder.png" },
      { documentType: "SELFIE", url: "/placeholder.png" },
    ],
  },
  {
    id: "2",
    accountId: "acc_456",
    userName: "Jane Smith",
    userEmail: "jane@example.com",
    status: "PENDING",
    submittedAt: new Date("2024-01-16"),
    personalInfo: {
      fullName: "Jane Smith",
      dateOfBirth: "1992-08-20",
      nationality: "Canada",
    },
    documents: [
      { documentType: "PASSPORT", url: "/placeholder.png" },
      { documentType: "SELFIE", url: "/placeholder.png" },
    ],
  },
];

function StatusBadge({ status }: { status: string }) {
  const styles = {
    PENDING: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    APPROVED: "bg-green-500/10 text-green-600 border-green-500/20",
    REJECTED: "bg-red-500/10 text-red-600 border-red-500/20",
    NOT_SUBMITTED: "bg-gray-500/10 text-gray-600 border-gray-500/20",
  };

  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-full border ${
        styles[status as keyof typeof styles]
      }`}
    >
      {status.replace("_", " ")}
    </span>
  );
}

function KYCReviewModal({
  submission,
  onClose,
  onApprove,
  onReject,
}: {
  submission: any;
  onClose: () => void;
  onApprove: () => void;
  onReject: (reason: string) => void;
}) {
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleApprove = async () => {
    setIsSubmitting(true);
    await onApprove();
    setIsSubmitting(false);
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      alert("Please provide a rejection reason");
      return;
    }
    setIsSubmitting(true);
    await onReject(rejectionReason);
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-xl border border-border max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">KYC Review</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Review submission for {submission.userName}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-accent rounded-lg transition-colors"
            >
              ✕
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
                  {submission.personalInfo.fullName}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date of Birth</p>
                <p className="text-base font-medium text-foreground">
                  {submission.personalInfo.dateOfBirth}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Nationality</p>
                <p className="text-base font-medium text-foreground">
                  {submission.personalInfo.nationality}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="text-base font-medium text-foreground">
                  {submission.userEmail}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {submission.documents.map((doc: any, index: number) => (
                <div key={index} className="border border-border rounded-lg p-4">
                  <p className="text-sm font-medium text-foreground mb-3">
                    {doc.documentType.replace("_", " ")}
                  </p>
                  <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                    <Image
                      src={doc.url}
                      alt={doc.documentType}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline mt-2 inline-block"
                  >
                    View Full Size
                  </a>
                </div>
              ))}
            </div>
          </div>

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
        </div>

        {/* Actions */}
        <div className="sticky bottom-0 bg-card border-t border-border p-6">
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-2.5 border border-border rounded-lg hover:bg-accent transition-all text-sm font-medium disabled:opacity-50"
            >
              Cancel
            </button>
            {!showRejectForm ? (
              <>
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
            ) : (
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function KYCList() {
  const router = useRouter();
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [filter, setFilter] = useState<string>("PENDING");

  const filteredSubmissions = mockKYCSubmissions.filter(
    (sub) => filter === "ALL" || sub.status === filter
  );

  const handleApprove = async () => {
    if (!selectedSubmission) return;
    const result = await approveKYC(selectedSubmission.id);
    if (result.success) {
      setSelectedSubmission(null);
      router.refresh();
    }
  };

  const handleReject = async (reason: string) => {
    if (!selectedSubmission) return;
    const result = await rejectKYC(selectedSubmission.id, reason);
    if (result.success) {
      setSelectedSubmission(null);
      router.refresh();
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => setFilter("ALL")}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
            filter === "ALL"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-foreground hover:bg-accent"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("PENDING")}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
            filter === "PENDING"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-foreground hover:bg-accent"
          }`}
        >
          Pending
        </button>
        <button
          onClick={() => setFilter("APPROVED")}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
            filter === "APPROVED"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-foreground hover:bg-accent"
          }`}
        >
          Approved
        </button>
        <button
          onClick={() => setFilter("REJECTED")}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
            filter === "REJECTED"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-foreground hover:bg-accent"
          }`}
        >
          Rejected
        </button>
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
                  Submitted
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Documents
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredSubmissions.map((submission) => (
                <tr key={submission.id} className="hover:bg-accent/50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {submission.userName}
                      </p>
                      <p className="text-xs text-muted-foreground">{submission.userEmail}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={submission.status} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {submission.submittedAt.toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-muted-foreground">
                      {submission.documents.length} files
                    </p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setSelectedSubmission(submission)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all text-sm font-medium"
                    >
                      <Eye className="h-4 w-4" />
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      {selectedSubmission && (
        <KYCReviewModal
          submission={selectedSubmission}
          onClose={() => setSelectedSubmission(null)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </div>
  );
}
