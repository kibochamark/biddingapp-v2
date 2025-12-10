import HeroCarousel from "@/components/hero-carousel";
import ProductCarousel from "@/components/product-carousel";
import CategoryGrid from "@/components/category-grid";
import {
  mockCategories,
  getFeaturedProducts,
  getNewestProducts,
  getEndingSoonProducts,
} from "@/lib/mock-data";

export default function Home() {
  const featuredProducts = getFeaturedProducts();
  const newestProducts = getNewestProducts(8);
  const endingSoonProducts = getEndingSoonProducts(8);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <HeroCarousel products={featuredProducts} />
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
        <CategoryGrid categories={mockCategories} />
      </section>

      {/* Ending Soon */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ProductCarousel
          title="Ending Soon"
          products={endingSoonProducts}
          viewAllLink="/catalog?sort=ending_soon"
        />
      </section>

      {/* New Arrivals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ProductCarousel
          title="New Arrivals"
          products={newestProducts}
          viewAllLink="/catalog?sort=newest"
        />
      </section>

      {/* Trust Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="glass-card rounded-2xl p-8 md:p-12">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose BidMarket?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-3">
              <div className="text-4xl mb-4">✓</div>
              <h3 className="font-semibold text-lg">Quality Guaranteed</h3>
              <p className="text-muted-foreground text-sm">
                Every item is verified and inspected before listing
              </p>
            </div>
            <div className="text-center space-y-3">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="font-semibold text-lg">Secure Bidding</h3>
              <p className="text-muted-foreground text-sm">
                Protected transactions with buyer guarantee
              </p>
            </div>
            <div className="text-center space-y-3">
              <div className="text-4xl mb-4">🚚</div>
              <h3 className="font-semibold text-lg">Fast Shipping</h3>
              <p className="text-muted-foreground text-sm">
                Quick and reliable delivery to your doorstep
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
