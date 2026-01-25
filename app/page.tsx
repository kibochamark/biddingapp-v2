import { Suspense } from "react";
import HeroBento, { HeroBentoSkeleton } from "@/components/hero-bento";
import ProductCarousel from "@/components/product-carousel";
import CategoryGrid from "@/components/category-grid";
import TrustBento from "@/components/trust-bento";
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

// Server component for ending soon products
async function EndingSoonSection() {
  const endingSoonProducts = await fetchEndingSoonProducts(8);

  return (
    <ProductCarousel
      title="Ending Soon"
      products={endingSoonProducts}
      viewAllLink="/catalog?sort=ending_soon"
    />
  );
}

// Server component for new arrivals
async function NewArrivalsSection() {
  const newestProducts = await fetchNewestProducts(8);

  return (
    <ProductCarousel
      title="New Arrivals"
      products={newestProducts}
      viewAllLink="/catalog?sort=newest"
    />
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

      {/* Ending Soon */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <Suspense fallback={<ProductsGridSkeleton count={8} />}>
          <EndingSoonSection />
        </Suspense>
      </section>

      {/* New Arrivals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <Suspense fallback={<ProductsGridSkeleton count={8} />}>
          <NewArrivalsSection />
        </Suspense>
      </section>

      {/* Trust Bento Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
        <TrustBento />
      </section>
    </div>
  );
}
