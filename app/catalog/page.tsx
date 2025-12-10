"use client";

import { useState, useMemo } from "react";
import ProductCard from "@/components/product-card";
import CatalogFilters from "@/components/catalog-filters";
import { mockProducts, mockCategories } from "@/lib/mock-data";
import { ProductCondition } from "@/lib/types";

export default function CatalogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedConditions, setSelectedConditions] = useState<ProductCondition[]>([]);
  const [minPrice, setMinPrice] = useState<number | undefined>();
  const [maxPrice, setMaxPrice] = useState<number | undefined>();
  const [sortBy, setSortBy] = useState<string>("ending_soon");

  const filteredProducts = useMemo(() => {
    let products = [...mockProducts].filter((p) => p.isActive);

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
        (p) => (p.currentBid || p.startingPrice) >= minPrice
      );
    }
    if (maxPrice !== undefined) {
      products = products.filter(
        (p) => (p.currentBid || p.startingPrice) <= maxPrice
      );
    }

    // Sort
    switch (sortBy) {
      case "ending_soon":
        products.sort((a, b) => a.endDate.getTime() - b.endDate.getTime());
        break;
      case "newest":
        products.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
      case "highest_bid":
        products.sort(
          (a, b) =>
            (b.currentBid || b.startingPrice) - (a.currentBid || a.startingPrice)
        );
        break;
      case "lowest_price":
        products.sort(
          (a, b) =>
            (a.currentBid || a.startingPrice) - (b.currentBid || b.startingPrice)
        );
        break;
    }

    return products;
  }, [selectedCategory, selectedConditions, minPrice, maxPrice, sortBy]);

  const handleClearFilters = () => {
    setSelectedCategory("");
    setSelectedConditions([]);
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setSortBy("ending_soon");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Browse Auctions</h1>
        <p className="text-muted-foreground">
          Discover quality electronics at unbeatable prices
        </p>
      </div>

      {/* Layout */}
      <div className="flex gap-8">
        {/* Filters Sidebar */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-24">
            <CatalogFilters
              categories={mockCategories}
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
              categories={mockCategories}
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
              {filteredProducts.length} {filteredProducts.length === 1 ? "auction" : "auctions"} found
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
    </div>
  );
}
