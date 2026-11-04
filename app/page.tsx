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
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

// Server component for hero bento
async function HeroSection() {
  const featuredProducts = await fetchFeaturedProducts();
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  console.log("Authenticated user:", user);
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
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl sm:text-3xl font-medium text-ink uppercase">Flash Sale</h2>
          <span className="px-3 py-1 rounded-full bg-sale text-white text-xs font-medium">
            Ending Soon
          </span>
        </div>
        <a
          href="/catalog?sortBy=ending_soon"
          className="text-sm font-medium text-ink hover:text-primary underline underline-offset-4"
        >
          View all
        </a>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-8">
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
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <h2 className="text-2xl sm:text-3xl font-medium text-ink uppercase">New Arrivals</h2>
        <a
          href="/catalog?sortBy=newest"
          className="text-sm font-medium text-ink hover:text-primary underline underline-offset-4"
        >
          View all
        </a>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-8">
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
      {/* Hero campaign */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <Suspense fallback={<HeroBentoSkeleton />}>
          <HeroSection />
        </Suspense>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl sm:text-3xl font-medium text-ink uppercase mb-6">Shop by Category</h2>
        <Suspense fallback={<CategoryGridSkeleton />}>
          <CategoriesSection />
        </Suspense>
      </section>

      {/* Flash Sale */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Suspense fallback={<ProductsGridSkeleton count={8} />}>
          <FlashSaleSection />
        </Suspense>
      </section>

      {/* New Arrivals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Suspense fallback={<ProductsGridSkeleton count={8} />}>
          {/* <NewArrivalsSection /> */}
        </Suspense>
      </section>

      {/* Trust / BidMarket section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mb-12">
        <TrustBento />
      </section>
    </div>
  );
}
