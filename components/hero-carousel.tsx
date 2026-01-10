"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/types";
import { formatPrice, formatTimeRemaining } from "@/lib/format";
import { ChevronLeft, ChevronRight, Clock, Gavel } from "lucide-react";

interface HeroCarouselProps {
  products: Product[];
}

export default function HeroCarousel({ products }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % products.length);
    }, 5000);

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
    <div className="relative w-full h-[500px] bg-muted rounded-2xl overflow-hidden group">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={currentProduct.images[0]}
          alt={currentProduct.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-xl space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-destructive/90 backdrop-blur-sm text-white px-4 py-2 rounded-full">
              <Clock className="h-4 w-4" />
              <span className="text-sm font-medium">
                Ending in {formatTimeRemaining(currentProduct.endDate)}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              {currentProduct.title}
            </h1>

            {/* Description */}
            <p className="text-lg text-white/90 line-clamp-2">
              {currentProduct.description}
            </p>

            {/* Bid Info */}
            <div className="flex items-center gap-8">
              <div>
                <p className="text-sm text-white/80 mb-1">Current Bid</p>
                <p className="text-3xl font-bold text-white">
                  {formatPrice(currentProduct.currentBid || currentProduct.startingPrice)}
                </p>
              </div>
              <div>
                <p className="text-sm text-white/80 mb-1">Total Bids</p>
                <div className="flex items-center gap-2">
                  <Gavel className="h-5 w-5 text-white" />
                  <p className="text-2xl font-semibold text-white">
                    {currentProduct.bidsCount || 0}
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <Link
              href={`/product/${currentProduct.id}`}
              className="inline-block px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Place Bid Now
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white p-3 rounded-full transition-all opacity-0 group-hover:opacity-100"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white p-3 rounded-full transition-all opacity-0 group-hover:opacity-100"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {products.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex
                ? "bg-white w-8"
                : "bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
