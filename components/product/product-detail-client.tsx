"use client";

import { useState } from "react";
import {
  formatPrice,
  formatTimeRemaining,
  formatCondition,
  getConditionColor,
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
            <div className="border-b border-border">
              <nav className="flex gap-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`pb-3 text-sm font-semibold border-b-2 transition-colors ${
                      activeTab === tab.key
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground"
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
                <div className="space-y-6">
                  <p className="text-muted-foreground leading-relaxed">
                    {product.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                      <div
                        key={item.title}
                        className="flex items-start gap-3 p-4 rounded-xl bg-muted/40"
                      >
                        <item.icon className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold">{item.title}</p>
                          <p className="text-xs text-muted-foreground">
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
                    <div className="rounded-2xl border border-border overflow-hidden">
                      {Object.entries(product.specifications).map(
                        ([key, value], index) => (
                          <div
                            key={key}
                            className={`flex items-center justify-between px-5 py-3.5 text-sm ${
                              index % 2 === 0 ? "bg-muted/30" : ""
                            } ${
                              index !==
                              Object.keys(product.specifications).length - 1
                                ? "border-b border-border/60"
                                : ""
                            }`}
                          >
                            <span className="text-muted-foreground font-medium capitalize">
                              {key
                                .replace(/([A-Z])/g, " $1")
                                .replace(/_/g, " ")}
                            </span>
                            <span className="font-semibold">
                              {String(value)}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">
                      No specifications available for this product.
                    </p>
                  )}
                </div>
              )}

              {/* Shipping */}
              {activeTab === "shipping" && (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-border divide-y divide-border">
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
                        className="flex items-start gap-3 px-5 py-4"
                      >
                        <item.icon className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold">{item.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-2xl border border-border p-5">
                    <p className="text-sm font-semibold mb-3">
                      Returns & Refunds
                    </p>
                    <ul className="space-y-2 text-xs text-muted-foreground list-disc list-inside">
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
          <div className="sticky top-20 space-y-5">
            {/* Product Info Card */}
            <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getConditionColor(
                    product.condition
                  )}`}
                >
                  {formatCondition(product.condition)}
                </span>
                {!auctionEnded &&
                  !bidended &&
                  new Date(product.endDate).getTime() - Date.now() <
                    24 * 60 * 60 * 1000 && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-destructive text-destructive-foreground animate-pulse">
                      Ending Soon
                    </span>
                  )}
              </div>

              {/* Title */}
              <h1 className="text-2xl lg:text-3xl font-extrabold leading-tight tracking-tight">
                {product.title}
              </h1>

              {/* Retail Value */}
              <div className="flex items-baseline justify-between border-t border-border pt-4">
                <span className="text-sm text-muted-foreground font-medium">
                  Retail Value
                </span>
                <span className="text-xl font-bold">
                  {formatPrice(product.retailValue || 0)}
                </span>
              </div>
            </div>

            {/* Auction Ended Banner */}
            {(auctionEnded || bidended) && (
              <div className="rounded-2xl border border-border bg-muted/40 p-6 text-center space-y-3">
                <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                  <Ban className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="font-bold">Auction Ended</p>
                <p className="text-xs text-muted-foreground">
                  Closed on {formatDateTime(new Date(product.endDate))}
                </p>
              </div>
            )}

            {/* Time Remaining */}
            {!auctionEnded && !bidended && (
              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Time Remaining
                  </span>
                </div>
                <p className="text-2xl font-extrabold text-primary">
                  {formatTimeRemaining(new Date(product.endDate))}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Ends {formatDateTime(new Date(product.endDate))}
                </p>
              </div>
            )}

            {/* Auction Stats — KLM-style data rows with thin separators */}
            <div className="rounded-2xl border border-border overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-border/60">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Total Entries
                </span>
                <span className="text-sm font-bold">
                  {product.auctions?.length > 0
                    ? product.auctions[0].totalBidsCount
                    : 0}
                </span>
              </div>
              <div className="flex items-center justify-between px-5 py-3.5 bg-muted/30 border-b border-border/60">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Original Price
                </span>
                <span className="text-sm font-bold">
                  {formatPrice(product.retailValue || 0)}
                </span>
              </div>
              <div className="flex items-center justify-between px-5 py-3.5">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  Seller
                </span>
                <span className="text-sm font-bold">{product.sellerName}</span>
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
              <div className="rounded-2xl border border-border p-5 text-center">
                <p className="text-sm text-muted-foreground">
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
