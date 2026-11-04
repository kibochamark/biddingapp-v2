import { redirect } from "next/navigation";
import { fetchAuctionDetail } from "../../actions/auctions";
import AuctionDetailClient from "../components/AuctionDetailClient";
import type { AuctionDetail } from "@/lib/types";

// Sample data shown until the real auction-detail endpoint ships — see the
// doc comment on fetchAuctionDetail in app/admin/actions/auctions.ts. Swap
// nothing in this page when the API lands; the fallback below just stops
// being reached once fetchAuctionDetail starts returning success: true.
function buildMockAuction(auctionId: string): AuctionDetail {
  const now = Date.now();
  return {
    id: auctionId,
    status: "ACTIVE",
    startDate: new Date(now - 1000 * 60 * 60 * 24 * 3).toISOString(),
    endDate: new Date(now + 1000 * 60 * 60 * 20).toISOString(),
    entryFee: 5,
    prizeValue: 999,
    totalBidsCount: 7,
    product: {
      id: "prod_sample",
      title: "iPhone 15 Pro Max — 256GB, Natural Titanium",
      description:
        "Unlocked, factory-sealed. Includes original box and accessories.",
      images: ["/placeholder.png"],
      condition: "NEW",
      sellerName: "BidMarket Direct",
      retailValue: 999,
    },
    bidders: [
      { id: "b1", bidderId: "u1", bidderName: "John Doe", bidderEmail: "john@example.com", bidAmount: 5.0, isUnique: false, paymentStatus: "PAID", placedAt: new Date(now - 1000 * 60 * 60 * 5).toISOString() },
      { id: "b2", bidderId: "u2", bidderName: "Jane Smith", bidderEmail: "jane@example.com", bidAmount: 5.0, isUnique: false, paymentStatus: "PAID", placedAt: new Date(now - 1000 * 60 * 60 * 4).toISOString() },
      { id: "b3", bidderId: "u3", bidderName: "Bob Wilson", bidderEmail: "bob@example.com", bidAmount: 3.47, isUnique: true, paymentStatus: "PAID", placedAt: new Date(now - 1000 * 60 * 60 * 3).toISOString() },
      { id: "b4", bidderId: "u4", bidderName: "Alice Chen", bidderEmail: "alice@example.com", bidAmount: 8.12, isUnique: true, paymentStatus: "PAID", placedAt: new Date(now - 1000 * 60 * 60 * 2).toISOString() },
      { id: "b5", bidderId: "u5", bidderName: "Marcus Lee", bidderEmail: "marcus@example.com", bidAmount: 2.0, isUnique: false, paymentStatus: "PENDING", placedAt: new Date(now - 1000 * 60 * 60 * 1.5).toISOString() },
      { id: "b6", bidderId: "u6", bidderName: "Priya Patel", bidderEmail: "priya@example.com", bidAmount: 2.0, isUnique: false, paymentStatus: "PAID", placedAt: new Date(now - 1000 * 60 * 60).toISOString() },
      { id: "b7", bidderId: "u7", bidderName: "Sam Okafor", bidderEmail: "sam@example.com", bidAmount: 1.25, isUnique: true, paymentStatus: "PAID", placedAt: new Date(now - 1000 * 60 * 30).toISOString() },
    ],
  };
}

export default async function AuctionDetailPage({
  params,
}: {
  params: Promise<{ auctionId: string }>;
}) {
  const { auctionId } = await params;
  const result = await fetchAuctionDetail(auctionId);

  if (!result.success && result.error?.startsWith("Unauthorized")) {
    redirect("/admin");
  }

  const auction = result.success && result.data ? result.data : buildMockAuction(auctionId);
  const isMock = !(result.success && result.data);

  return <AuctionDetailClient auction={auction} isMock={isMock} />;
}

export const metadata = {
  title: "Auction Detail - Admin Portal",
  description: "View and manage a single auction",
};
