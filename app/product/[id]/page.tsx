import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { fetchProductById, searchProducts } from "@/lib/api/products";
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
import { ProductDetailSkeleton, ProductsGridSkeleton } from "@/components/loading-skeleton";
import { Clock, Package, Shield, Truck, ChevronRight } from "lucide-react";
import { ProductCondition } from "@/lib/types";

interface ProductPageProps {
  params: {
    id: string;
  };
}

// Server component for related products
async function RelatedProducts({ categoryId, currentProductId }: { categoryId: string; currentProductId: string }) {
  const { data } = await searchProducts({
    categoryId,
    limit: 4,
  });

  const relatedProducts = data.filter(p => p.id !== currentProductId).slice(0, 4);

  if (relatedProducts.length === 0) return null;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Similar Auctions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts.map((relatedProduct) => (
          <ProductCard key={relatedProduct.id} product={relatedProduct} />
        ))}
      </div>
    </div>
  );
}

// Helper function to generate dates
const daysFromNow = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};

const hoursFromNow = (hours: number) => {
  const date = new Date();
  date.setHours(date.getHours() + hours);
  return date;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const product_id = await params.id;
  
  // const product = await fetchProductById(params.id);


  let product={
      id: "6",
      title: "Apple Watch Ultra 2",
      description: "Rugged and capable Apple Watch Ultra 2 with 49mm titanium case. GPS + Cellular with Ocean Band. Perfect for outdoor adventures.",
      categoryId: "5",
      condition: "NEW" as ProductCondition,
      images: [
        "/placeholder.jpg",
        "/placeholder.jpg",
      ],
      startingPrice: 649,
      currentBid: 749,
      bidsCount: 12,
      buyNowPrice: 849,

      // Bidding system fields
      biddingFee: 10,
      originalPrice: 849,
      totalBids: 12,
      totalRevenue: 120,
      status: "ACTIVE" as const,

      endDate: hoursFromNow(18),
      startDate: daysFromNow(-1),
      sellerId: "seller2",
      sellerName: "Apple Certified Reseller",
      sellerRating: 4.9,
      specifications: {
        "Case Size": "49mm",
        Material: "Titanium",
        Band: "Ocean Band",
        GPS: "Yes",
        Cellular: "Yes",
      },
      isActive: true,
      createdAt: daysFromNow(-1),
      updatedAt: new Date(),
    }

  if (!product) {
    notFound();
  }

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
            productId={product.id}
            productTitle={product.title}
            biddingFee={product.biddingFee || 5}
            totalBids={product.totalBids || product.bidsCount || 0}
            productStatus={product.status || "ACTIVE"}
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
      <Suspense fallback={<ProductsGridSkeleton count={4} />}>
        <RelatedProducts categoryId={product.categoryId} currentProductId={product.id} />
      </Suspense>
    </div>
  );
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ProductPageProps) {
  const product = await fetchProductById(params.id);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  return {
    title: `${product.title} - BidMarket`,
    description: product.description,
  };
}
