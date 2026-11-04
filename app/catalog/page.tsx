import { Suspense } from "react";
import CatalogClient from "./catalog-client";
import { fetchCategories } from "@/lib/api/categories";
import { searchProducts } from "@/lib/api/products";
import { CategoryGridSkeleton, ProductsGridSkeleton } from "@/components/loading-skeleton";

interface CatalogPageProps {
  searchParams?: {
    category?: string;
    condition?: string;
    minPrice?: string;
    maxPrice?: string;
    sortBy?: string;
    query?: string;
  };
}

async function CatalogContent({ searchParams }: CatalogPageProps) {
  const categories = await fetchCategories();

  const params = await searchParams || {};

  // Parse search params
  // The URL contains a category slug (e.g. "smartphones"), but the client
  // filters products by category ID. Resolve slug → ID here so both the
  // server fetch and client-side filtering use the same value.
  const categorySlug = (await params)?.category;
  const matchedCategory = categorySlug
    ? categories.find((c) => c.slug === categorySlug)
    : undefined;
  const categoryId = matchedCategory?.id ?? categorySlug;
  const condition = (await params)?.condition;
  const minPrice = (await params)?.minPrice ? parseFloat((await params).minPrice as string) : undefined;
  const maxPrice = (await params)?.maxPrice ? parseFloat((await params).maxPrice as string) : undefined;
  const sortBy = (await params)?.sortBy || "ending_soon";
  const query = (await params)?.query;

  // Fetch initial products
  const { data: initialProducts, pagination } = await searchProducts({
    query,
    categoryId,
    condition,
    minPrice,
    maxPrice,
    sortBy,
    limit: 20,
  });

  return (
    <CatalogClient
      initialProducts={initialProducts}
      categories={categories}
      initialFilters={{
        categoryId,
        condition,
        minPrice,
        maxPrice,
        sortBy,
      }}
    />
  );
}

export default function CatalogPage(props: CatalogPageProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-medium text-ink uppercase mb-2">Browse Auctions</h1>
        <p className="text-mute">
          Discover quality electronics at unbeatable prices
        </p>
      </div>

      {/* Catalog Content with Suspense */}
      <Suspense
        fallback={
          <div className="flex gap-8">
            <aside className="hidden lg:block w-64 shrink-0">
              <CategoryGridSkeleton />
            </aside>
            <div className="flex-1">
              <ProductsGridSkeleton count={9} />
            </div>
          </div>
        }
      >
        <CatalogContent searchParams={props.searchParams} />
      </Suspense>
    </div>
  );
}

// Generate metadata for SEO
export async function generateMetadata({ searchParams }: CatalogPageProps) {
  const query = await searchParams?.query;
  const category = await searchParams?.category;

  let title = "Browse Auctions - BidMarket";
  let description = "Discover quality electronics at unbeatable prices";

  if (query) {
    title = `Search: ${query} - BidMarket`;
    description = `Search results for "${query}"`;
  } else if (category) {
    title = `${category} Auctions - BidMarket`;
    description = `Browse ${category} auctions`;
  }

  return {
    title,
    description,
  };
}
