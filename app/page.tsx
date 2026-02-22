import { Suspense } from "react";
import HeroBento, { HeroBentoSkeleton } from "@/components/hero-bento";
import CategoryGrid from "@/components/category-grid";
import TrustBento from "@/components/trust-bento";
import ProductCard from "@/components/product-card";
import {
  ProductsGridSkeleton,
  CategoryGridSkeleton,
} from "@/components/loading-skeleton";
import {
  fetchFeaturedProducts,
  fetchNewestProducts,
  fetchEndingSoonProducts,
} from "@/lib/api/products";
import { fetchCategories } from "@/lib/api/categories";

// Server component for hero bento
async function HeroSection() {
  const featuredProducts = await fetchFeaturedProducts();
  return <HeroBento products={featuredProducts} />;
}

// Server component for categories
async function CategoriesSection() {
  const categories = await fetchCategories();
  return <CategoryGrid categories={categories} />;
}

// Flash Sale — replaces "Ending Soon", shown as a full grid for visual weight
async function FlashSaleSection() {
  const products = await fetchEndingSoonProducts(8);
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl sm:text-2xl font-bold">Flash Sale</h2>
          <span className="px-2.5 py-1 rounded-full bg-destructive/10 text-destructive text-xs font-semibold">
            Ending Soon
          </span>
        </div>
        <a
          href="/catalog?sort=ending_soon"
          className="text-sm font-medium text-primary hover:underline"
        >
          View all
        </a>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

// New Arrivals — aligned grid, uniform card widths
async function NewArrivalsSection() {
  const products = await fetchNewestProducts(8);
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-bold">New Arrivals</h2>
        <a
          href="/catalog?sort=newest"
          className="text-sm font-medium text-primary hover:underline"
        >
          View all
        </a>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Bento Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Suspense fallback={<HeroBentoSkeleton />}>
          <HeroSection />
        </Suspense>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <h2 className="text-xl sm:text-2xl font-bold mb-6">Shop by Category</h2>
        <Suspense fallback={<CategoryGridSkeleton />}>
          <CategoriesSection />
        </Suspense>
      </section>

      {/* Flash Sale */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <Suspense fallback={<ProductsGridSkeleton count={8} />}>
          <FlashSaleSection />
        </Suspense>
      </section>

      {/* New Arrivals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <Suspense fallback={<ProductsGridSkeleton count={8} />}>
          <NewArrivalsSection />
        </Suspense>
      </section>

      {/* Trust / BidMarket section — extra bottom margin creates breathing room before footer */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 mb-16">
        <TrustBento />
      </section>
    </div>
  );
}
