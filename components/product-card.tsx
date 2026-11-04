import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/types";
import { formatPrice, formatTimeRemaining, formatCondition } from "@/lib/format";
import { Clock, Gavel } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: Product;
}

// product-card — full-bleed photo on soft-cloud, zero radius, zero shadow.
// The photograph is the card; metadata sits directly below it.
export default function ProductCard({ product }: ProductCardProps) {
  let product_endDate = new Date(product.endDate);
  const timeRemaining = formatTimeRemaining(product_endDate);
  const auctionStatus = product.auctions?.[0]?.status;
  const isEnded =
    product_endDate.getTime() - new Date().getTime() <= 0 ||
    auctionStatus === "ENDED" ||
    auctionStatus === "WINNER_DETERMINED";
  const isEndingSoon =
    !isEnded && product_endDate.getTime() - new Date().getTime() < 24 * 60 * 60 * 1000;

  const bidsCount = product.auctions?.length > 0 ? product.auctions[0].totalBidsCount : 0;
  const isHighDemand = bidsCount > 10;
  const badgeLabel = isEnded
    ? "Ended"
    : isEndingSoon
    ? "Ending Soon"
    : isHighDemand
    ? "High Demand"
    : formatCondition(product.condition);

  const imageSrc =
    Array.isArray(product.images) &&
      product.images.length > 0 &&
      typeof product.images[0] === "string" &&
      product.images[0].trim() !== ""
      ? product.images[0]
      : "/placeholder.png";
  return (
    <Link href={`/product/${product.id}`} className="group block">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-soft-cloud">
        <Image
          src={imageSrc}
          alt={product.title}
          fill
          className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
        />
        <div className="absolute top-3 left-3">
          <Badge variant={isEndingSoon ? "inverse" : "default"} className={isEndingSoon ? "bg-sale" : undefined}>
            {badgeLabel}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="pt-3 space-y-1.5">
        <h3 className="font-medium text-sm text-ink line-clamp-2 group-hover:text-primary transition-colors">
          {product.title}
        </h3>
        <p className="text-xs text-mute">
          {product.sellerName}
        </p>
        <div className="flex items-center justify-between pt-1">
          <span className="text-base font-semibold text-ink">
            {formatPrice(product.retailValue)}
          </span>
          <div className="flex items-center gap-3 text-xs text-mute">
            <span className="inline-flex items-center gap-1">
              <Gavel className="h-3 w-3" />
              {bidsCount}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {timeRemaining}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
