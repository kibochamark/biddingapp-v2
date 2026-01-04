"use client";

import { Search, X, Loader2, TrendingUp } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { searchProducts } from "@/lib/api/products";
import { popularSearches } from "@/lib/mock-search-data";
import { Product } from "@/lib/types";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Image from "next/image";
import Link from "next/link";

export function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Handle search with debounce
  useEffect(() => {
    if (debouncedSearchQuery.trim().length > 0) {
      setIsSearching(true);

      // Call server action
      searchProducts({ query: debouncedSearchQuery, limit: 20 })
        .then((response) => {
          setSearchResults(response.data);
          setIsSearching(false);
          setIsSearchOpen(true);
        })
        .catch((error) => {
          console.error("Search error:", error);
          setSearchResults([]);
          setIsSearching(false);
          setIsSearchOpen(true);
        });
    } else {
      setSearchResults([]);
      setIsSearching(false);
      setIsSearchOpen(false);
    }
  }, [debouncedSearchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setIsSearchOpen(false);
  };

  const handleSearchSelect = () => {
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  const handlePopularSearch = (term: string) => {
    setSearchQuery(term);
    searchInputRef.current?.focus();
  };

  return (
    <>
      {/* Desktop Search Bar */}
      <div className="hidden md:flex w-lg">
        <Popover open={isSearchOpen} onOpenChange={setIsSearchOpen}>
          <PopoverTrigger asChild>
            <div className="relative w-full">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search for products, brands, or categories..."
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => searchQuery.length > 0 && setIsSearchOpen(true)}
                className="w-full h-10 px-4 py-2 pl-10 pr-10 rounded-full border border-input bg-muted focus:bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all text-sm"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              {searchQuery && !isSearching && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 hover:bg-accent rounded-full transition-colors"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              )}
              {isSearching && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary animate-spin" />
              )}
            </div>
          </PopoverTrigger>
          <PopoverContent
            className="w-[500px] p-2 mt-16 md:mt-0"
            align="start"
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            <div className="max-h-[500px]  overflow-y-auto">
              
              {/* Search Results */}
              {searchResults.length > 0 ? (
                <div className="p-2">
                  <div className="px-3 py-2 text-xs font-semibold text-white uppercase tracking-wider">
                    Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
                  </div>
                  {searchResults.slice(0, 6).map((product) => (
                    <Link
                      key={product.id}
                      href={`/product/${product.id}`}
                      onClick={handleSearchSelect}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors group"
                    >
                      <div className="relative w-16 h-16 bg-muted rounded-lg overflow-hidden shrink-0">
                        <Image
                          src={product.images[0] || "/placeholder.png"}
                          alt={product.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">
                          {product.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-0.5 truncate">
                          {product.description}
                        </p>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="text-sm font-semibold text-primary">
                            ${product.biddingFee} entry
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {product.totalBids} bids
                          </span>
                          {product.status === "ACTIVE" && (
                            <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full font-medium">
                              Active
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                  {searchResults.length > 6 && (
                    <div className="px-3 py-2 text-center">
                      <Link
                        href={`/catalog?search=${encodeURIComponent(searchQuery)}`}
                        onClick={handleSearchSelect}
                        className="text-sm text-primary hover:text-primary/80 font-medium"
                      >
                        View all {searchResults.length} results →
                      </Link>
                    </div>
                  )}
                </div>
              ) : searchQuery.trim().length > 0 && !isSearching ? (
                <div className="p-8 text-center">
                  <Search className="h-12 w-12 text-muted mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">No results found for &quot;{searchQuery}&quot;</p>
                  <p className="text-xs text-muted-foreground mt-1">Try searching with different keywords</p>
                </div>
              ) : (
                <div className="p-4">
                  <div className="px-2 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Popular Searches
                  </div>
                  <div className="space-y-1">
                    {popularSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => handlePopularSearch(term)}
                        className="flex items-center gap-2 w-full px-3 py-2 rounded-lg hover:bg-accent transition-colors text-left group"
                      >
                        <TrendingUp className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                        <span className="text-sm text-foreground group-hover:text-primary">
                          {term}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden pb-4 relative"> 
        <div className="relative w-full mt-4">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full px-4 py-2.5 pl-10 pr-10 rounded-full border border-input bg-muted focus:bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all text-sm"
          />
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-2.5 p-0.5 hover:bg-accent rounded-full transition-colors"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>

        

        {/* Mobile Search Results */}
        {/* {searchResults.length > 0 && (
          <div className="mt-4 absolute z-50 top-10 bg-background rounded-lg border border-border shadow-lg max-h-96 overflow-y-auto">
            {searchResults.slice(0, 5).map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                onClick={handleSearchSelect}
                className="flex items-center gap-3 p-3 border-b border-border last:border-b-0 hover:bg-accent"
              >
                <div className="relative w-12 h-12 bg-muted rounded-lg overflow-hidden shrink-0">
                  <Image
                    src={product.images[0] || "/placeholder.png"}
                    alt={product.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-foreground truncate">
                    {product.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-semibold text-primary">
                      ${product.biddingFee}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {product.totalBids} bids
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )} */}
      </div>
    </>
  );
}
