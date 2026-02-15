"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import ProductCard from "@/components/product-card";
import CatalogFilters from "@/components/catalog-filters";
import { Product, ProductCondition, Category } from "@/lib/types";

interface CatalogClientProps {
  initialProducts: Product[];
  categories: Category[];
  initialFilters: {
    categoryId?: string;
    condition?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
  };
}

export default function CatalogClient({
  initialProducts,
  categories,
  initialFilters,
}: CatalogClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Build a new URL from the current params + the changes, then navigate.
  // This triggers the server component to re-fetch with new filters.
  const updateParams = useCallback(
    (updates: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());

      for (const [key, value] of Object.entries(updates)) {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      }

      router.replace(`/catalog?${params.toString()}`);
    },
    [router, searchParams]
  );

  // --- Filter change handlers that push to the URL ---

  const handleCategoryChange = useCallback(
    (categoryId: string) => {
      // Convert ID → slug for a clean URL
      const slug = categoryId
        ? categories.find((c) => c.id === categoryId)?.slug
        : undefined;
      updateParams({ category: slug || undefined });
    },
    [categories, updateParams]
  );

  const handleConditionChange = useCallback(
    (conditions: ProductCondition[]) => {
      updateParams({
        condition: conditions.length > 0 ? conditions.join(",") : undefined,
      });
    },
    [updateParams]
  );

  const handlePriceChange = useCallback(
    (min?: number, max?: number) => {
      updateParams({
        minPrice: min !== undefined ? min.toString() : undefined,
        maxPrice: max !== undefined ? max.toString() : undefined,
      });
    },
    [updateParams]
  );

  const handleSortChange = useCallback(
    (sort: string) => {
      updateParams({ sortBy: sort === "ending_soon" ? undefined : sort });
    },
    [updateParams]
  );

  const handleClearFilters = useCallback(() => {
    router.replace("/catalog");
  }, [router]);

  // Read current filter values from props (server already resolved them)
  const selectedCategory = initialFilters.categoryId || "";
  const selectedConditions: ProductCondition[] = initialFilters.condition
    ? (initialFilters.condition.split(",") as ProductCondition[])
    : [];
  const minPrice = initialFilters.minPrice;
  const maxPrice = initialFilters.maxPrice;
  const sortBy = initialFilters.sortBy || "ending_soon";

  return (
    <div className="flex gap-8 relative">
      {/* Filters Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-24 z-50">
          <CatalogFilters
            categories={categories}
            selectedCategory={selectedCategory}
            selectedConditions={selectedConditions}
            minPrice={minPrice}
            maxPrice={maxPrice}
            sortBy={sortBy}
            onCategoryChange={handleCategoryChange}
            onConditionChange={handleConditionChange}
            onPriceChange={handlePriceChange}
            onSortChange={handleSortChange}
            onClearFilters={handleClearFilters}
          />
        </div>
      </aside>

      {/* Products Grid */}
      <div className="flex-1">
        {/* Mobile Filters */}
        <div className="lg:hidden mb-4">
          <CatalogFilters
            categories={categories}
            selectedCategory={selectedCategory}
            selectedConditions={selectedConditions}
            minPrice={minPrice}
            maxPrice={maxPrice}
            sortBy={sortBy}
            onCategoryChange={handleCategoryChange}
            onConditionChange={handleConditionChange}
            onPriceChange={handlePriceChange}
            onSortChange={handleSortChange}
            onClearFilters={handleClearFilters}
          />
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            {initialProducts.length}{" "}
            {initialProducts.length === 1 ? "auction" : "auctions"} found
          </p>
        </div>

        {/* Products — rendered directly, server already filtered them */}
        {initialProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {initialProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              No auctions found matching your filters
            </p>
            <button
              onClick={handleClearFilters}
              className="text-primary hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
