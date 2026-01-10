"use client";

import { Suspense } from "react";
import { formatPrice, formatTimeRemaining, formatCondition, getConditionColor, formatDateTime } from "@/lib/format";
import { Clock, Package, Shield, Truck, Star, TrendingUp, Users } from "lucide-react";
import ImageGallery from "@/components/image-gallery";
import BidFormNew from "@/components/bid-form";
import { Product } from "@/lib/types";

interface ProductDetailClientProps {
  product: Product;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
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
                <button className="pb-3 border-b-2 border-primary text-primary font-medium">
                  Description
                </button>
                <button className="pb-3 border-b-2 border-transparent text-muted-foreground hover:text-foreground font-medium">
                  Specifications
                </button>
                <button className="pb-3 border-b-2 border-transparent text-muted-foreground hover:text-foreground font-medium">
                  Shipping
                </button>
              </nav>
            </div>

            {/* Description Tab Content */}
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
                    <p className="text-xs text-muted-foreground">Free expedited shipping on orders $500+</p>
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

            {/* Specifications Table */}
            <div className="mt-8">
              <h3 className="text-lg font-bold mb-4">Technical Specifications</h3>
              <div className="glass-card rounded-lg overflow-hidden">
                <div className="divide-y divide-border">
                  {Object.entries(product.specifications).map(([key, value], index) => (
                    <div
                      key={key}
                      className={`grid grid-cols-2 gap-4 p-4 ${
                        index % 2 === 0 ? 'bg-muted/20' : ''
                      }`}
                    >
                      <dt className="text-sm font-medium text-muted-foreground">{key}</dt>
                      <dd className="text-sm font-semibold text-foreground">{value}</dd>
                    </div>
                  ))}
                </div>
              </div>
            </div>
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
                {product.endDate.getTime() - new Date().getTime() <
                  24 * 60 * 60 * 1000 && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-linear-to-r from-red-500 to-orange-500 text-white animate-pulse">
                    Ending Soon
                  </span>
                )}
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold mb-2 leading-tight">{product.title}</h1>
            </div>

            {/* Time Remaining Card */}
            <div className="p-4 bg-linear-to-br from-primary/10 to-orange-600/10 border-2 border-primary/20 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">Time Remaining</span>
              </div>
              <p className="text-2xl font-bold text-primary">
                {formatTimeRemaining(product.endDate)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Ends {formatDateTime(product.endDate)}
              </p>
            </div>

            {/* Seller Info Card */}
            <div className="glass-card p-4 rounded-lg border border-border">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Sold by</p>
                  <p className="font-bold text-lg">{product.sellerName}</p>
                  {product.sellerRating && (
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-semibold">{product.sellerRating.toFixed(1)}</span>
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
                <p className="text-lg font-bold">{product.totalBids}</p>
              </div>
              <div className="p-3 glass-card rounded-lg text-center border border-border">
                <TrendingUp className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Original Price</p>
                <p className="text-lg font-bold">{formatPrice(product.originalPrice || 0)}</p>
              </div>
            </div>

            {/* Bid Form - This needs Redux */}
            <BidFormNew
              productId={product.id}
              productTitle={product.title}
              biddingFee={product.biddingFee || 5}
              totalBids={product.totalBids || product.bidsCount || 0}
              productStatus={product.status || "ACTIVE"}
            />
          </div>
        </div>
      </div>
    </>
  );
}
