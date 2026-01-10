"use server";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { revalidatePath } from "next/cache";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export interface CategoryWithRelations {
  id: string;
  slug: string;
  name: string;
  description?: string;
  icon?: string;
  parentId: string | null;
  createdAt: Date;
  updatedAt: Date;
  parent?: CategoryWithRelations | null;
  children: CategoryWithRelations[];
  _count?: {
    products: number;
  };
}

/**
 * Fetch all categories (public endpoint - no auth required)
 */
export async function fetchCategories() {
  try {
    const response = await fetch(`${API_URL}/categories`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || "Failed to fetch categories" };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return { success: false, error: "An error occurred while fetching categories" };
  }
}

/**
 * Fetch all categories for admin (with auth)
 */
export async function fetchAdminCategories() {
  try {
    const { getPermission, getAccessTokenRaw } = getKindeServerSession();

    // Check permission
    const canManageCategories = await getPermission("manage:categories");
    if (!canManageCategories?.isGranted) {
      return { success: false, error: "Unauthorized: Missing manage:categories permission" };
    }

    const accessToken = await getAccessTokenRaw();

    const response = await fetch(`${API_URL}/admin/categories`, {
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || "Failed to fetch categories" };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return { success: false, error: "An error occurred while fetching categories" };
  }
}

/**
 * Create a new category
 */
export async function createCategory(categoryData: {
  name: string;
  description?: string;
  parentId?: string | null;
}) {
  try {
    const { getPermission, getAccessTokenRaw } = getKindeServerSession();

    // Check permission
    const canManageCategories = await getPermission("manage:categories");
    if (!canManageCategories?.isGranted) {
      return { success: false, error: "Unauthorized: Missing manage:categories permission" };
    }

    const accessToken = await getAccessTokenRaw();

    const response = await fetch(`${API_URL}/admin/categories`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(categoryData),
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || "Failed to create category" };
    }

    const data = await response.json();

    // Revalidate categories pages
    revalidatePath("/admin/categories");
    revalidatePath("/catalog");

    return { success: true, data };
  } catch (error) {
    console.error("Error creating category:", error);
    return { success: false, error: "An error occurred while creating category" };
  }
}

/**
 * Update a category
 */
export async function updateCategory(
  categoryId: string,
  categoryData: {
    name?: string;
    description?: string;
    parentId?: string | null;
  }
) {
  try {
    const { getPermission, getAccessTokenRaw } = getKindeServerSession();

    // Check permission
    const canManageCategories = await getPermission("manage:categories");
    if (!canManageCategories?.isGranted) {
      return { success: false, error: "Unauthorized: Missing manage:categories permission" };
    }

    const accessToken = await getAccessTokenRaw();

    const response = await fetch(`${API_URL}/admin/categories/${categoryId}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(categoryData),
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || "Failed to update category" };
    }

    const data = await response.json();

    // Revalidate categories pages
    revalidatePath("/admin/categories");
    revalidatePath("/catalog");

    return { success: true, data };
  } catch (error) {
    console.error("Error updating category:", error);
    return { success: false, error: "An error occurred while updating category" };
  }
}

/**
 * Delete a category
 */
export async function deleteCategory(categoryId: string) {
  try {
    const { getPermission, getAccessTokenRaw } = getKindeServerSession();

    // Check permission
    const canManageCategories = await getPermission("manage:categories");
    if (!canManageCategories?.isGranted) {
      return { success: false, error: "Unauthorized: Missing manage:categories permission" };
    }

    const accessToken = await getAccessTokenRaw();

    const response = await fetch(`${API_URL}/admin/categories/${categoryId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || "Failed to delete category" };
    }

    // Revalidate categories pages
    revalidatePath("/admin/categories");
    revalidatePath("/catalog");

    return { success: true };
  } catch (error) {
    console.error("Error deleting category:", error);
    return { success: false, error: "An error occurred while deleting category" };
  }
}
