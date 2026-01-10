"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/Globalcomponents/data-table-column-header";
import { Eye, Calendar, User, Mail } from "lucide-react";
import { format } from "date-fns";

export interface KYCSubmission {
  id: string;
  accountId: string;
  fullName: string;
  dateOfBirth: string;
  nationality: string;
  documentType: string;
  idDocumentNumber?: string;
  idDocumentUrl?: string;
  proofOfAddressUrl?: string;
  selfieUrl?: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "NOT_SUBMITTED" | "NEEDS_MORE_INFO";
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
  account?: {
    kindeId?: string;
    createdAt?: string;
  };
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    PENDING: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    APPROVED: "bg-green-500/10 text-green-600 border-green-500/20",
    REJECTED: "bg-red-500/10 text-red-600 border-red-500/20",
    NOT_SUBMITTED: "bg-gray-500/10 text-gray-600 border-gray-500/20",
    NEEDS_MORE_INFO: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full border ${
        styles[status as keyof typeof styles] || "bg-gray-500/10 text-gray-600 border-gray-500/20"
      }`}
    >
      {status.replace("_", " ")}
    </span>
  );
}

export const kycColumns: ColumnDef<KYCSubmission>[] = [
  {
    accessorKey: "fullName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="User" />
    ),
    cell: ({ row }) => {
      const submission = row.original;
      return (
        <div className="flex items-start gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary">
            <User className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {submission.fullName}
            </p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
              <Mail className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">ID: {submission.accountId}</span>
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "nationality",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nationality" />
    ),
    cell: ({ row }) => (
      <span className="text-sm text-foreground">{row.getValue("nationality")}</span>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return <StatusBadge status={status} />;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Submitted" />
    ),
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as string;
      return (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4 flex-shrink-0" />
          <span>{format(new Date(date), "MMM dd, yyyy")}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "documentType",
    header: "Documents",
    cell: ({ row }) => {
      const submission = row.original;
      // Count how many document URLs are present
      const documentCount = [
        submission.idDocumentUrl,
        submission.proofOfAddressUrl,
        submission.selfieUrl,
      ].filter(Boolean).length;

      return (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-2 py-1 bg-muted rounded-md">
            <svg
              className="h-3.5 w-3.5 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
            <span className="text-xs font-medium text-muted-foreground">{documentCount} files</span>
          </div>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const submission = row.original;
      return (
        <div className="flex items-center justify-end">
          <button
            onClick={() => {
              // This will be handled by the parent component via event delegation
              const event = new CustomEvent("kyc-review", {
                detail: { submission },
                bubbles: true,
              });
              document.dispatchEvent(event);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all text-sm font-medium"
          >
            <Eye className="h-4 w-4" />
            Review
          </button>
        </div>
      );
    },
  },
];
