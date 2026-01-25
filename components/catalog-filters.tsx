"use client";

import { Category, ProductCondition } from "@/lib/types";
import { SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

interface CatalogFiltersProps {
  categories: Category[];
  selectedCategory?: string;
  selectedConditions: ProductCondition[];
  minPrice?: number;
  maxPrice?: number;
  sortBy: string;
  onCategoryChange: (categoryId: string) => void;
  onConditionChange: (conditions: ProductCondition[]) => void;
  onPriceChange: (min?: number, max?: number) => void;
  onSortChange: (sort: string) => void;
  onClearFilters: () => void;
}

export default function CatalogFilters({
  categories,
  selectedCategory,
  selectedConditions,
  minPrice,
  maxPrice,
  sortBy,
  onCategoryChange,
  onConditionChange,
  onPriceChange,
  onSortChange,
  onClearFilters,
}: CatalogFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localMinPrice, setLocalMinPrice] = useState(minPrice?.toString() || "");
  const [localMaxPrice, setLocalMaxPrice] = useState(maxPrice?.toString() || "");

  const conditions: ProductCondition[] = ["NEW", "LIKE_NEW", "GOOD", "FAIR", "POOR"];

  const handleConditionToggle = (condition: ProductCondition) => {
    if (selectedConditions.includes(condition)) {
      onConditionChange(selectedConditions.filter((c) => c !== condition));
    } else {
      onConditionChange([...selectedConditions, condition]);
    }
  };

  const handlePriceApply = () => {
    const min = localMinPrice ? parseFloat(localMinPrice) : undefined;
    const max = localMaxPrice ? parseFloat(localMaxPrice) : undefined;
    onPriceChange(min, max);
  };

  const conditionLabels: Record<ProductCondition, string> = {
    NEW: "Brand New",
    LIKE_NEW: "Like New",
    GOOD: "Good",
    FAIR: "Fair",
    POOR: "Poor",
    MINT:"Mint",
    "EXCELLENT":"Excellent"
  };

  return (
    <>
      {/* Mobile Filter Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg"
      >
        <SlidersHorizontal className="h-4 w-4" />
        Filters
      </button>

      {/* Filters Sidebar */}
      <div
        className={`
        fixed lg:static inset-0 z-40 bg-background lg:bg-transparent
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        lg:w-64 overflow-y-auto
      `}
      >
        <div className="p-6 lg:p-0 lg:space-y-6">
          {/* Mobile Header */}
          <div className="flex items-center justify-between mb-6 lg:hidden">
            <h2 className="text-lg font-semibold">Filters</h2>
            <button onClick={() => setIsOpen(false)}>
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Clear Filters */}
          <button
            onClick={onClearFilters}
            className="text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            Clear all filters
          </button>

          {/* Sort By */}
          <div className="space-y-3">
            <h3 className="font-semibold">Sort By</h3>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-lg bg-background"
            >
              <option value="ending_soon">Ending Soon</option>
              <option value="newest">Newest First</option>
              <option value="highest_bid">Highest Bid</option>
              <option value="lowest_price">Lowest Price</option>
            </select>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h3 className="font-semibold">Category</h3>
            <div className="space-y-2">
              <button
                onClick={() => onCategoryChange("")}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  !selectedCategory
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent"
                }`}
              >
                All Categories
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => onCategoryChange(category.id)}
                  className={`w-full text-left flex flex-row items-center px-3 py-2 rounded-lg transition-colors ${
                    selectedCategory === category.id
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent"
                  }`}
                >
                  <div className="relative h-4 w-4 rounded-full  p-3 flex items-center justify-center transition-colors duration-300">
                                <Image
                                  src={category.icon as string}
                                  alt={category.name}
                                  fill
                                  className="object-contain"
                                />
                              </div>
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Condition */}
          <div className="space-y-3">
            <h3 className="font-semibold">Condition</h3>
            <div className="space-y-2">
              {conditions.map((condition) => (
                <label
                  key={condition}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedConditions.includes(condition)}
                    onChange={() => handleConditionToggle(condition)}
                    className="w-4 h-4 rounded border-input"
                  />
                  <span className="text-sm">{conditionLabels[condition]}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-3">
            <h3 className="font-semibold">Price Range</h3>
            <div className="space-y-2">
              <input
                type="number"
                placeholder="Min price"
                value={localMinPrice}
                onChange={(e) => setLocalMinPrice(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-lg bg-background"
              />
              <input
                type="number"
                placeholder="Max price"
                value={localMaxPrice}
                onChange={(e) => setLocalMaxPrice(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-lg bg-background"
              />
              <button
                onClick={handlePriceApply}
                className="w-full px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
