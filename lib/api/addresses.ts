// Address API functions with caching and revalidation

import { Address } from "../types";
import { apiFetch } from "../api";

// Cache tags for revalidation
export const ADDRESS_TAGS = {
  all: "addresses",
  user: (userId: string) => `addresses-user-${userId}`,
  detail: (id: string) => `address-${id}`,
};

// Fetch all addresses for a user
export async function fetchUserAddresses(userId: string): Promise<Address[]> {
  try {
    const data = await apiFetch<Address[]>(
      `/addresses?accountId=${userId}`,
      { tags: [ADDRESS_TAGS.all, ADDRESS_TAGS.user(userId)] }
    );
    return data;
  } catch (error) {
    console.warn("API failed, returning empty addresses:", error);
    return [];
  }
}

// Fetch single address by ID
export async function fetchAddressById(id: string): Promise<Address | null> {
  try {
    const data = await apiFetch<Address>(
      `/addresses/${id}`,
      { tags: [ADDRESS_TAGS.all, ADDRESS_TAGS.detail(id)] }
    );
    return data;
  } catch (error) {
    console.warn("API failed, returning null:", error);
    return null;
  }
}

// Create new address
export async function createAddress(addressData: Omit<Address, "id" | "createdAt" | "updatedAt">): Promise<Address> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/addresses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(addressData),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    // Revalidate cache after creating
    await fetch("/api/revalidate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tag: ADDRESS_TAGS.user(addressData.userId) }),
    });

    return data;
  } catch (error) {
    console.error("Failed to create address:", error);
    throw error;
  }
}

// Update existing address
export async function updateAddress(id: string, addressData: Partial<Address>): Promise<Address> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/addresses/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(addressData),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    // Revalidate cache after updating
    await fetch("/api/revalidate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tag: ADDRESS_TAGS.detail(id) }),
    });

    return data;
  } catch (error) {
    console.error("Failed to update address:", error);
    throw error;
  }
}

// Delete address
export async function deleteAddress(id: string, userId: string): Promise<void> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/addresses/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    // Revalidate cache after deleting
    await fetch("/api/revalidate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tag: ADDRESS_TAGS.user(userId) }),
    });
  } catch (error) {
    console.error("Failed to delete address:", error);
    throw error;
  }
}

// Set default address
export async function setDefaultAddress(id: string, userId: string): Promise<Address> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/addresses/${id}/default`, {
      method: "PATCH",
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    // Revalidate user's addresses cache
    await fetch("/api/revalidate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tag: ADDRESS_TAGS.user(userId) }),
    });

    return data;
  } catch (error) {
    console.error("Failed to set default address:", error);
    throw error;
  }
}
