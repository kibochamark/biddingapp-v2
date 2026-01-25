import { Suspense } from "react";
import Link from "next/link";
import { fetchProductById, searchProducts } from "@/lib/api/products";
import ProductCard from "@/components/product-card";
import { ProductsGridSkeleton } from "@/components/loading-skeleton";
import { ChevronRight, TrendingUp, PackageX } from "lucide-react";
import ProductDetailClient from "@/components/product/product-detail-client";
import PaymentNotification from "@/components/bid/payment-notification";

interface ProductPageProps {

    id: string;
  
}

async function RelatedProducts({ categoryId, currentProductId }: { categoryId: string; currentProductId: string }) {
  const { data } = await searchProducts({
    categoryId,
    limit: 4,
  });

  const relatedProducts = data.filter(p => p.id !== currentProductId).slice(0, 4);

  if (relatedProducts.length === 0) return null;

  return (
    <div className="mt-16">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">Similar Auctions</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts.map((relatedProduct) => (
          <ProductCard key={relatedProduct.id} product={relatedProduct} />
        ))}
      </div>
    </div>
  );
}

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

export default async function ProductPage({ params }: {params:Promise<ProductPageProps>}) {
  const product_id = (await params).id;
  console.log(product_id)

  const product = await fetchProductById(product_id);

  if (!product) {
    return (
      <div className="min-h-screen bg-linear-to-b from-background to-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/catalog" className="hover:text-primary transition-colors">
              Catalog
            </Link>
          </nav>

          {/* Product Not Found Message */}
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="max-w-md w-full text-center">
              <div className="mb-6 relative">
                <div className="p-6 bg-primary/10 rounded-full inline-block">
                  <PackageX className="h-20 w-20 text-primary" />
                </div>
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-4">
                Product Not Found
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Sorry, we couldn't find the auction you're looking for. It may have been removed or the link might be incorrect.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/catalog"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  <TrendingUp className="h-5 w-5" />
                  Browse Auctions
                </Link>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-muted text-foreground rounded-lg font-semibold hover:bg-accent transition-all border border-border"
                >
                  Go Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-muted/20">
      {/* Payment Notification Handler */}
      <PaymentNotification />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/catalog" className="hover:text-primary transition-colors">
            Catalog
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-medium">{product.title}</span>
        </nav>

        {/* Main Content - Client Component for Redux Access */}
        <ProductDetailClient product={product} />

        {/* Related Products */}
        <Suspense fallback={<ProductsGridSkeleton count={4} />}>
          <RelatedProducts categoryId={product.categoryId} currentProductId={product.id} />
        </Suspense>
      </div>
    </div>
  );
}

// Generate metadata for SEO
export async function generateMetadata({ params }: {params :Promise<ProductPageProps>}) {
  const id = (await params).id
  const product = await fetchProductById(id);

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
