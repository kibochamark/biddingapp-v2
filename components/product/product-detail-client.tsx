"use client";

import { useState } from "react";
import { formatPrice, formatTimeRemaining, formatCondition, getConditionColor, formatDateTime } from "@/lib/format";
import { Clock, Package, Shield, Truck, Star, TrendingUp, Users, Ban } from "lucide-react";
import ImageGallery from "@/components/image-gallery";
import BidFormNew from "@/components/bid-form";
import { Product } from "@/lib/types";

interface ProductDetailClientProps {
  product: Product;
}

type Tab = "description" | "specifications" | "shipping";

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [activeTab, setActiveTab] = useState<Tab>("description");

  const bidended = product.auctions?.[0]?.status === "ENDED" || product.auctions?.[0]?.status === "WINNER_DETERMINED" || false;
  const auctionEnded = new Date(product.endDate).getTime() < Date.now();

  const tabs: { key: Tab; label: string }[] = [
    { key: "description", label: "Description" },
    { key: "specifications", label: "Specifications" },
    { key: "shipping", label: "Shipping" },
  ];

  return (
    <>
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Left: Images - Takes 2 columns */}
        <div className="lg:col-span-2">
          <ImageGallery images={product.images} title={product.title} />

          {/* Tabs Section Below Images */}
          <div className="mt-8">
            <div className="border-b border-border mb-6">
              <nav className="flex gap-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`pb-3 border-b-2 font-medium transition-colors ${
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

            {/* Description Tab */}
            {activeTab === "description" && (
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed">
                  {product.description}
                </p>

                {/* Features List */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                    <Shield className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-sm">Buyer Protection</h4>
                      <p className="text-xs text-muted-foreground">Full refund if item not as described</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                    <Truck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-sm">Fast Shipping</h4>
                      <p className="text-xs text-muted-foreground">Free expedited shipping on orders over {formatPrice(500)}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                    <Package className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-sm">Quality Checked</h4>
                      <p className="text-xs text-muted-foreground">Every item verified before shipping</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                    <Star className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-sm">Warranty Included</h4>
                      <p className="text-xs text-muted-foreground">90-day warranty on all items</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Specifications Tab */}
            {activeTab === "specifications" && (
              <div>
                {product.specifications && Object.keys(product.specifications).length > 0 ? (
                  <div className="glass-card rounded-lg overflow-hidden">
                    <div className="divide-y divide-border">
                      {Object.entries(product.specifications).map(([key, value], index) => (
                        <div
                          key={key}
                          className={`grid grid-cols-2 gap-4 p-4 ${
                            index % 2 === 0 ? "bg-muted/20" : ""
                          }`}
                        >
                          <dt className="text-sm font-medium text-muted-foreground capitalize">
                            {key.replace(/([A-Z])/g, " $1").replace(/_/g, " ")}
                          </dt>
                          <dd className="text-sm font-semibold text-foreground">{String(value)}</dd>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    No specifications available for this product.
                  </p>
                )}
              </div>
            )}

            {/* Shipping Tab */}
            {activeTab === "shipping" && (
              <div className="space-y-6">
                <div className="glass-card rounded-lg p-5 border border-border space-y-4">
                  <div className="flex items-start gap-3">
                    <Truck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-sm">Standard Shipping</h4>
                      <p className="text-xs text-muted-foreground">5-7 business days. Free on orders over {formatPrice(500)}.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Package className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-sm">Express Shipping</h4>
                      <p className="text-xs text-muted-foreground">2-3 business days. Available at checkout.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-sm">Insured & Tracked</h4>
                      <p className="text-xs text-muted-foreground">All shipments are fully insured and include tracking.</p>
                    </div>
                  </div>
                </div>

                <div className="glass-card rounded-lg p-5 border border-border">
                  <h4 className="font-semibold text-sm mb-3">Returns & Refunds</h4>
                  <ul className="space-y-2 text-xs text-muted-foreground">
                    <li>30-day return window from delivery date</li>
                    <li>Item must be in original condition with packaging</li>
                    <li>Return shipping is covered for items not as described</li>
                    <li>Refund processed within 5-7 business days of receiving the return</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Product Info & Bid Form - Sticky */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 space-y-4">
            {/* Title & Badges */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getConditionColor(
                    product.condition
                  )}`}
                >
                  {formatCondition(product.condition)}
                </span>
                {!auctionEnded && !bidended && new Date(product.endDate).getTime() - Date.now() < 24 * 60 * 60 * 1000 && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-linear-to-r from-red-500 to-orange-500 text-white animate-pulse">
                    Ending Soon
                  </span>
                )}
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold mb-2 leading-tight">{product.title}</h1>
            </div>

            {/* Auction Ended Banner */}
            {(auctionEnded || bidended) && (
              <div className="p-5 rounded-xl border border-border bg-muted/50 text-center space-y-2">
                <div className="mx-auto w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <Ban className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="font-semibold text-sm">Auction Ended</p>
                <p className="text-xs text-muted-foreground">
                  This auction closed on {formatDateTime(new Date(product.endDate))}
                </p>
              </div>
            )}

            {/* Time Remaining Card — only when auction is live */}
            {!auctionEnded && !bidended && (
              <div className="p-4 bg-linear-to-br from-primary/10 to-orange-600/10 border-2 border-primary/20 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium text-muted-foreground">Time Remaining</span>
                </div>
                <p className="text-2xl font-bold text-primary">
                  {formatTimeRemaining(new Date(product.endDate))}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Ends {formatDateTime(new Date(product.endDate))}
                </p>
              </div>
            )}

            {/* Seller Info Card */}
            <div className="glass-card p-4 rounded-lg border border-border">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Sold by</p>
                  <p className="font-bold text-lg">{product.sellerName}</p>
                  {product.sellerRating && (
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-semibold">{product.sellerRating}</span>
                      <span className="text-xs text-muted-foreground">(124 reviews)</span>
                    </div>
                  )}
                </div>
                <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-full">
                  <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </div>

            {/* Auction Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 glass-card rounded-lg text-center border border-border">
                <Users className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Total Entries</p>
                <p className="text-lg font-bold">{product.auctions?.length > 0 && product.auctions[0].totalBidsCount}</p>
              </div>
              <div className="p-3 glass-card rounded-lg text-center border border-border">
                <TrendingUp className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Original Price</p>
                <p className="text-lg font-bold">{formatPrice(product.retailValue || 0)}</p>
              </div>
            </div>

            {/* Bid Form — only when auction is live */}
            {!auctionEnded && !bidended ? (
              <BidFormNew
                productId={product.id}
                productTitle={product.title}
                biddingFee={product.auctions?.length > 0 && parseFloat(product.auctions[0].entryFee) || 5}
                totalBids={product.auctions?.length > 0 && product.auctions[0].totalBidsCount || 0}
                productStatus={product.status || "ACTIVE"}
                auction_id={product.auctions?.length > 0 ? product.auctions[0].id : ""}
                bidended={bidended}
              />
            ) : (
              <div className="p-4 glass-card rounded-lg border border-border text-center">
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
