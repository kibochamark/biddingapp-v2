import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/types";
import { formatPrice, formatTimeRemaining, formatCondition, getConditionColor } from "@/lib/format";
import { Clock, Gavel } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  console.log(product,"prod")
  // convert the date strings to Date objects
  let product_endDate= new Date(product.endDate);
  const timeRemaining = formatTimeRemaining(product_endDate);
  const isEndingSoon = product_endDate.getTime() - new Date().getTime() < 24 * 60 * 60 * 1000;

  // Single badge — priority: ENDING_SOON > HIGH_DEMAND > condition
  const bidsCount = product.auctions?.length > 0 ? product.auctions[0].totalBidsCount : 0;
  const isHighDemand = bidsCount > 10;
  const badgeLabel = isEndingSoon
    ? "Ending Soon"
    : isHighDemand
    ? "High Demand"
    : formatCondition(product.condition);
  const badgeClass = isEndingSoon
    ? "bg-destructive text-white"
    : isHighDemand
    ? "bg-purple-500 text-white"
    : getConditionColor(product.condition);

  console.log("Rendering ProductCard for:", product.images[0]);
  const imageSrc =
    Array.isArray(product.images) &&
      product.images.length > 0 &&
      typeof product.images[0] === "string" &&
      product.images[0].trim() !== ""
      ? product.images[0]
      : "/placeholder.png";
  return (
    <Link href={`/product/${product.id}`} className="group">
      <div className="glass-card rounded-lg overflow-hidden hover:shadow-2xl hover:border-primary/30 transition-all duration-300">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={imageSrc}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
          />
          {/* Single badge — priority: Ending Soon > High Demand > Condition */}
          <div className="absolute top-2 left-2">
            <span className={`px-2 py-1 rounded-md text-xs font-medium ${badgeClass}`}>
              {badgeLabel}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Title */}
          <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
            {product.title}
          </h3>

          {/* Current Bid */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Current bid</span>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Gavel className="h-3 w-3" />
                <span className="text-xs">{product.auctions?.length > 0 && product.auctions[0].totalBidsCount || 0} bids</span>
              </div>
            </div>
            <div className="text-xl font-bold">
              {formatPrice(product.retailValue)}
            </div>
          </div>

          {/* Time Remaining */}
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span className="text-sm">{timeRemaining}</span>
          </div>

          {/* Seller */}
          <div className="pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground">
              Seller: <span className="font-medium text-foreground">{product.sellerName}</span>
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
