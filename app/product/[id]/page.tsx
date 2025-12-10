import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductById, mockProducts } from "@/lib/mock-data";
import {
  formatPrice,
  formatTimeRemaining,
  formatCondition,
  getConditionColor,
  formatDateTime,
} from "@/lib/format";
import ImageGallery from "@/components/image-gallery";
import BidForm from "@/components/bid-form";
import ProductCard from "@/components/product-card";
import { Clock, Package, Shield, Truck, ChevronRight } from "lucide-react";

interface ProductPageProps {
  params: {
    id: string;
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = getProductById(params.id);

  if (!product) {
    notFound();
  }

  const minBid = (product.currentBid || product.startingPrice) + 5;
  const relatedProducts = mockProducts
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id && p.isActive)
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/catalog" className="hover:text-foreground">
          Catalog
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">{product.title}</span>
      </nav>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Left: Images */}
        <div>
          <ImageGallery images={product.images} title={product.title} />
        </div>

        {/* Right: Product Info & Bid Form */}
        <div className="space-y-6">
          {/* Title & Condition */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span
                className={`px-3 py-1 rounded-md text-xs font-medium ${getConditionColor(
                  product.condition
                )}`}
              >
                {formatCondition(product.condition)}
              </span>
              {product.endDate.getTime() - new Date().getTime() <
                24 * 60 * 60 * 1000 && (
                <span className="px-3 py-1 rounded-md text-xs font-medium bg-destructive text-white">
                  Ending Soon
                </span>
              )}
            </div>
            <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
            <p className="text-muted-foreground">{product.description}</p>
          </div>

          {/* Time Remaining */}
          <div className="flex items-center gap-2 text-lg">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium">
              {formatTimeRemaining(product.endDate)} remaining
            </span>
          </div>

          {/* Seller Info */}
          <div className="p-4 glass-card rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Sold by</p>
            <p className="font-semibold text-lg">{product.sellerName}</p>
            {product.sellerRating && (
              <p className="text-sm text-muted-foreground mt-1">
                ⭐ {product.sellerRating.toFixed(1)} seller rating
              </p>
            )}
          </div>

          {/* Bid Form */}
          <BidForm
            currentBid={product.currentBid || product.startingPrice}
            minBid={minBid}
            buyNowPrice={product.buyNowPrice}
            productTitle={product.title}
          />

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
            <div className="text-center">
              <Shield className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Buyer Protection</p>
            </div>
            <div className="text-center">
              <Truck className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Fast Shipping</p>
            </div>
            <div className="text-center">
              <Package className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Quality Checked</p>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Specifications</h2>
        <div className="glass-card rounded-lg p-6">
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(product.specifications).map(([key, value]) => (
              <div key={key} className="border-b border-border pb-4 last:border-b-0">
                <dt className="text-sm text-muted-foreground mb-1">{key}</dt>
                <dd className="font-medium">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Auction Details */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Auction Details</h2>
        <div className="glass-card rounded-lg p-6 space-y-4">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Starting Price</span>
            <span className="font-semibold">{formatPrice(product.startingPrice)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Current Bid</span>
            <span className="font-semibold">
              {formatPrice(product.currentBid || product.startingPrice)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Bids</span>
            <span className="font-semibold">{product.bidsCount || 0}</span>
          </div>
          {product.buyNowPrice && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Buy Now Price</span>
              <span className="font-semibold">{formatPrice(product.buyNowPrice)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-muted-foreground">Auction Ends</span>
            <span className="font-semibold">{formatDateTime(product.endDate)}</span>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Similar Auctions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
