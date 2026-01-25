"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/types";
import { formatPrice, formatTimeRemaining } from "@/lib/format";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Gavel,
  Zap,
  TrendingUp,
  Trophy,
  ArrowRight,
  Sparkles,
} from "lucide-react";

interface HeroBentoProps {
  products: Product[];
  stats?: {
    liveAuctions: number;
    totalBids: number;
    winnersToday: number;
  };
}

export default function HeroBento({ products, stats }: HeroBentoProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Default stats if not provided
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4">
      {/* Main Hero Carousel - Large Card */}
      <div className="lg:col-span-8 lg:row-span-2 relative h-[400px] sm:h-[450px] lg:h-[500px] rounded-2xl overflow-hidden group">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={currentProduct.images[0]}
            alt={currentProduct.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/50 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative h-full flex items-center p-6 sm:p-8 lg:p-10">
          <div className="max-w-lg space-y-4 sm:space-y-5">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-destructive/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-full">
              <Clock className="h-3.5 w-3.5" />
              <span className="text-xs sm:text-sm font-medium">
                Ends in {formatTimeRemaining(currentProduct.endDate)}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
              {currentProduct.title}
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-base text-white/80 line-clamp-2 hidden sm:block">
              {currentProduct.description}
            </p>

            {/* Bid Info */}
            <div className="flex items-center gap-6 sm:gap-8">
              <div>
                <p className="text-xs sm:text-sm text-white/70 mb-0.5">Entry Fee</p>
                <p className="text-xl sm:text-2xl font-bold text-white">
                  {formatPrice(currentProduct.entryFee)}
                </p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-white/70 mb-0.5">Prize Value</p>
                <div className="flex items-center gap-2">
                  <p className="text-xl sm:text-2xl font-bold text-primary">
                    {formatPrice(currentProduct.retailValue)}
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <Link
              href={`/product/${currentProduct.id}`}
              className="inline-flex items-center gap-2 px-6 py-2.5 sm:py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all hover:gap-3"
            >
              Place Bid Now
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={goToPrevious}
          className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white p-2.5 rounded-full transition-all opacity-0 group-hover:opacity-100"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={goToNext}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white p-2.5 rounded-full transition-all opacity-0 group-hover:opacity-100"
          aria-label="Next slide"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
          {products.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-1.5 rounded-full transition-all ${
                index === currentIndex
                  ? "bg-white w-6"
                  : "bg-white/40 w-1.5 hover:bg-white/60"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Live Auctions Card */}
      <div className="lg:col-span-4 rounded-2xl bg-linear-to-br from-primary to-orange-600 p-5 sm:p-6 text-white relative overflow-hidden group hover:shadow-xl transition-shadow">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full translate-y-10 -translate-x-10" />
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Zap className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium text-white/80">Live Auctions</span>
            </div>
            <span className="flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-2.5 w-2.5 rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
            </span>
          </div>
          <p className="text-4xl sm:text-5xl font-bold mb-1">{displayStats.liveAuctions}</p>
          <p className="text-sm text-white/70">Active right now</p>
          <Link
            href="/catalog"
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-white/90 hover:text-white group-hover:gap-3 transition-all"
          >
            Browse All
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Stats Row - Two smaller cards */}
      <div className="lg:col-span-2 rounded-2xl bg-linear-to-br from-green-500 to-emerald-600 p-4 sm:p-5 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(255,255,255,0.15),transparent)]" />
        <div className="relative">
          <div className="p-1.5 bg-white/20 rounded-lg w-fit mb-3">
            <Trophy className="h-4 w-4" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold">{displayStats.winnersToday}</p>
          <p className="text-xs text-white/70">Winners Today</p>
        </div>
      </div>

      <div className="lg:col-span-2 rounded-2xl bg-linear-to-br from-blue-500 to-indigo-600 p-4 sm:p-5 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_80%,rgba(255,255,255,0.15),transparent)]" />
        <div className="relative">
          <div className="p-1.5 bg-white/20 rounded-lg w-fit mb-3">
            <TrendingUp className="h-4 w-4" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold">{displayStats.totalBids.toLocaleString()}</p>
          <p className="text-xs text-white/70">Bids Placed</p>
        </div>
      </div>

      {/* Featured Products Quick View */}
      {products.length > 1 && (
        <div className="hidden lg:flex lg:col-span-4 lg:row-span-1 gap-3">
          {products.slice(1, 3).map((product, idx) => (
            <Link
              key={product.id}
              href={`/product/${product.id}`}
              className="flex-1 rounded-2xl border border-border bg-white dark:bg-gray-900 overflow-hidden group/card hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              <div className="relative h-20 bg-muted">
                <Image
                  src={product.images[0]}
                  alt={product.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/20 group-hover/card:bg-black/10 transition-colors" />
                <div className="absolute top-2 left-2">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/90 text-gray-900">
                    <Clock className="h-2.5 w-2.5" />
                    {formatTimeRemaining(product.endDate)}
                  </span>
                </div>
              </div>
              <div className="p-3">
                <h3 className="text-xs font-medium truncate group-hover/card:text-primary transition-colors">
                  {product.title}
                </h3>
                <p className="text-sm font-bold text-primary mt-1">
                  {formatPrice(product.entryFee)}
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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4">
      {/* Main hero skeleton */}
      <div className="lg:col-span-8 lg:row-span-2 h-[400px] sm:h-[450px] lg:h-[500px] rounded-2xl bg-muted animate-pulse" />

      {/* Live auctions skeleton */}
      <div className="lg:col-span-4 rounded-2xl bg-primary/20 p-5 sm:p-6 animate-pulse">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-9 w-9 bg-primary/30 rounded-lg" />
          <div className="h-4 w-24 bg-primary/30 rounded" />
        </div>
        <div className="h-12 w-20 bg-primary/30 rounded mb-1" />
        <div className="h-4 w-32 bg-primary/30 rounded" />
      </div>

      {/* Small stat cards */}
      <div className="lg:col-span-2 rounded-2xl bg-green-500/20 p-4 sm:p-5 animate-pulse">
        <div className="h-7 w-7 bg-green-500/30 rounded-lg mb-3" />
        <div className="h-8 w-12 bg-green-500/30 rounded mb-1" />
        <div className="h-3 w-20 bg-green-500/30 rounded" />
      </div>

      <div className="lg:col-span-2 rounded-2xl bg-blue-500/20 p-4 sm:p-5 animate-pulse">
        <div className="h-7 w-7 bg-blue-500/30 rounded-lg mb-3" />
        <div className="h-8 w-12 bg-blue-500/30 rounded mb-1" />
        <div className="h-3 w-20 bg-blue-500/30 rounded" />
      </div>

      {/* Featured products skeleton */}
      <div className="hidden lg:flex lg:col-span-4 gap-3">
        {[1, 2].map((i) => (
          <div key={i} className="flex-1 rounded-2xl border border-border bg-muted animate-pulse">
            <div className="h-20 bg-muted-foreground/10" />
            <div className="p-3">
              <div className="h-3 w-3/4 bg-muted-foreground/10 rounded mb-2" />
              <div className="h-4 w-1/2 bg-muted-foreground/10 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
