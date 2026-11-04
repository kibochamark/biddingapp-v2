"use client";

import { useState } from "react";
import {
  formatPrice,
  formatTimeRemaining,
  formatCondition,
  formatDateTime,
} from "@/lib/format";
import {
  Clock,
  Package,
  Shield,
  Truck,
  Star,
  TrendingUp,
  Users,
  Ban,
} from "lucide-react";
import ImageGallery from "@/components/image-gallery";
import BidFormNew from "@/components/bid-form";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/lib/types";

interface ProductDetailClientProps {
  product: Product;
}

type Tab = "description" | "specifications" | "shipping";

export default function ProductDetailClient({
  product,
}: ProductDetailClientProps) {
  const [activeTab, setActiveTab] = useState<Tab>("description");

  const bidended =
    product.auctions?.[0]?.status === "ENDED" ||
    product.auctions?.[0]?.status === "WINNER_DETERMINED" ||
    false;
  const auctionEnded = new Date(product.endDate).getTime() < Date.now();

  const tabs: { key: Tab; label: string }[] = [
    { key: "description", label: "Description" },
    { key: "specifications", label: "Specifications" },
    { key: "shipping", label: "Shipping" },
  ];

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10 mb-16">
        {/* Left: Images + Tabs */}
        <div className="lg:col-span-2">
          <ImageGallery images={product.images} title={product.title} />

          {/* Tabs */}
          <div className="mt-10">
            <div className="sticky-edge-b">
              <nav className="flex gap-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === tab.key
                        ? "border-ink text-ink"
                        : "border-transparent text-mute hover:text-ink"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="pt-6">
              {/* Description */}
              {activeTab === "description" && (
                <div className="space-y-8">
                  <p className="text-mute leading-relaxed">
                    {product.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                    {[
                      {
                        icon: Shield,
                        title: "Buyer Protection",
                        desc: "Full refund if item not as described",
                      },
                      {
                        icon: Truck,
                        title: "Fast Shipping",
                        desc: `Free expedited shipping on orders over ${formatPrice(500)}`,
                      },
                      {
                        icon: Package,
                        title: "Quality Checked",
                        desc: "Every item verified before shipping",
                      },
                      {
                        icon: Star,
                        title: "Warranty Included",
                        desc: "90-day warranty on all items",
                      },
                    ].map((item) => (
                      <div key={item.title} className="flex items-start gap-3">
                        <item.icon className="h-5 w-5 text-ink shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-ink">{item.title}</p>
                          <p className="text-xs text-mute">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Specifications */}
              {activeTab === "specifications" && (
                <div>
                  {product.specifications &&
                  Object.keys(product.specifications).length > 0 ? (
                    <div className="border-t border-hairline">
                      {Object.entries(product.specifications).map(
                        ([key, value]) => (
                          <div
                            key={key}
                            className="flex items-center justify-between py-3.5 text-sm border-b border-hairline"
                          >
                            <span className="text-mute font-medium capitalize">
                              {key
                                .replace(/([A-Z])/g, " $1")
                                .replace(/_/g, " ")}
                            </span>
                            <span className="font-medium text-ink">
                              {String(value)}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <p className="text-mute text-sm">
                      No specifications available for this product.
                    </p>
                  )}
                </div>
              )}

              {/* Shipping */}
              {activeTab === "shipping" && (
                <div className="space-y-8">
                  <div className="border-t border-hairline">
                    {[
                      {
                        icon: Truck,
                        title: "Standard Shipping",
                        desc: `5-7 business days. Free on orders over ${formatPrice(500)}.`,
                      },
                      {
                        icon: Package,
                        title: "Express Shipping",
                        desc: "2-3 business days. Available at checkout.",
                      },
                      {
                        icon: Shield,
                        title: "Insured & Tracked",
                        desc: "All shipments are fully insured and include tracking.",
                      },
                    ].map((item) => (
                      <div
                        key={item.title}
                        className="flex items-start gap-3 py-4 border-b border-hairline"
                      >
                        <item.icon className="h-5 w-5 text-ink shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-ink">{item.title}</p>
                          <p className="text-xs text-mute">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div>
                    <p className="text-sm font-medium text-ink mb-3">
                      Returns & Refunds
                    </p>
                    <ul className="space-y-2 text-xs text-mute list-disc list-inside">
                      <li>30-day return window from delivery date</li>
                      <li>Item must be in original condition with packaging</li>
                      <li>
                        Return shipping is covered for items not as described
                      </li>
                      <li>
                        Refund processed within 5-7 business days of receiving
                        the return
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 space-y-6">
            {/* Product Info */}
            <div className="space-y-4 pb-6 border-b border-hairline">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <Badge>{formatCondition(product.condition)}</Badge>
                {!auctionEnded &&
                  !bidended &&
                  new Date(product.endDate).getTime() - Date.now() <
                    24 * 60 * 60 * 1000 && (
                    <Badge variant="inverse" className="bg-sale">
                      Ending Soon
                    </Badge>
                  )}
              </div>

              {/* Title */}
              <h1 className="text-2xl lg:text-3xl font-medium leading-tight tracking-tight text-ink">
                {product.title}
              </h1>

              {/* Retail Value */}
              <div className="flex items-baseline justify-between pt-2">
                <span className="text-sm text-mute font-medium">
                  Retail Value
                </span>
                <span className="text-xl font-semibold text-ink">
                  {formatPrice(product.retailValue || 0)}
                </span>
              </div>
            </div>

            {/* Auction Ended Banner */}
            {(auctionEnded || bidended) && (
              <div className="bg-soft-cloud p-6 text-center space-y-3">
                <div className="mx-auto w-12 h-12 rounded-full bg-background flex items-center justify-center">
                  <Ban className="h-6 w-6 text-mute" />
                </div>
                <p className="font-medium text-ink">Auction Ended</p>
                <p className="text-xs text-mute">
                  Closed on {formatDateTime(new Date(product.endDate))}
                </p>
              </div>
            )}

            {/* Time Remaining */}
            {!auctionEnded && !bidended && (
              <div className="pb-6 border-b border-hairline">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-ink" />
                  <span className="text-xs font-medium text-mute uppercase tracking-wider">
                    Time Remaining
                  </span>
                </div>
                <p className="text-2xl font-semibold text-ink">
                  {formatTimeRemaining(new Date(product.endDate))}
                </p>
                <p className="text-xs text-mute mt-1">
                  Ends {formatDateTime(new Date(product.endDate))}
                </p>
              </div>
            )}

            {/* Auction Stats */}
            <div className="border-t border-hairline">
              <div className="flex items-center justify-between py-3.5 border-b border-hairline">
                <span className="text-sm text-mute flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Total Entries
                </span>
                <span className="text-sm font-medium text-ink">
                  {product.auctions?.length > 0
                    ? product.auctions[0].totalBidsCount
                    : 0}
                </span>
              </div>
              <div className="flex items-center justify-between py-3.5 border-b border-hairline">
                <span className="text-sm text-mute flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Original Price
                </span>
                <span className="text-sm font-medium text-ink">
                  {formatPrice(product.retailValue || 0)}
                </span>
              </div>
              <div className="flex items-center justify-between py-3.5">
                <span className="text-sm text-mute flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  Seller
                </span>
                <span className="text-sm font-medium text-ink">{product.sellerName}</span>
              </div>
            </div>

            {/* Bid Form or Ended Message */}
            {!auctionEnded && !bidended ? (
              <BidFormNew
                productId={product.id}
                productTitle={product.title}
                biddingFee={
                  (product.auctions?.length > 0 &&
                    parseFloat(product.auctions[0].entryFee)) ||
                  5
                }
                totalBids={
                  (product.auctions?.length > 0 &&
                    product.auctions[0].totalBidsCount) ||
                  0
                }
                productStatus={product.status || "ACTIVE"}
                auction_id={
                  product.auctions?.length > 0 ? product.auctions[0].id : ""
                }
                bidended={bidended}
              />
            ) : (
              <div className="bg-soft-cloud p-5 text-center">
                <p className="text-sm text-mute">
                  Bidding is no longer available for this auction.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
