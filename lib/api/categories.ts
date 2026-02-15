// Category API functions

import { Category } from "../types";
import { apiFetch } from "../api";

export const CATEGORY_TAGS = {
  all: "categories",
  root: "categories-root",
  detail: (id: string) => `category-${id}`,
};

// Fetch all categories
export async function fetchCategories(): Promise<Category[]> {
  try {
    const data = await apiFetch<Category[]>(
      "/categories",
      { tags: [CATEGORY_TAGS.all] }
    );
    return data ?? [];
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
}

// Fetch root categories (for navigation)
export async function fetchRootCategories(): Promise<Category[]> {
  try {
    const data = await apiFetch<Category[]>(
      "/categories/root",
      { tags: [CATEGORY_TAGS.all, CATEGORY_TAGS.root] }
    );
    return data ?? [];
  } catch (error) {
    console.error("Failed to fetch root categories:", error);
    return [];
  }
}

// Fetch category by ID
export async function fetchCategoryById(id: string): Promise<Category | null> {
  try {
    const data = await apiFetch<Category>(
      `/categories/${id}`,
      { tags: [CATEGORY_TAGS.all, CATEGORY_TAGS.detail(id)] }
    );
    return data;
  } catch (error) {
    console.error("Failed to fetch category:", error);
    return null;
  }
}

// Fetch category by slug
export async function fetchCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const data = await apiFetch<Category>(
      `/categories/slug/${slug}`,
      { tags: [CATEGORY_TAGS.all] }
    );
    return data;
  } catch (error) {
    console.error("Failed to fetch category by slug:", error);
    return null;
  }
}
