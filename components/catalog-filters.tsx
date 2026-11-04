"use client";

import { Category, ProductCondition } from "@/lib/types";
import { SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

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
    MINT: "Mint",
    EXCELLENT: "Excellent",
  };

  return (
    <>
      {/* Mobile Filter Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden"
        size="sm"
      >
        <SlidersHorizontal className="h-4 w-4" />
        Filters
      </Button>

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
            <h2 className="text-lg font-medium text-ink">Filters</h2>
            <button onClick={() => setIsOpen(false)} aria-label="Close filters">
              <X className="h-5 w-5 text-ink" />
            </button>
          </div>

          {/* Clear Filters */}
          <button
            onClick={onClearFilters}
            className="text-sm text-mute hover:text-ink underline underline-offset-4 mb-4"
          >
            Clear all filters
          </button>

          {/* Sort By */}
          <div className="space-y-3 pb-6 border-b border-hairline lg:border-b-0 lg:pb-0">
            <h3 className="font-medium text-ink">Sort By</h3>
            <Select value={sortBy} onValueChange={onSortChange}>
              <SelectTrigger className="w-full bg-soft-cloud">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ending_soon">Ending Soon</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="highest_bid">Highest Bid</SelectItem>
                <SelectItem value="lowest_price">Lowest Price</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Categories — filter-chip / filter-chip-active */}
          <div className="space-y-3 py-6 border-b border-hairline lg:border-b-0 lg:py-0">
            <h3 className="font-medium text-ink">Category</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => onCategoryChange("")}
                className={cn(
                  "h-10 px-4 rounded-full border text-sm font-medium transition-colors",
                  !selectedCategory
                    ? "border-ink bg-ink text-background"
                    : "border-hairline bg-background text-ink hover:bg-soft-cloud"
                )}
              >
                All
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => onCategoryChange(category.id)}
                  className={cn(
                    "h-10 px-4 rounded-full border text-sm font-medium transition-colors",
                    selectedCategory === category.id
                      ? "border-ink bg-ink text-background"
                      : "border-hairline bg-background text-ink hover:bg-soft-cloud"
                  )}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Condition */}
          <div className="space-y-3 py-6 border-b border-hairline lg:border-b-0 lg:py-0">
            <h3 className="font-medium text-ink">Condition</h3>
            <div className="space-y-2.5">
              {conditions.map((condition) => (
                <Label key={condition} className="cursor-pointer font-normal">
                  <Checkbox
                    checked={selectedConditions.includes(condition)}
                    onChange={() => handleConditionToggle(condition)}
                  />
                  <span className="text-sm text-ink">{conditionLabels[condition]}</span>
                </Label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-3 pt-6">
            <h3 className="font-medium text-ink">Price Range</h3>
            <div className="space-y-2">
              <Input
                type="number"
                placeholder="Min price"
                value={localMinPrice}
                onChange={(e) => setLocalMinPrice(e.target.value)}
                className="h-10 bg-background border border-hairline"
              />
              <Input
                type="number"
                placeholder="Max price"
                value={localMaxPrice}
                onChange={(e) => setLocalMaxPrice(e.target.value)}
                className="h-10 bg-background border border-hairline"
              />
              <Button onClick={handlePriceApply} size="sm" className="w-full">
                Apply
              </Button>
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
