// Product API functions with caching and revalidation

import { Product } from "../types";
import { apiFetch } from "../api";
import { mockProducts, getFeaturedProducts, getNewestProducts, getEndingSoonProducts, getProductById } from "../mock-data";

// Cache tags for revalidation
export const PRODUCT_TAGS = {
  all: "products",
  list: "products-list",
  detail: (id: string) => `product-${id}`,
  category: (id: string) => `products-category-${id}`,
  search: "products-search",
  endingSoon: "products-ending-soon",
  newest: "products-newest",
};

// Fetch all products with search and filters
export async function searchProducts(params?: {
  query?: string;
  categoryId?: string;
  condition?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  page?: number;
  limit?: number;
}): Promise<{ data: Product[]; pagination: any }> {
  try {
    const queryParams = new URLSearchParams();
    if (params?.query) queryParams.set("query", params.query);
    if (params?.categoryId) queryParams.set("categoryId", params.categoryId);
    if (params?.condition) queryParams.set("condition", params.condition);
    if (params?.minPrice) queryParams.set("minPrice", params.minPrice.toString());
    if (params?.maxPrice) queryParams.set("maxPrice", params.maxPrice.toString());
    if (params?.sortBy) queryParams.set("sortBy", params.sortBy);
    if (params?.page) queryParams.set("page", params.page.toString());
    if (params?.limit) queryParams.set("limit", params.limit.toString());

    const endpoint = `/products/search${queryParams.toString() ? `?${queryParams}` : ""}`;

    console.log("Fetching products from endpoint:", endpoint);

    const data = await apiFetch<{ data: Product[]; pagination: any }>(
      endpoint,
      { tags: [PRODUCT_TAGS.all, PRODUCT_TAGS.search] }
    );

    console.log("Fetched products:", data);

    return data;
  } catch (error) {
    console.warn("API failed, using mock data:", error);
    // Fallback to mock data with client-side filtering
    let products = [...mockProducts].filter(p => p.isActive);

    // Apply filters
    if (params?.categoryId) {
      products = products.filter(p => p.categoryId === params.categoryId);
    }
    if (params?.condition) {
      products = products.filter(p => p.condition === params.condition);
    }
    if (params?.minPrice) {
      products = products.filter(p => (p.currentBid || p.startingPrice) >= params.minPrice!);
    }
    if (params?.maxPrice) {
      products = products.filter(p => (p.currentBid || p.startingPrice) <= params.maxPrice!);
    }

    // Sort
    switch (params?.sortBy) {
      case "ending_soon":
        products.sort((a, b) => a.endDate.getTime() - b.endDate.getTime());
        break;
      case "newest":
        products.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
      case "highest_bid":
        products.sort((a, b) => (b.currentBid || b.startingPrice) - (a.currentBid || a.startingPrice));
        break;
      case "lowest_price":
        products.sort((a, b) => (a.currentBid || a.startingPrice) - (b.currentBid || b.startingPrice));
        break;
    }

    return {
      data:products,
      pagination: {
        page: 1,
        limit: products.length,
        total: products.length,
        totalPages: 1,
      },
    };
  }
}

// Fetch products ending soon
export async function fetchEndingSoonProducts(limit: number = 8): Promise<Product[]> {
  try {
    const data = await apiFetch<Product[]>(
      `/products/ending-soon?limit=${limit}`,
      { tags: [PRODUCT_TAGS.all, PRODUCT_TAGS.endingSoon] }
    );
    return data;
  } catch (error) {
    console.warn("API failed, using mock data:", error);
    return getEndingSoonProducts(limit);
  }
}

// Fetch newest products
export async function fetchNewestProducts(limit: number = 8): Promise<Product[]> {
  try {
    const data = await apiFetch<Product[]>(
      `/products/newest?limit=${limit}`,
      { tags: [PRODUCT_TAGS.all, PRODUCT_TAGS.newest] }
    );
    return data;
  } catch (error) {
    console.warn("API failed, using mock data:", error);
    return getNewestProducts(limit);
  }
}

// Fetch featured products (ending soon for hero)
export async function fetchFeaturedProducts(): Promise<Product[]> {
  try {
    const data = await apiFetch<Product[]>(
      `/products/ending-soon?limit=6`,
      { tags: [PRODUCT_TAGS.all, PRODUCT_TAGS.endingSoon] }
    );
    return data;
  } catch (error) {
    console.warn("API failed, using mock data:", error);
    return getFeaturedProducts();
  }
}

// Fetch single product by ID
export async function fetchProductById(id: string): Promise<Product | null> {
  try {
    const data = await apiFetch<Product>(
      `/products/${id}`,
      { tags: [PRODUCT_TAGS.all, PRODUCT_TAGS.detail(id)] }
    );
    return data;
  } catch (error) {
    console.warn("API failed, using mock data:", error);
    return getProductById(id) || null;
  }
}

// Fetch products by category
export async function fetchProductsByCategory(
  categoryId: string,
  page: number = 1,
  limit: number = 20
): Promise<{ products: Product[]; pagination: any }> {
  try {
    const data = await apiFetch<{ products: Product[]; pagination: any }>(
      `/products/category/${categoryId}?page=${page}&limit=${limit}`,
      { tags: [PRODUCT_TAGS.all, PRODUCT_TAGS.category(categoryId)] }
    );
    return data;
  } catch (error) {
    console.warn("API failed, using mock data:", error);
    const products = mockProducts.filter(p => p.categoryId === categoryId && p.isActive);
    return {
      products,
      pagination: {
        page: 1,
        limit: products.length,
        total: products.length,
        totalPages: 1,
      },
    };
  }
}
