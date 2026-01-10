"use server";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { revalidatePath } from "next/cache";
import { ProductCondition } from "@/lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL! || "http://localhost:8080/api";

/**
 * Get current authenticated user's ID
 */
export async function getCurrentUserId() {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !user.id) {
      return { success: false, error: "User not authenticated" };
    }

    return { success: true, userId: user.id };
  } catch (error) {
    console.error("Error getting user ID:", error);
    return { success: false, error: "Failed to get user ID" };
  }
}

interface CreateProductData {
  title: string;
  description: string;
  categoryId: string;
  condition: ProductCondition;
  startingPrice: number;
  reservePrice?: number;
  buyNowPrice?: number;
  endDate: string;
  sellerId: string;
  sellerName: string;
  specifications: Record<string, any>;
}

/**
 * Create a new product
 */
export async function createProduct(productData: CreateProductData) {
  try {
    const { getPermission, getAccessTokenRaw } = getKindeServerSession();

    // Check permission
    const canManageProducts = await getPermission("manage:products");
    if (!canManageProducts?.isGranted) {
      return { success: false, error: "Unauthorized: Missing manage:products permission" };
    }

    const accessToken = await getAccessTokenRaw();

    const response = await fetch(`${API_URL}/products`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || "Failed to create product" };
    }

    const data = await response.json();

    // Revalidate products pages
    revalidatePath("/admin/products");
    revalidatePath("/catalog");

    return { success: true, data };
  } catch (error) {
    console.error("Error creating product:", error);
    return { success: false, error: "An error occurred while creating product" };
  }
}

/**
 * Upload product images
 */
export async function uploadProductImages(productId: string, formData: FormData) {
  try {
    const { getPermission, getAccessTokenRaw } = getKindeServerSession();

    // Check permission
    const canManageProducts = await getPermission("manage:products");
    if (!canManageProducts?.isGranted) {
      return { success: false, error: "Unauthorized: Missing manage:products permission" };
    }

    const accessToken = await getAccessTokenRaw();

    console.log(formData)

    const response = await fetch(`${API_URL}/upload/product-images/${productId}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || "Failed to upload images" };
    }

    const data = await response.json();

    // Revalidate products pages
    revalidatePath("/admin/products");

    return { success: true, data };
  } catch (error) {
    console.error("Error uploading images:", error);
    return { success: false, error: "An error occurred while uploading images" };
  }
}

/**
 * Delete product image
 */
export async function deleteProductImage(productId: string, imageUrl: string) {
  try {
    const { getPermission, getAccessTokenRaw } = getKindeServerSession();

    // Check permission
    const canManageProducts = await getPermission("manage:products");
    if (!canManageProducts?.isGranted) {
      return { success: false, error: "Unauthorized: Missing manage:products permission" };
    }

    const accessToken = await getAccessTokenRaw();

    const response = await fetch(`${API_URL}/admin/products/${productId}/images`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ imageUrl }),
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || "Failed to delete image" };
    }

    // Revalidate products pages
    revalidatePath("/admin/products");

    return { success: true };
  } catch (error) {
    console.error("Error deleting image:", error);
    return { success: false, error: "An error occurred while deleting image" };
  }
}

interface UpdateProductData {
  title?: string;
  description?: string;
  condition?: ProductCondition;
  images?: string[];
  reservePrice?: number;
  buyNowPrice?: number;
  endDate?: string;
  sellerName?: string;
  specifications?: Record<string, any>;
  isActive?: boolean;
}

/**
 * Update an existing product
 */
export async function updateProduct(productId: string, productData: UpdateProductData) {
  try {
    const { getPermission, getAccessTokenRaw } = getKindeServerSession();

    // Check permission
    const canManageProducts = await getPermission("manage:products");
    if (!canManageProducts?.isGranted) {
      return { success: false, error: "Unauthorized: Missing manage:products permission" };
    }

    const accessToken = await getAccessTokenRaw();

    const response = await fetch(`${API_URL}/admin/products/${productId}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || "Failed to update product" };
    }

    const data = await response.json();

    // Revalidate products pages
    revalidatePath("/admin/products");
    revalidatePath(`/product/${productId}`);
    revalidatePath("/catalog");

    return { success: true, data };
  } catch (error) {
    console.error("Error updating product:", error);
    return { success: false, error: "An error occurred while updating product" };
  }
}

/**
 * Delete a product
 */
export async function deleteProduct(productId: string) {
  try {
    const { getPermission, getAccessTokenRaw } = getKindeServerSession();

    // Check permission
    const canManageProducts = await getPermission("manage:products");
    if (!canManageProducts?.isGranted) {
      return { success: false, error: "Unauthorized: Missing manage:products permission" };
    }

    const accessToken = await getAccessTokenRaw();

    const response = await fetch(`${API_URL}/products/${productId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || "Failed to delete product" };
    }

    // Revalidate products pages
    revalidatePath("/admin/products");
    revalidatePath("/catalog");

    return { success: true };
  } catch (error) {
    console.error("Error deleting product:", error);
    return { success: false, error: "An error occurred while deleting product" };
  }
}

/**
 * Fetch all products for admin
 */
export async function fetchAdminProducts(filters?: {
  status?: string;
  category?: string;
  search?: string;
}) {
  try {
    const { getPermission, getAccessTokenRaw } = getKindeServerSession();

    // Check permission
    const canManageProducts = await getPermission("manage:products");
    if (!canManageProducts?.isGranted) {
      return { success: false, error: "Unauthorized: Missing manage:products permission" };
    }

    const accessToken = await getAccessTokenRaw();

    const params = new URLSearchParams();
    if (filters?.status) params.set("status", filters.status);
    if (filters?.category) params.set("category", filters.category);
    if (filters?.search) params.set("search", filters.search);

    const response = await fetch(
      `${API_URL}/admin/products${params.toString() ? `?${params}` : ""}`,
      {
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        next: { revalidate: 0 },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || "Failed to fetch products" };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching products:", error);
    return { success: false, error: "An error occurred while fetching products" };
  }
}
