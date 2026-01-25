"use client";

import { useState, useMemo } from "react";
import ProductCard from "@/components/product-card";
import CatalogFilters from "@/components/catalog-filters";
import { Product, ProductCondition, Category } from "@/lib/types";

interface CatalogClientProps {
  initialProducts: Product[];
  categories: Category[];
  initialFilters?: {
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
  initialFilters = {},
}: CatalogClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(
    initialFilters.categoryId || ""
  );
  const [selectedConditions, setSelectedConditions] = useState<ProductCondition[]>(
    initialFilters.condition ? [initialFilters.condition as ProductCondition] : []
  );
  const [minPrice, setMinPrice] = useState<number | undefined>(initialFilters.minPrice);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(initialFilters.maxPrice);
  const [sortBy, setSortBy] = useState<string>(initialFilters.sortBy || "ending_soon");


  console.log("Initial Products:", initialProducts);

  // Client-side filtering and sorting
  const filteredProducts = useMemo(() => {
    let products = [...initialProducts];

    // Filter by category
    if (selectedCategory) {
      products = products.filter((p) => p.categoryId === selectedCategory);
    }

    // Filter by condition
    if (selectedConditions.length > 0) {
      products = products.filter((p) => selectedConditions.includes(p.condition));
    }

    // Filter by price
    if (minPrice !== undefined) {
      products = products.filter(
        (p) => (p.retailValue ) >= minPrice
      );
    }
    if (maxPrice !== undefined) {
      products = products.filter(
        (p) => (p.retailValue) <= maxPrice
      );
    }

    // Sort
    switch (sortBy) {
      case "ending_soon":
        products.sort((a, b) => {
          const enda= new Date(a.endDate);
          const endB= new Date(b.endDate);
          return enda.getTime() - endB.getTime()
        });
        break;
      case "newest":
        products.sort((a, b) =>{
          const createdA= new Date(a.createdAt);
          const createdB= new Date(b.createdAt);
          return createdB.getTime() - createdA.getTime();
        } );
        break;
      case "highest_bid":
        products.sort(
          (a, b) =>
            (b.retailValue) - (a.retailValue)
        );
        break;
      case "lowest_price":
        products.sort(
          (a, b) =>
            (a.retailValue) - (b.retailValue)
        );
        break;
    }

    return products;
  }, [initialProducts, selectedCategory, selectedConditions, minPrice, maxPrice, sortBy]);

  const handleClearFilters = () => {
    setSelectedCategory("");
    setSelectedConditions([]);
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setSortBy("ending_soon");
  };

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
            onCategoryChange={setSelectedCategory}
            onConditionChange={setSelectedConditions}
            onPriceChange={(min, max) => {
              setMinPrice(min);
              setMaxPrice(max);
            }}
            onSortChange={setSortBy}
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
            onCategoryChange={setSelectedCategory}
            onConditionChange={setSelectedConditions}
            onPriceChange={(min, max) => {
              setMinPrice(min);
              setMaxPrice(max);
            }}
            onSortChange={setSortBy}
            onClearFilters={handleClearFilters}
          />
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            {filteredProducts.length}{" "}
            {filteredProducts.length === 1 ? "auction" : "auctions"} found
          </p>
        </div>

        {/* Products */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
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
