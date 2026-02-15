// Product API functions with caching and revalidation
"use server"
import { Product } from "../types";
import { apiFetch } from "../api";
import { PRODUCT_TAGS } from "../revalidatetags";

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

    const data = await apiFetch<{ data: Product[]; pagination: any }>(
      endpoint,
      { tags: [PRODUCT_TAGS.all, PRODUCT_TAGS.search] }
    );

    return data;
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return {
      data: [],
      pagination: { page: 1, limit: 0, total: 0, totalPages: 0 },
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
    return data ?? [];
  } catch (error) {
    console.error("Failed to fetch ending soon products:", error);
    return [];
  }
}

// Fetch newest products
export async function fetchNewestProducts(limit: number = 8): Promise<Product[]> {
  try {
    const data = await apiFetch<Product[]>(
      `/products/newest?limit=${limit}`,
      { tags: [PRODUCT_TAGS.all, PRODUCT_TAGS.newest] }
    );
    return data ?? [];
  } catch (error) {
    console.error("Failed to fetch newest products:", error);
    return [];
  }
}

// Fetch featured products (ending soon for hero)
export async function fetchFeaturedProducts(): Promise<Product[]> {
  try {
    const data = await apiFetch<Product[]>(
      `/products/ending-soon?limit=6`,
      { tags: [PRODUCT_TAGS.all, PRODUCT_TAGS.endingSoon] }
    );
    return data ?? [];
  } catch (error) {
    console.error("Failed to fetch featured products:", error);
    return [];
  }
}

// Fetch single product by ID
export async function fetchProductById(id: string): Promise<Product | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`,
      {
        next: { tags: [`product/${id}`] }
      }
    );

    if (!response.ok) return null;

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return null;
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
    console.error("Failed to fetch products by category:", error);
    return {
      products: [],
      pagination: { page: 1, limit: 0, total: 0, totalPages: 0 },
    };
  }
}

interface ProductResponse {
  data: Product[];
  pagination: any;
}

export async function getAllProducts(limit?: string): Promise<Product[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL!}/products${limit ? `?limit=${limit}` : ""}`, {
      next: { tags: ["adminproducts"] }
    });
    const products: ProductResponse = await response.json();
    return products.data;
  } catch (error) {
    console.error("Failed to fetch all products:", error);
    return [];
  }
}
