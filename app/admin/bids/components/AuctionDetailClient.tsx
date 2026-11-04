"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import {
  ChevronLeft,
  Clock,
  Gavel,
  Trophy,
  Ban,
  CalendarClock,
  Mail,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatPrice, formatCondition, formatDateTime, formatTimeRemaining } from "@/lib/format";
import { terminateAuction, extendAuction } from "../../actions/auctions";
import type { AuctionDetail } from "@/lib/types";

// Format a Date for a native datetime-local input — same helper used by
// EditProductForm.tsx, reproduced locally so this file has no non-action
// dependency on the products admin section.
function formatDateForInput(date: Date | string) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function statusVariant(status: AuctionDetail["status"]) {
  if (status === "CANCELLED") return "sale" as const;
  if (status === "WINNER_DETERMINED") return "success" as const;
  return "default" as const;
}

function TerminateAuctionModal({
  auctionId,
  onClose,
}: {
  auctionId: string;
  onClose: () => void;
}) {
  const router = useRouter();

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-card shadow-overlay max-w-lg w-full p-6">
        <h3 className="text-xl font-bold text-ink mb-2">Terminate Auction</h3>
        <p className="text-mute mb-6 text-sm">
          This ends the auction immediately. No further bids can be placed, and no winner will be
          determined by bid amount. This cannot be undone.
        </p>
        <Formik
          initialValues={{ reason: "" }}
          validationSchema={Yup.object({
            reason: Yup.string().required("A reason is required"),
          })}
          onSubmit={async (values, { setSubmitting }) => {
            const result = await terminateAuction(auctionId, values.reason);
            if (result.success) {
              toast.success("Auction terminated");
              onClose();
              router.refresh();
            } else {
              toast.error(result.error || "Failed to terminate auction");
            }
            setSubmitting(false);
          }}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <div>
                <Label htmlFor="reason" className="mb-2">
                  Reason *
                </Label>
                <Field
                  as={Textarea}
                  id="reason"
                  name="reason"
                  rows={3}
                  placeholder="Why is this auction being terminated?"
                />
                <ErrorMessage
                  name="reason"
                  component="div"
                  className="text-sale text-sm mt-1"
                />
              </div>
              <div className="flex items-center justify-end gap-3">
                <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" variant="destructive" disabled={isSubmitting}>
                  {isSubmitting ? "Terminating..." : "Terminate Auction"}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

function ExtendAuctionModal({
  auctionId,
  currentEndDate,
  onClose,
}: {
  auctionId: string;
  currentEndDate: string;
  onClose: () => void;
}) {
  const router = useRouter();

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-card shadow-overlay max-w-lg w-full p-6">
        <h3 className="text-xl font-bold text-ink mb-2">Extend Auction</h3>
        <p className="text-mute mb-6 text-sm">
          Choose a new end date. Bidders will see the updated countdown immediately.
        </p>
        <Formik
          initialValues={{ endDate: formatDateForInput(currentEndDate) }}
          validationSchema={Yup.object({
            endDate: Yup.string()
              .required("A new end date is required")
              .test("is-future", "New end date must be after the current end date", (value) => {
                if (!value) return false;
                return new Date(value).getTime() > new Date(currentEndDate).getTime();
              }),
          })}
          onSubmit={async (values, { setSubmitting }) => {
            const result = await extendAuction(auctionId, new Date(values.endDate).toISOString());
            if (result.success) {
              toast.success("Auction extended");
              onClose();
              router.refresh();
            } else {
              toast.error(result.error || "Failed to extend auction");
            }
            setSubmitting(false);
          }}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <div>
                <Label htmlFor="endDate" className="mb-2">
                  New End Date *
                </Label>
                <Field as={Input} type="datetime-local" id="endDate" name="endDate" />
                <ErrorMessage
                  name="endDate"
                  component="div"
                  className="text-sale text-sm mt-1"
                />
              </div>
              <div className="flex items-center justify-end gap-3">
                <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Extend Auction"}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default function AuctionDetailClient({
  auction,
  isMock,
}: {
  auction: AuctionDetail;
  isMock: boolean;
}) {
  const [showTerminate, setShowTerminate] = useState(false);
  const [showExtend, setShowExtend] = useState(false);

  const isActive = auction.status === "ACTIVE";

  // Lowest-unique-bid: among bids with a bidAmount nobody else matched, the
  // lowest one is the current leader.
  const biddersWithLeader = useMemo(() => {
    const counts = new Map<number, number>();
    for (const b of auction.bidders) {
      counts.set(b.bidAmount, (counts.get(b.bidAmount) || 0) + 1);
    }
    const uniqueAmounts = auction.bidders
      .filter((b) => counts.get(b.bidAmount) === 1)
      .map((b) => b.bidAmount);
    const leadingAmount = uniqueAmounts.length > 0 ? Math.min(...uniqueAmounts) : null;

    return [...auction.bidders]
      .sort((a, b) => a.bidAmount - b.bidAmount)
      .map((b) => ({
        ...b,
        isUnique: counts.get(b.bidAmount) === 1,
        isLeading: leadingAmount !== null && b.bidAmount === leadingAmount,
      }));
  }, [auction.bidders]);

  return (
    <div className="space-y-8">
      <Link
        href="/admin/bids"
        className="inline-flex items-center gap-1.5 text-sm text-mute hover:text-ink"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Bids
      </Link>

      {isMock && (
        <div className="bg-soft-cloud px-4 py-3 text-sm text-mute">
          Showing sample data — live auction data will appear once the auction API is connected.
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-ink">{auction.product.title}</h1>
            <Badge variant={statusVariant(auction.status)}>{auction.status.replace("_", " ")}</Badge>
          </div>
          <p className="text-sm text-mute">Auction ID: {auction.id}</p>
        </div>
        {isActive && (
          <div className="flex items-center gap-2 shrink-0">
            <Button variant="outline" size="sm" onClick={() => setShowExtend(true)}>
              <CalendarClock className="h-4 w-4" />
              Extend
            </Button>
            <Button variant="destructive" size="sm" onClick={() => setShowTerminate(true)}>
              <Ban className="h-4 w-4" />
              Terminate
            </Button>
          </div>
        )}
      </div>

      {/* Product summary — inline, no redirect to the public product page */}
      <div className="flex flex-col sm:flex-row gap-5">
        <div className="relative w-full sm:w-40 h-40 bg-soft-cloud shrink-0">
          {auction.product.images[0] && (
            <Image
              src={auction.product.images[0]}
              alt={auction.product.title}
              fill
              className="object-cover"
            />
          )}
        </div>
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-center gap-2">
            <Badge>{formatCondition(auction.product.condition)}</Badge>
            <span className="text-sm text-mute">Sold by {auction.product.sellerName}</span>
          </div>
          <p className="text-sm text-mute">{auction.product.description}</p>
        </div>
      </div>

      {/* Auction stats — flat strip, single divider above and below */}
      <div className="flex flex-wrap items-center gap-x-10 gap-y-4 py-5  ">
        <div>
          <p className="text-xs text-mute uppercase tracking-wider mb-1">Start Date</p>
          <p className="text-sm font-medium text-ink">{formatDateTime(auction.startDate)}</p>
        </div>
        <div>
          <p className="text-xs text-mute uppercase tracking-wider mb-1">End Date</p>
          <p className="text-sm font-medium text-ink">{formatDateTime(auction.endDate)}</p>
        </div>
        {isActive && (
          <div>
            <p className="text-xs text-mute uppercase tracking-wider mb-1">Time Remaining</p>
            <p className="text-sm font-medium text-ink flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {formatTimeRemaining(new Date(auction.endDate))}
            </p>
          </div>
        )}
        <div>
          <p className="text-xs text-mute uppercase tracking-wider mb-1">Entry Fee</p>
          <p className="text-sm font-medium text-ink">{formatPrice(auction.entryFee)}</p>
        </div>
        <div>
          <p className="text-xs text-mute uppercase tracking-wider mb-1">Prize Value</p>
          <p className="text-sm font-medium text-ink">{formatPrice(auction.prizeValue)}</p>
        </div>
        <div>
          <p className="text-xs text-mute uppercase tracking-wider mb-1">Total Bids</p>
          <p className="text-sm font-medium text-ink flex items-center gap-1.5">
            <Gavel className="h-3.5 w-3.5" />
            {auction.totalBidsCount}
          </p>
        </div>
      </div>

      {/* Bidders */}
      <div>
        <h2 className="text-lg font-semibold text-ink mb-4">
          Current Bidders ({biddersWithLeader.length})
        </h2>

        {biddersWithLeader.length === 0 ? (
          <div className="bg-soft-cloud p-8 text-center">
            <p className="text-mute">No bids have been placed on this auction yet.</p>
          </div>
        ) : (
          <div className="   ">
            {biddersWithLeader.map((bidder) => (
              <div
                key={bidder.id}
                className={`flex items-center justify-between gap-4 px-4 py-3.5 ${
                  bidder.isLeading ? "bg-success/10" : ""
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ink truncate">{bidder.bidderName}</p>
                    {bidder.bidderEmail && (
                      <p className="text-xs text-mute flex items-center gap-1 truncate">
                        <Mail className="h-3 w-3 shrink-0" />
                        {bidder.bidderEmail}
                      </p>
                    )}
                  </div>
                  {bidder.isLeading && (
                    <Badge variant="success" className="shrink-0">
                      <Trophy className="h-3 w-3" />
                      Leading
                    </Badge>
                  )}
                  {!bidder.isLeading && bidder.isUnique && (
                    <Badge className="shrink-0">Unique</Badge>
                  )}
                </div>
                <div className="flex items-center gap-6 shrink-0">
                  <span className="text-xs text-mute hidden sm:inline">
                    {formatDateTime(bidder.placedAt)}
                  </span>
                  <span className="text-base font-semibold text-ink w-20 text-right">
                    {formatPrice(bidder.bidAmount)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showTerminate && (
        <TerminateAuctionModal auctionId={auction.id} onClose={() => setShowTerminate(false)} />
      )}
      {showExtend && (
        <ExtendAuctionModal
          auctionId={auction.id}
          currentEndDate={auction.endDate}
          onClose={() => setShowExtend(false)}
        />
      )}
    </div>
  );
}
