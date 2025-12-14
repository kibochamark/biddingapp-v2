// Category API functions

import { Category } from "../types";
import { apiFetch } from "../api";
import { mockCategories } from "../mock-data";

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
    return data;
  } catch (error) {
    console.warn("API failed, using mock data:", error);
    return mockCategories;
  }
}

// Fetch root categories (for navigation)
export async function fetchRootCategories(): Promise<Category[]> {
  try {
    const data = await apiFetch<Category[]>(
      "/categories/root",
      { tags: [CATEGORY_TAGS.all, CATEGORY_TAGS.root] }
    );
    return data;
  } catch (error) {
    console.warn("API failed, using mock data:", error);
    return mockCategories.filter(c => !c.parentId);
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
    console.warn("API failed, using mock data:", error);
    return mockCategories.find(c => c.id === id) || null;
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
    console.warn("API failed, using mock data:", error);
    return mockCategories.find(c => c.slug === slug) || null;
  }
}
