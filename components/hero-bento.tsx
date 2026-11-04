"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/types";
import { formatPrice, formatTimeRemaining } from "@/lib/format";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";

interface HeroBentoProps {
  products: Product[];
  stats?: {
    liveAuctions: number;
    totalBids: number;
    winnersToday: number;
  };
}

// campaign-tile — Nike's signature editorial unit: full-bleed photography,
// an uppercase display headline burned into the lower-left third, one pill CTA.
export default function HeroBento({ products, stats }: HeroBentoProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const displayStats = stats || {
    liveAuctions: 156,
    totalBids: 2847,
    winnersToday: 23,
  };

  useEffect(() => {
    if (products.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % products.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [products.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % products.length);
  };

  if (products.length === 0) {
    return null;
  }

  const currentProduct = products[currentIndex];
  const otherProducts = products.filter((_, i) => i !== currentIndex).slice(0, 4);

  return (
    <div className="space-y-5">
      {/* Main campaign tile */}
      <div className="relative h-[460px] sm:h-[520px] lg:h-[600px] overflow-hidden group">
        <div className="absolute inset-0">
          <Image
            src={currentProduct.images[0]}
            alt={currentProduct.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/20 to-transparent" />
        </div>

        {/* Live indicator — a quiet trust signal, not a hero metric */}
        <div className="absolute top-5 right-5 sm:top-8 sm:right-8 inline-flex items-center gap-2 bg-background/90 px-3 py-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-success opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
          </span>
          <span className="text-xs font-medium text-ink">
            {displayStats.liveAuctions} live auctions
          </span>
        </div>

        {/* Content burned into the lower-left third */}
        <div className="relative h-full flex items-end p-6 sm:p-8 lg:p-10">
          <div className="max-w-xl space-y-4">
            <div className="inline-flex items-center gap-2 text-background">
              <Clock className="h-3.5 w-3.5" />
              <span className="text-sm font-medium">
                Ends in {formatTimeRemaining(currentProduct.endDate)}
              </span>
            </div>

            <h1 className="text-display-campaign text-background text-[2.75rem] sm:text-6xl lg:text-7xl">
              {currentProduct.title}
            </h1>

            <div className="flex items-center gap-8">
              <div>
                <p className="text-xs text-background/70 mb-0.5">Entry Fee</p>
                <p className="text-lg font-semibold text-background">
                  {formatPrice(currentProduct.entryFee)}
                </p>
              </div>
              <div>
                <p className="text-xs text-background/70 mb-0.5">Prize Value</p>
                <p className="text-lg font-semibold text-background">
                  {formatPrice(currentProduct.retailValue)}
                </p>
              </div>
            </div>

            <Link
              href={`/product/${currentProduct.id}`}
              className="inline-flex items-center justify-center h-12 px-8 bg-primary text-primary-foreground rounded-full text-base font-medium hover:bg-primary/90 active:scale-95 transition-[transform,background-color]"
            >
              Place Your Bid
            </Link>
          </div>
        </div>

        {/* Navigation arrows */}
        {products.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/90 hover:bg-background text-ink size-10 rounded-full flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/90 hover:bg-background text-ink size-10 rounded-full flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
              aria-label="Next slide"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <div className="absolute bottom-6 right-6 sm:right-8 flex gap-1.5">
              {products.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-1.5 rounded-full transition-all ${
                    index === currentIndex
                      ? "bg-background w-6"
                      : "bg-background/40 w-1.5 hover:bg-background/60"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Quick-view rail — flat tiles on soft-cloud, same chrome as the listing grid */}
      {otherProducts.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-hairline">
          {otherProducts.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.id}`}
              className="group/card bg-background"
            >
              <div className="relative aspect-square bg-soft-cloud overflow-hidden">
                <Image
                  src={product.images[0]}
                  alt={product.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-3 space-y-1">
                <h3 className="text-sm font-medium text-ink truncate group-hover/card:text-primary transition-colors">
                  {product.title}
                </h3>
                <p className="text-sm font-semibold text-ink">
                  {formatPrice(product.entryFee)} entry
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

// Skeleton for loading state
export function HeroBentoSkeleton() {
  return (
    <div className="space-y-5">
      <div className="h-[460px] sm:h-[520px] lg:h-[600px] bg-soft-cloud animate-pulse" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-hairline">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-background">
            <div className="aspect-square bg-soft-cloud animate-pulse" />
            <div className="p-3 space-y-2">
              <div className="h-3 w-3/4 bg-soft-cloud rounded animate-pulse" />
              <div className="h-4 w-1/2 bg-soft-cloud rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
