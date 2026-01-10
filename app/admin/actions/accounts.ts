"use server";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { revalidatePath } from "next/cache";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

/**
 * Fetch all user accounts
 */
export async function fetchAccounts(filters?: {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  try {
    const { getPermission, getAccessTokenRaw } = getKindeServerSession();

    // Check permission
    const canManageAccounts = await getPermission("manage:accounts");
    if (!canManageAccounts?.isGranted) {
      return { success: false, error: "Unauthorized: Missing manage:accounts permission" };
    }

    const accessToken = await getAccessTokenRaw();

    const params = new URLSearchParams();
    if (filters?.status) params.set("status", filters.status);
    if (filters?.search) params.set("search", filters.search);
    if (filters?.page) params.set("page", filters.page.toString());
    if (filters?.limit) params.set("limit", filters.limit.toString());

    const response = await fetch(
      `${API_URL}/admin/accounts${params.toString() ? `?${params}` : ""}`,
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
      return { success: false, error: error.message || "Failed to fetch accounts" };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching accounts:", error);
    return { success: false, error: "An error occurred while fetching accounts" };
  }
}

/**
 * Fetch single account details
 */
export async function fetchAccountById(accountId: string) {
  try {
    const { getPermission, getAccessTokenRaw } = getKindeServerSession();

    // Check permission
    const canManageAccounts = await getPermission("manage:accounts");
    if (!canManageAccounts?.isGranted) {
      return { success: false, error: "Unauthorized: Missing manage:accounts permission" };
    }

    const accessToken = await getAccessTokenRaw();

    const response = await fetch(`${API_URL}/admin/accounts/${accountId}`, {
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || "Failed to fetch account" };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching account:", error);
    return { success: false, error: "An error occurred while fetching account" };
  }
}

/**
 * Suspend/Terminate a user account
 */
export async function terminateAccount(accountId: string, reason: string, permanent: boolean = false) {
  try {
    const { getPermission, getAccessTokenRaw } = getKindeServerSession();

    // Check permission
    const canTerminateAccounts = await getPermission("terminate:accounts");
    if (!canTerminateAccounts?.isGranted) {
      return { success: false, error: "Unauthorized: Missing terminate:accounts permission" };
    }

    const accessToken = await getAccessTokenRaw();

    const response = await fetch(`${API_URL}/admin/accounts/${accountId}/terminate`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reason, permanent }),
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || "Failed to terminate account" };
    }

    const data = await response.json();

    // Revalidate accounts pages
    revalidatePath("/admin/accounts");
    revalidatePath(`/admin/accounts/${accountId}`);

    return { success: true, data };
  } catch (error) {
    console.error("Error terminating account:", error);
    return { success: false, error: "An error occurred while terminating account" };
  }
}

/**
 * Reactivate a suspended account
 */
export async function reactivateAccount(accountId: string) {
  try {
    const { getPermission, getAccessTokenRaw } = getKindeServerSession();

    // Check permission
    const canManageAccounts = await getPermission("manage:accounts");
    if (!canManageAccounts?.isGranted) {
      return { success: false, error: "Unauthorized: Missing manage:accounts permission" };
    }

    const accessToken = await getAccessTokenRaw();

    const response = await fetch(`${API_URL}/admin/accounts/${accountId}/reactivate`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || "Failed to reactivate account" };
    }

    const data = await response.json();

    // Revalidate accounts pages
    revalidatePath("/admin/accounts");
    revalidatePath(`/admin/accounts/${accountId}`);

    return { success: true, data };
  } catch (error) {
    console.error("Error reactivating account:", error);
    return { success: false, error: "An error occurred while reactivating account" };
  }
}

/**
 * Update account details
 */
export async function updateAccount(accountId: string, updates: any) {
  try {
    const { getPermission, getAccessTokenRaw } = getKindeServerSession();

    // Check permission
    const canManageAccounts = await getPermission("manage:accounts");
    if (!canManageAccounts?.isGranted) {
      return { success: false, error: "Unauthorized: Missing manage:accounts permission" };
    }

    const accessToken = await getAccessTokenRaw();

    const response = await fetch(`${API_URL}/admin/accounts/${accountId}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || "Failed to update account" };
    }

    const data = await response.json();

    // Revalidate accounts pages
    revalidatePath("/admin/accounts");
    revalidatePath(`/admin/accounts/${accountId}`);

    return { success: true, data };
  } catch (error) {
    console.error("Error updating account:", error);
    return { success: false, error: "An error occurred while updating account" };
  }
}
